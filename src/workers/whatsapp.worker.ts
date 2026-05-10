import { Worker, type Job } from "bullmq";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { QUEUES, type WhatsappInboundJob } from "@/lib/queue";
import { runAgent } from "@/lib/agents/run";
import { sendText } from "@/lib/evolution/client";
import { detectInjection } from "@/lib/security/injection";
import { env } from "@/lib/env";

async function findOrCreateLead(phone: string, pushName: string | null) {
  const existing = await prisma.lead.findUnique({ where: { telefone: phone } });
  if (existing) {
    return prisma.lead.update({
      where: { id: existing.id },
      data: {
        ultimoContato: new Date(),
        nome: existing.nome ?? pushName ?? null,
      },
    });
  }
  return prisma.lead.create({
    data: {
      telefone: phone,
      nome: pushName,
      origem: "WHATSAPP",
      estagio: "NOVO",
    },
  });
}

async function findOrCreateConversation(leadId: string) {
  const open = await prisma.conversation.findFirst({
    where: { leadId, status: "ABERTA", canal: "WHATSAPP" },
    orderBy: { createdAt: "desc" },
  });
  if (open) return open;
  return prisma.conversation.create({
    data: {
      leadId,
      canal: "WHATSAPP",
      agenteAtivo: env.AGENT_DEFAULT,
    },
  });
}

export const whatsappWorker = new Worker<WhatsappInboundJob>(
  QUEUES.whatsappInbound,
  async (job: Job<WhatsappInboundJob>) => {
    const { fromNumber, pushName, text, evolutionMessageId } = job.data;
    if (!text) return;

    const lead = await findOrCreateLead(fromNumber, pushName);

    if (lead.optOut || lead.bloqueado) {
      console.log(`[worker] skipping lead ${lead.id} (optOut=${lead.optOut} bloqueado=${lead.bloqueado})`);
      return;
    }

    // Comando PARAR (LGPD)
    if (/^\s*parar\s*$/i.test(text)) {
      await prisma.lead.update({ where: { id: lead.id }, data: { optOut: true } });
      await sendText(
        fromNumber,
        "Tudo bem. Não vou mais te enviar mensagens. Se mudar de ideia, é só me chamar."
      );
      return;
    }

    const conv = await findOrCreateConversation(lead.id);

    const inboundInjection = detectInjection(text);
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        direcao: "INBOUND",
        conteudo: text,
        evolutionMessageId,
        flagsSeguranca: inboundInjection.detected ? [`injection:${inboundInjection.pattern}`] : [],
      },
    });

    if (inboundInjection.detected) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { flagsSeguranca: { push: `injection:${inboundInjection.pattern}` } },
      });
    }

    const agentName = conv.agenteAtivo ?? env.AGENT_DEFAULT;
    const result = await runAgent({
      agentName,
      conversationId: conv.id,
      userMessage: text,
    });

    if (result.blocked || !result.reply) {
      console.log(`[worker] blocked or no reply for conv ${conv.id} (${result.blockedReason ?? "empty"})`);
      return;
    }

    await sendText(fromNumber, result.reply);

    await prisma.message.create({
      data: {
        conversationId: conv.id,
        direcao: "OUTBOUND",
        conteudo: result.reply,
        agentRunId: result.agentRunId,
      },
    });

    await prisma.conversation.update({
      where: { id: conv.id },
      data: { ultimaMensagemEm: new Date() },
    });
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

whatsappWorker.on("completed", (job) => {
  console.log(`[worker] completed ${job.id}`);
});

whatsappWorker.on("failed", (job, err) => {
  console.error(`[worker] failed ${job?.id}:`, err.message);
});
