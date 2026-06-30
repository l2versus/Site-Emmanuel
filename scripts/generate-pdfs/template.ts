// ════════════════════════════════════════════════════════════════════════════
// 🧩 Template — monta o HTML de cada agente página por página
// Identidade visual: "CB" / EB Develop — Emmanuel Bezerra
// ════════════════════════════════════════════════════════════════════════════

import { renderStyles } from "./styles";
import { BRAND, type AgentPdfMeta } from "./metadata";

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
  <title>${esc(i.displayName)} — ${BRAND.serieTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
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

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── LOGO CB (SVG inline) ───────────────────────────────────────────────────────────────
function cbLogo(idSuffix: string, size = 100): string {
  return `<svg class="cb-logo" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:${size}%; height:${size}%;">
    <defs>
      <linearGradient id="silver-${idSuffix}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f0f2f7"/>
        <stop offset="35%" stop-color="#c8ced8"/>
        <stop offset="70%" stop-color="#7a8290"/>
        <stop offset="100%" stop-color="#3a4250"/>
      </linearGradient>
      <linearGradient id="gold-${idSuffix}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f5dca0"/>
        <stop offset="35%" stop-color="#d4a574"/>
        <stop offset="70%" stop-color="#9c7038"/>
        <stop offset="100%" stop-color="#5e3e18"/>
      </linearGradient>
      <linearGradient id="chev-${idSuffix}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#c8ced8"/>
        <stop offset="50%" stop-color="#a0a8b5"/>
        <stop offset="50.1%" stop-color="#c89968"/>
        <stop offset="100%" stop-color="#a07840"/>
      </linearGradient>
    </defs>
    <!-- C — lado esquerdo prata -->
    <path d="M 95 25
             L 60 25
             Q 25 25 25 60
             L 25 140
             Q 25 175 60 175
             L 95 175
             L 95 145
             L 70 145
             Q 55 145 55 130
             L 55 70
             Q 55 55 70 55
             L 95 55 Z"
          fill="url(#silver-${idSuffix})"/>
    <!-- B — lado direito dourado -->
    <path d="M 105 25
             L 140 25
             Q 175 25 175 60
             L 175 140
             Q 175 175 140 175
             L 105 175
             L 105 145
             L 130 145
             Q 145 145 145 130
             L 145 70
             Q 145 55 130 55
             L 105 55 Z"
          fill="url(#gold-${idSuffix})"/>
    <!-- Chevron </> central -->
    <path d="M 78 85 L 65 100 L 78 115" stroke="url(#silver-${idSuffix})" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="97" y="80" width="6" height="40" rx="2" fill="url(#chev-${idSuffix})" transform="rotate(15 100 100)"/>
    <path d="M 122 85 L 135 100 L 122 115" stroke="url(#gold-${idSuffix})" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ─── PÁGINA 1: CAPA ───────────────────────────────────────────────────────────────
function renderCover(i: TemplateInput): string {
  return `<section class="page cover">
    <div class="cover-top">
      ${cbLogo("cover", 100)}
      <div class="cover-series">${BRAND.serieTitle}</div>
    </div>

    <div class="cover-content">
      <div class="cover-eyebrow">Agente para Claude, ChatGPT, Gemini — ou qualquer LLM</div>
      <h1 class="cover-title">${esc(i.displayName)}</h1>
      <p class="cover-tagline">${esc(i.meta.pdfTagline)}</p>
    </div>

    <div class="cover-bottom">
      <div class="cover-tagline-brand">
        <span class="silver-text">${BRAND.taglineLine1}</span>
        <span class="brackets">&lt;/&gt;</span>
        <span class="gold-text">${BRAND.taglineLine2}</span>
      </div>
      <div class="cover-meta">
        <div><strong>${BRAND.name}</strong> · ${BRAND.founder} · ${BRAND.city}</div>
        <div>v${esc(i.version)} · PT-BR</div>
      </div>
    </div>
  </section>`;
}

// ─── PÁGINA 2: SOBRE ─────────────────────────────────────────────────────────────
function renderAbout(i: TemplateInput): string {
  return `<section class="page">
    <div class="eyebrow">Sobre este agente</div>
    <h1 class="page-title">${esc(i.displayName)}</h1>
    <p class="lead">${esc(i.meta.pdfTagline)}</p>

    <div class="grid-2">
      <div class="card">
        <div class="eyebrow">Para quem é</div>
        <p>${esc(i.meta.paraQuemE)}</p>
      </div>
      <div class="card-accent">
        <div class="eyebrow">Tempo até o primeiro valor</div>
        <p style="font-size: 16pt; font-weight: 800; color: var(--ink-950); margin-bottom: 2mm; letter-spacing: -0.02em;">5 minutos</p>
        <p style="font-size: 10pt; color: #4a4a55;">Copia, cola na IA, faz a primeira pergunta. Pronto.</p>
      </div>
    </div>

    <h2>O que você recebe</h2>
    <ul>
      ${i.meta.oQueEntrega.map((d) => `<li>${esc(d)}</li>`).join("")}
    </ul>

    <div class="page-footer">
      <span>${BRAND.name} · ${BRAND.serieTitle}</span>
      <span class="brackets">&lt;/&gt;</span>
      <span>${esc(i.displayName)}</span>
    </div>
  </section>`;
}

// ─── PÁGINA 3: COMO USAR EM 3 PASSOS ─────────────────────────────────────────────────────────
function renderHowToUse(_i: TemplateInput): string {
  return `<section class="page">
    <div class="eyebrow">Como usar</div>
    <h1 class="page-title">Em 3 passos. Sem instalação.</h1>
    <p class="lead">Funciona em ChatGPT (free ou Plus), Claude, Gemini, Copilot, Groq — qualquer IA conversacional.</p>

    <div style="margin-top: 8mm;">
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

    <div class="card-accent" style="margin-top: 10mm;">
      <div class="eyebrow">Dica de quem usa em produção</div>
      <p style="margin-bottom: 0;">Se a IA começar a esquecer instruções após muitas mensagens, abra <strong>nova conversa</strong> e cole o agente de novo. É normal — contexto tem limite.</p>
    </div>

    <div class="page-footer">
      <span>${BRAND.name} · ${BRAND.serieTitle}</span>
      <span class="brackets">&lt;/&gt;</span>
      <span>Como usar</span>
    </div>
  </section>`;
}

// ─── PÁGINA 4+: O PROMPT ────────────────────────────────────────────────────────────
function renderPromptCopy(i: TemplateInput): string {
  return `<section class="page">
    <div class="eyebrow">O agente — copie tudo abaixo</div>
    <h1 class="page-title">${esc(i.displayName)}</h1>
    <p class="lead">
      Selecione <strong>todo</strong> o conteúdo dentro da caixa preta abaixo (segue pelas próximas páginas)
      e cole como sua primeira mensagem na IA.
    </p>

    <div class="prompt-block">
${i.bodyHtml}
    </div>
  </section>`;
}

// ─── PÁGINA: EXEMPLOS ─────────────────────────────────────────────────────────────────
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
        <div class="example-prompt">${esc(ex.pergunta)}</div>
        <div class="example-output"><strong>O que você recebe:</strong> ${esc(ex.vocePega)}</div>
      </div>`
      )
      .join("")}

    <div class="page-footer">
      <span>${BRAND.name} · ${BRAND.serieTitle}</span>
      <span class="brackets">&lt;/&gt;</span>
      <span>Exemplos práticos</span>
    </div>
  </section>`;
}

// ─── PÁGINA: UPSELL ──────────────────────────────────────────────────────────────────
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
            <h4>${esc(a.display)}</h4>
            <p>${esc(a.tagline)}</p>
          </div>
        </div>`
        )
        .join("")}
    </div>

    <div class="page-footer">
      <span>${BRAND.name} · ${BRAND.serieTitle}</span>
      <span class="brackets">&lt;/&gt;</span>
      <span>O time completo</span>
    </div>
  </section>`;
}

// ─── PÁGINA FINAL: CTA ─────────────────────────────────────────────────────────────────
function renderBackCover(_i: TemplateInput): string {
  return `<section class="page back">
    <div class="back-logo-section">
      ${cbLogo("back", 100)}
      <div class="back-tagline">
        <span class="silver-text">${BRAND.taglineLine1}</span>
        <span class="gold-text">${BRAND.taglineLine2}</span>
      </div>
      <div class="back-tagline-mark">&lt;/&gt;</div>
    </div>

    <div class="back-cta">
      <h2>Quer este time IA rodando 24/7 na sua operação?</h2>
      <p>Implantamos o sistema completo direto no seu negócio: bot WhatsApp, CRM, painéis, integrações — chave na mão.</p>
      <ul class="back-cta-list">
        <li><strong>Bot WhatsApp + CRM</strong> — implantação e gestão</li>
        <li><strong>Automação sob medida</strong> — conecta seu sistema atual</li>
        <li><strong>Consultoria técnica</strong> — arquitetura, IA, integrações</li>
        <li><strong>Sites e sistemas</strong> — Next.js, Prisma, IA com RAG</li>
      </ul>
      <div class="back-cta-contact">${BRAND.name} · ${BRAND.founder}</div>
      <div class="back-cta-meta">${BRAND.contact} · ${BRAND.city}</div>
    </div>
  </section>`;
}
