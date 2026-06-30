// ════════════════════════════════════════════════════════════════════════════
// 🎨 Estilos CSS — paleta metais nobres (prata + dourado) sobre preto
// Alinhada com a marca "CB" / EB Develop — Emmanuel Bezerra
// ════════════════════════════════════════════════════════════════════════════

import type { CoverAccent } from "./metadata";

type AccentPalette = {
  light: string;     // luz alta do metal
  base: string;      // tom principal
  deep: string;      // sombra profunda
  glow: string;      // brilho de borda
};

const accentColors: Record<CoverAccent, AccentPalette> = {
  silver:   { light: "#e8eaf0", base: "#a8afbb", deep: "#4a5260", glow: "#c8cdd6" },
  gold:     { light: "#f5d99c", base: "#c89968", deep: "#7a5a32", glow: "#e8c084" },
  copper:   { light: "#e8a274", base: "#b8714a", deep: "#6a3a22", glow: "#d18556" },
  platinum: { light: "#f3f4f7", base: "#c1c7d0", deep: "#6a7280", glow: "#dadee4" },
  titanium: { light: "#d0d8e3", base: "#7a8a9e", deep: "#3a4656", glow: "#a3b1c2" },
  bronze:   { light: "#e3b878", base: "#a06f3a", deep: "#5a3a18", glow: "#c8924a" },
  steel:    { light: "#dde3eb", base: "#8b96a5", deep: "#3e4854", glow: "#b0bac8" },
};

export function renderStyles(accent: CoverAccent): string {
  const c = accentColors[accent];

  return `
    @page { size: A4; margin: 0; }

    :root {
      --silver-light: #e8eaf0;
      --silver-base:  #a8afbb;
      --silver-deep:  #4a5260;
      --gold-light:   #f5d99c;
      --gold-base:    #c89968;
      --gold-deep:    #7a5a32;
      --ink-950:      #050507;
      --ink-900:      #0d0d12;
      --ink-800:      #15151c;
      --ink-700:      #21212b;
      --ink-400:      #6a6a78;
      --paper:        #fafafc;
      --accent-light: ${c.light};
      --accent-base:  ${c.base};
      --accent-deep:  ${c.deep};
      --accent-glow:  ${c.glow};
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 11pt;
      color: #18181f;
      background: var(--paper);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      page-break-after: always;
      padding: 20mm 18mm 18mm;
      position: relative;
      background: var(--paper);
    }
    .page:last-child { page-break-after: auto; }

    .page::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3mm;
      background: linear-gradient(90deg, var(--silver-base) 0%, var(--silver-light) 50%, var(--gold-base) 50.1%, var(--gold-light) 100%);
    }

    .page-footer {
      position: absolute;
      bottom: 10mm;
      left: 18mm; right: 18mm;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: var(--ink-400);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding-top: 4mm;
      border-top: 0.3mm solid #d8d8e0;
    }
    .page-footer .brackets {
      color: var(--accent-base);
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0;
    }

    /* ─── COVER ─────────────────────────────────────────────────────────────────────── */
    .cover {
      padding: 24mm 22mm;
      background:
        radial-gradient(circle at 80% 15%, ${c.light}1a 0%, transparent 45%),
        radial-gradient(circle at 15% 85%, ${c.deep}99 0%, transparent 55%),
        linear-gradient(135deg, #050507 0%, #0d0d12 50%, ${c.deep} 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 297mm;
      overflow: hidden;
    }
    .cover::before { display: none; }

    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cb-logo {
      width: 16mm;
      height: 16mm;
      display: block;
    }

    .cover-series {
      font-size: 9pt;
      letter-spacing: 0.35em;
      font-weight: 700;
      text-transform: uppercase;
      background: linear-gradient(90deg, var(--silver-light), var(--gold-light));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      text-align: right;
    }

    .cover-content {
      max-width: 165mm;
    }

    .cover-eyebrow {
      font-size: 10pt;
      color: ${c.light};
      letter-spacing: 0.25em;
      text-transform: uppercase;
      margin-bottom: 10mm;
      font-weight: 500;
      opacity: 0.85;
    }

    .cover-title {
      font-size: 44pt;
      font-weight: 800;
      line-height: 1.02;
      letter-spacing: -0.025em;
      margin-bottom: 12mm;
      background: linear-gradient(135deg, var(--silver-light) 0%, #fff 35%, ${c.light} 65%, ${c.base} 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }

    .cover-tagline {
      font-size: 13.5pt;
      line-height: 1.55;
      color: rgba(255,255,255,0.88);
      max-width: 150mm;
      font-weight: 400;
    }

    .cover-bottom {
      border-top: 0.3mm solid rgba(255,255,255,0.15);
      padding-top: 8mm;
    }

    .cover-tagline-brand {
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 6mm;
    }
    .cover-tagline-brand .silver-text {
      background: linear-gradient(90deg, #fff, var(--silver-base));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .cover-tagline-brand .gold-text {
      background: linear-gradient(90deg, var(--gold-light), var(--gold-base));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .cover-tagline-brand .brackets {
      color: ${c.base};
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0;
      margin: 0 4mm;
    }

    .cover-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 8.5pt;
      color: rgba(255,255,255,0.55);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .cover-meta strong { color: rgba(255,255,255,0.95); font-weight: 700; }

    /* ─── TIPOGRAFIA INTERNA ──────────────────────────────────────────────────────────── */
    h1.page-title {
      font-size: 28pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin: 6mm 0 4mm;
      color: var(--ink-950);
    }
    .eyebrow {
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 0.3em;
      color: var(--accent-deep);
      text-transform: uppercase;
      margin-bottom: 2.5mm;
    }
    h2 {
      font-size: 16pt;
      font-weight: 700;
      margin: 8mm 0 3mm;
      color: var(--ink-950);
      letter-spacing: -0.01em;
    }
    h3 {
      font-size: 13pt;
      font-weight: 700;
      margin: 5mm 0 2mm;
      color: var(--ink-900);
    }
    p { line-height: 1.6; margin-bottom: 3mm; color: #2a2a32; }
    .lead { font-size: 12pt; color: #18181f; line-height: 1.55; }

    ul, ol { padding-left: 6mm; margin-bottom: 3mm; }
    li { line-height: 1.6; margin-bottom: 1.8mm; color: #2a2a32; }

    strong { color: var(--ink-950); font-weight: 700; }

    /* ─── CARDS ─────────────────────────────────────────────────────────────────────────── */
    .card {
      background: #fff;
      border: 0.3mm solid #e4e4ea;
      border-radius: 3mm;
      padding: 6mm 7mm;
      margin-bottom: 4mm;
    }
    .card-accent {
      background: #fff;
      border: 0.3mm solid #e4e4ea;
      border-left: 1mm solid var(--accent-base);
      border-radius: 2mm;
      padding: 6mm 7mm;
      margin-bottom: 4mm;
    }
    .card-dark {
      background: var(--ink-950);
      color: #e4e4ea;
      border-radius: 3mm;
      padding: 6mm 7mm;
      margin-bottom: 4mm;
      border: 0.3mm solid var(--ink-700);
    }
    .card-dark .label {
      font-size: 8.5pt;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--accent-light);
      margin-bottom: 3mm;
      font-weight: 700;
    }

    /* ─── STEP ──────────────────────────────────────────────────────────────────────────── */
    .step {
      display: flex;
      gap: 6mm;
      padding: 5mm 0;
      border-bottom: 0.3mm solid #e8e8ee;
    }
    .step:last-child { border-bottom: none; }
    .step-num {
      flex-shrink: 0;
      width: 12mm;
      height: 12mm;
      border-radius: 50%;
      background:
        radial-gradient(circle at 30% 30%, ${c.light}, ${c.base} 50%, ${c.deep});
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14pt;
      box-shadow: 0 0 0 0.5mm ${c.deep}40;
    }
    .step-body h3 { margin-top: 0.5mm; }
    .step-body p { font-size: 10.5pt; color: #4a4a55; }

    /* ─── PROMPT BLOCK (escuro) ───────────────────────────────────────────────────────────── */
    .prompt-block {
      background: var(--ink-950);
      color: #cfcfd6;
      border-radius: 3mm;
      padding: 7mm 8mm;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 8.8pt;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
      border: 0.3mm solid var(--ink-700);
      margin: 4mm 0;
      border-left: 1mm solid var(--accent-base);
    }
    .prompt-block h1, .prompt-block h2, .prompt-block h3 {
      color: ${c.light};
      font-family: 'Inter', sans-serif;
      margin: 5mm 0 2.5mm;
    }
    .prompt-block h1 { font-size: 14pt; }
    .prompt-block h2 { font-size: 12pt; }
    .prompt-block h3 { font-size: 10.5pt; }
    .prompt-block p { color: #cfcfd6; font-size: 8.8pt; line-height: 1.6; margin-bottom: 2mm; }
    .prompt-block ul, .prompt-block ol { padding-left: 5mm; }
    .prompt-block li { color: #cfcfd6; font-size: 8.8pt; line-height: 1.6; margin-bottom: 1mm; }
    .prompt-block strong { color: #fff; }
    .prompt-block code {
      background: var(--ink-800);
      color: ${c.light};
      padding: 0.4mm 1.5mm;
      border-radius: 1mm;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 8.2pt;
    }
    .prompt-block pre {
      background: var(--ink-800);
      color: ${c.light};
      padding: 3mm 4mm;
      margin: 2mm 0;
      display: block;
      overflow-x: auto;
      border-radius: 1.5mm;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
    }
    .prompt-block blockquote {
      border-left: 0.8mm solid ${c.base};
      padding-left: 4mm;
      margin: 2mm 0;
      color: #a0a0aa;
      font-style: italic;
    }
    .prompt-block table {
      border-collapse: collapse;
      width: 100%;
      font-size: 8.2pt;
      margin: 2.5mm 0;
    }
    .prompt-block th, .prompt-block td {
      border: 0.3mm solid var(--ink-700);
      padding: 1.5mm 3mm;
      text-align: left;
    }
    .prompt-block th {
      background: var(--ink-800);
      color: ${c.light};
      font-weight: 700;
    }
    .prompt-block hr {
      border: none;
      border-top: 0.3mm solid var(--ink-700);
      margin: 4mm 0;
    }

    /* ─── EXEMPLOS ─────────────────────────────────────────────────────────────────── */
    .example {
      margin-bottom: 7mm;
      padding-bottom: 6mm;
      border-bottom: 0.3mm solid #e8e8ee;
    }
    .example:last-child { border-bottom: none; }
    .example-prompt {
      background: #f3f3f7;
      padding: 5mm 6mm;
      border-radius: 2mm;
      border-left: 1mm solid var(--accent-base);
      font-style: italic;
      color: #18181f;
      margin-bottom: 3mm;
      font-size: 11pt;
    }
    .example-output {
      font-size: 10.5pt;
      color: #4a4a55;
      padding-left: 5mm;
      position: relative;
    }
    .example-output::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--accent-base);
      font-weight: 700;
    }

    /* ─── GRID ────────────────────────────────────────────────────────────────────────────── */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5mm;
      margin: 5mm 0;
    }

    /* ─── LISTA AGENTES (upsell) ───────────────────────────────────────────────────────────────── */
    .agent-list { margin-top: 5mm; }
    .agent-list-item {
      display: flex;
      gap: 4mm;
      padding: 5mm 0;
      border-bottom: 0.3mm solid #e8e8ee;
    }
    .agent-list-item:last-child { border-bottom: none; }
    .agent-list-dot {
      width: 3mm;
      height: 3mm;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--silver-base), var(--gold-base));
      margin-top: 2mm;
      flex-shrink: 0;
    }
    .agent-list-body h4 {
      font-size: 11.5pt;
      font-weight: 700;
      color: var(--ink-950);
      margin-bottom: 1.5mm;
      letter-spacing: -0.01em;
    }
    .agent-list-body p {
      font-size: 10pt;
      color: #4a4a55;
      margin-bottom: 0;
      line-height: 1.5;
    }

    /* ─── BACK COVER ───────────────────────────────────────────────────────────────────── */
    .back {
      background:
        radial-gradient(circle at 25% 25%, ${c.deep}cc 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, ${c.light}1a 0%, transparent 50%),
        linear-gradient(180deg, #050507 0%, #0d0d12 100%);
      color: #fff;
      padding: 28mm 22mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: stretch;
      min-height: 297mm;
      position: relative;
    }
    .back::before { display: none; }

    .back-logo-section {
      text-align: center;
      padding-top: 8mm;
    }

    .back-logo-section .cb-logo {
      width: 38mm;
      height: 38mm;
      margin: 0 auto 12mm;
    }

    .back-tagline {
      font-size: 22pt;
      font-weight: 800;
      letter-spacing: 0.06em;
      line-height: 1.3;
      text-transform: uppercase;
      margin-bottom: 6mm;
    }
    .back-tagline .silver-text {
      background: linear-gradient(180deg, #fff 0%, var(--silver-base) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      display: block;
    }
    .back-tagline .gold-text {
      background: linear-gradient(180deg, var(--gold-light) 0%, var(--gold-base) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      display: block;
    }

    .back-tagline-mark {
      color: ${c.base};
      font-family: 'JetBrains Mono', monospace;
      font-size: 16pt;
      letter-spacing: 0.15em;
      margin-top: 4mm;
    }

    .back-cta {
      background: rgba(255,255,255,0.04);
      border: 0.3mm solid rgba(255,255,255,0.12);
      padding: 10mm 11mm;
      border-radius: 3mm;
      backdrop-filter: blur(8px);
    }
    .back-cta h2 {
      color: #fff;
      font-size: 17pt;
      margin: 0 0 4mm;
      letter-spacing: -0.01em;
    }
    .back-cta p {
      color: rgba(255,255,255,0.78);
      font-size: 11pt;
      margin-bottom: 5mm;
      line-height: 1.55;
    }
    .back-cta-list {
      list-style: none;
      padding: 0;
    }
    .back-cta-list li {
      color: rgba(255,255,255,0.92);
      padding: 2mm 0;
      border-bottom: 0.3mm solid rgba(255,255,255,0.08);
      font-size: 10.5pt;
      letter-spacing: 0.02em;
    }
    .back-cta-list li:last-child { border: none; }
    .back-cta-list strong {
      background: linear-gradient(90deg, ${c.light}, ${c.base});
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      font-weight: 700;
    }
    .back-cta-contact {
      margin-top: 6mm;
      font-size: 13pt;
      font-weight: 700;
      letter-spacing: 0.05em;
      background: linear-gradient(90deg, ${c.light}, ${c.base});
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .back-cta-meta {
      color: rgba(255,255,255,0.55);
      font-size: 9.5pt;
      letter-spacing: 0.1em;
      margin-top: 2mm;
    }
  `;
}
