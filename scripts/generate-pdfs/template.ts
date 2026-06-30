// ════════════════════════════════════════════════════════════════════════════
// 🧩 Template — monta o HTML de cada agente página por página
// ════════════════════════════════════════════════════════════════════════════

import { renderStyles } from "./styles";
import type { AgentPdfMeta } from "./metadata";

export type TemplateInput = {
  agentName: string;
  displayName: string;
  version: string;
  role: string;
  bodyHtml: string;
  meta: AgentPdfMeta;
  allAgents: { name: string; display: string; tagline: string }[];
};

export function buildHtml(i: TemplateInput): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${escape(i.displayName)} — Time IA EB Develop</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${renderStyles(i.meta.coverAccent)}</style>
</head>
<body>
  ${renderCover(i)}
  ${renderAbout(i)}
  ${renderHowToUse(i)}
  ${renderPromptCopy(i)}
  ${renderExamples(i)}
  ${renderUpsell(i)}
  ${renderBackCover(i)}
</body>
</html>`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── PÁGINA 1: CAPA ───────────────────────────────────────────────────────────────
function renderCover(i: TemplateInput): string {
  return `<section class="page cover">
    <div>
      <div class="cover-brand">EB DEVELOP · TIME IA</div>
    </div>
    <div>
      <div class="cover-eyebrow">Agente para Claude, ChatGPT, Gemini ou qualquer LLM</div>
      <h1 class="cover-title">${escape(i.displayName)}</h1>
      <p class="cover-tagline">${escape(i.meta.pdfTagline)}</p>
    </div>
    <div class="cover-footer">
      <div>v${escape(i.version)} · português brasileiro</div>
      <div><strong>${escape(i.role || "AI Agent")}</strong></div>
    </div>
  </section>`;
}

// ─── PÁGINA 2: SOBRE ─────────────────────────────────────────────────────────────
function renderAbout(i: TemplateInput): string {
  return `<section class="page">
    <div class="eyebrow">Sobre este agente</div>
    <h1 class="page-title">${escape(i.displayName)}</h1>
    <p class="lead">${escape(i.meta.pdfTagline)}</p>

    <div class="grid-2">
      <div class="card">
        <div class="eyebrow">Para quem é</div>
        <p>${escape(i.meta.paraQuemE)}</p>
      </div>
      <div class="card-accent">
        <div class="eyebrow">Tempo até o primeiro valor</div>
        <p style="font-size: 14pt; font-weight: 700; color: #0a0a0d;">5 minutos</p>
        <p style="font-size: 10pt;">Copia, cola na IA, faz a primeira pergunta. Pronto.</p>
      </div>
    </div>

    <h2>O que você recebe</h2>
    <ul>
      ${i.meta.oQueEntrega.map((d) => `<li>${escape(d)}</li>`).join("")}
    </ul>

    <div class="page-footer">
      <span>EB Develop · Time IA</span>
      <span>${escape(i.displayName)}</span>
    </div>
  </section>`;
}

// ─── PÁGINA 3: COMO USAR EM 3 PASSOS ─────────────────────────────────────────────────────────
function renderHowToUse(i: TemplateInput): string {
  return `<section class="page">
    <div class="eyebrow">Como usar</div>
    <h1 class="page-title">Em 3 passos. Sem instalação.</h1>
    <p class="lead">Funciona em ChatGPT (free ou Plus), Claude, Gemini, Copilot, Groq — qualquer IA conversacional.</p>

    <div style="margin-top: 6mm;">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-body">
          <h3>Abra a IA da sua preferência</h3>
          <p>ChatGPT (<strong>chat.openai.com</strong>), Claude (<strong>claude.ai</strong>), Gemini (<strong>gemini.google.com</strong>) ou outro. Pode usar a versão gratuita.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-body">
          <h3>Comece uma nova conversa</h3>
          <p>E cole <strong>todo o conteúdo da próxima página</strong> (o agente em si) como sua primeira mensagem. A IA passa a se comportar como este especialista.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-body">
          <h3>Comece a usar</h3>
          <p>Faça perguntas, descreva situações, peça opinião. Mantenha a mesma conversa pra preservar contexto. Veja exemplos práticos no final deste material.</p>
        </div>
      </div>
    </div>

    <div class="card-accent" style="margin-top: 8mm;">
      <div class="eyebrow">Dica de quem usa em produção</div>
      <p>Se a IA começar a esquecer instruções após muitas mensagens, abra <strong>nova conversa</strong> e cole o agente de novo. É normal — contexto tem limite.</p>
    </div>

    <div class="page-footer">
      <span>EB Develop · Time IA</span>
      <span>Como usar</span>
    </div>
  </section>`;
}

// ─── PÁGINA 4+: O PROMPT (copia e cola) ───────────────────────────────────────────────────────
function renderPromptCopy(i: TemplateInput): string {
  return `<section class="page">
    <div class="eyebrow">O agente — copie tudo abaixo</div>
    <h1 class="page-title">${escape(i.displayName)}</h1>
    <p class="lead">
      Selecione <strong>todo</strong> o conteúdo dentro da caixa preta abaixo (é longa — segue pelas próximas páginas)
      e cole como sua primeira mensagem na IA.
    </p>

    <div class="prompt-block">
${i.bodyHtml}
    </div>
  </section>`;
}

// ─── PÁGINA: EXEMPLOS PRÁTICOS ─────────────────────────────────────────────────────────────────
function renderExamples(i: TemplateInput): string {
  return `<section class="page">
    <div class="eyebrow">Exemplos práticos</div>
    <h1 class="page-title">3 perguntas pra testar agora</h1>
    <p class="lead">Cole o agente, depois digite uma destas perguntas. Você vai sentir a diferença na próxima resposta.</p>

    ${i.meta.examples
      .map(
        (ex, idx) => `
      <div class="example">
        <div class="eyebrow">Exemplo ${idx + 1}</div>
        <div class="example-prompt">${escape(ex.pergunta)}</div>
        <div class="example-output"><strong>O que você recebe:</strong> ${escape(ex.vocePega)}</div>
      </div>`
      )
      .join("")}

    <div class="page-footer">
      <span>EB Develop · Time IA</span>
      <span>Exemplos práticos</span>
    </div>
  </section>`;
}

// ─── PÁGINA: OUTROS AGENTES DO TIME (upsell) ───────────────────────────────────────────────────────
function renderUpsell(i: TemplateInput): string {
  const others = i.allAgents.filter((a) => a.name !== i.agentName);
  return `<section class="page">
    <div class="eyebrow">O time IA completo</div>
    <h1 class="page-title">Este é 1 dos 7 agentes</h1>
    <p class="lead">Cada um especialista no seu domínio. Juntos eles formam um <strong>conselho consultivo</strong> que você tem dentro do ChatGPT.</p>

    <div class="agent-list">
      ${others
        .map(
          (a) => `
        <div class="agent-list-item">
          <div class="agent-list-dot"></div>
          <div class="agent-list-body">
            <h4>${escape(a.display)}</h4>
            <p>${escape(a.tagline)}</p>
          </div>
        </div>`
        )
        .join("")}
    </div>

    <div class="page-footer">
      <span>EB Develop · Time IA</span>
      <span>O time completo</span>
    </div>
  </section>`;
}

// ─── PÁGINA FINAL: CTA ─────────────────────────────────────────────────────────────────
function renderBackCover(i: TemplateInput): string {
  return `<section class="page back">
    <div>
      <div class="back-quote-mark">“</div>
      <p class="back-quote">
        Você não está contratando um sistema. Está comprando tempo e escala.
      </p>
      <p style="color: rgba(255,255,255,0.5); font-size: 10pt; letter-spacing: 0.05em;">
        — EB DEVELOP
      </p>
    </div>

    <div class="back-cta">
      <h2>Quer este agente rodando no seu WhatsApp 24/7?</h2>
      <p>Implantamos o time IA completo direto na sua operação: bot WhatsApp, CRM, painel admin, integrações — chave na mão.</p>
      <ul class="back-cta-list">
        <li><strong>Bot WhatsApp + CRM</strong> — implantação completa</li>
        <li><strong>Automação sob medida</strong> — conecta seu sistema atual</li>
        <li><strong>Consultoria técnica</strong> — arquitetura, IA, integrações</li>
        <li><strong>Sites e sistemas</strong> — Next.js, Prisma, IA com RAG</li>
      </ul>
      <p style="margin-top: 5mm; font-size: 13pt; color: var(--accent); font-weight: 700;">
        Fale com a EB Develop
      </p>
      <p style="color: rgba(255,255,255,0.7); font-size: 10pt;">
        contactl2versus@gmail.com · Fortaleza, CE
      </p>
    </div>
  </section>`;
}
