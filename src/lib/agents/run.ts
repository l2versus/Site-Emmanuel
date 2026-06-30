import { prisma } from "../prisma";
import { loadAgentCached } from "./loader";
import { groq, DEFAULT_MODEL, MAX_TOKENS } from "../llm/client";
import { isKilled } from "../security/kill-switch";
import { detectInjection, SAFE_REFUSAL } from "../security/injection";

export type RunInput = {
  agentName: string;
  conversationId: string;
  userMessage: string;
};

export type RunResult = {
  reply: string | null;
  blocked: boolean;
  blockedReason?: string;
  agentRunId: string;
};

export async function runAgent(input: RunInput): Promise<RunResult> {
  const { agentName, conversationId, userMessage } = input;

  // 1) Kill switch
  if (await isKilled(agentName)) {
    const run = await prisma.agentRun.create({
      data: {
        conversationId,
        agente: agentName,
        versaoPrompt: "n/a",
        modelo: "n/a",
        input: { userMessage },
        status: "BLOQUEADO_KILL_SWITCH",
        finishedAt: new Date(),
      },
    });
    return { reply: null, blocked: true, blockedReason: "kill_switch", agentRunId: run.id };
  }

  // 2) Injection detection (camada 1 — antes do LLM)
  const injection = detectInjection(userMessage);

  // 3) Carrega agente (model_recommendation do MD é dica;
  //    runtime usa env.LLM_DEFAULT_MODEL para garantir compatibilidade com o provider).
  const agent = await loadAgentCached(agentName);
  const modelInUse = DEFAULT_MODEL;
  const startedAt = Date.now();

  const run = await prisma.agentRun.create({
    data: {
      conversationId,
      agente: agentName,
      versaoPrompt: agent.version,
      modelo: modelInUse,
      input: { userMessage, injection },
      status: "EM_EXECUCAO",
      injectionDetectada: injection.detected,
      injectionPadrao: injection.pattern,
    },
  });

  // 4) Se injeção detectada, recusa direto sem chamar LLM
  if (injection.detected) {
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "BLOQUEADO_INJECTION",
        output: SAFE_REFUSAL,
        finishedAt: new Date(),
        latenciaMs: Date.now() - startedAt,
      },
    });
    return { reply: SAFE_REFUSAL, blocked: false, agentRunId: run.id };
  }

  // 5) Histórico (últimas 20 mensagens)
  const history = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { enviadaEm: "asc" },
    take: 20,
  });

  // 6) Chama LLM (Groq Chat Completions — OpenAI-compatible API)
  try {
    const completion = await groq.chat.completions.create({
      model: modelInUse,
      max_tokens: MAX_TOKENS,
      temperature: agent.temperature,
      messages: [
        { role: "system", content: agent.systemPrompt },
        ...history.map((m) => ({
          role: m.direcao === "INBOUND" ? ("user" as const) : ("assistant" as const),
          content: m.conteudo,
        })),
        { role: "user" as const, content: userMessage },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    const inputTokens = completion.usage?.prompt_tokens ?? null;
    const outputTokens = completion.usage?.completion_tokens ?? null;

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "CONCLUIDO",
        output: text,
        inputTokens,
        outputTokens,
        finishedAt: new Date(),
        latenciaMs: Date.now() - startedAt,
      },
    });

    return { reply: text, blocked: false, agentRunId: run.id };
  } catch (err) {
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "ERRO",
        errorMessage: err instanceof Error ? err.message : String(err),
        finishedAt: new Date(),
        latenciaMs: Date.now() - startedAt,
      },
    });
    throw err;
  }
}
