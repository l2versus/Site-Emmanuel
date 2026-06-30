// ════════════════════════════════════════════════════════════════════════════
// 🎨 Estilos CSS — paleta EB Develop (coral + dark) com variação por agente
// ════════════════════════════════════════════════════════════════════════════

import type { CoverAccent } from "./metadata";

const accentColors: Record<CoverAccent, { from: string; to: string; solid: string }> = {
  rose:    { from: "#e14a72", to: "#8d1f3f", solid: "#e14a72" }, // EB principal
  amber:   { from: "#f59e0b", to: "#92400e", solid: "#f59e0b" },
  emerald: { from: "#10b981", to: "#064e3b", solid: "#10b981" },
  cyan:    { from: "#06b6d4", to: "#0e7490", solid: "#06b6d4" },
  indigo:  { from: "#6366f1", to: "#3730a3", solid: "#6366f1" },
  purple:  { from: "#a855f7", to: "#581c87", solid: "#a855f7" },
  blue:    { from: "#3b82f6", to: "#1e3a8a", solid: "#3b82f6" },
};

export function renderStyles(accent: CoverAccent): string {
  const c = accentColors[accent];
  return `
    @page { size: A4; margin: 0; }

    :root {
      --eb-brand: #e14a72;
      --eb-brand-dark: #b13558;
      --eb-gold: #d99c22;
      --eb-dark-950: #0a0a0d;
      --eb-dark-900: #14141a;
      --eb-dark-800: #1f1f29;
      --eb-dark-700: #2a2a37;
      --eb-dark-400: #6b6b7d;
      --accent: ${c.solid};
      --accent-from: ${c.from};
      --accent-to: ${c.to};
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 11pt;
      color: #1a1a22;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      page-break-after: always;
      padding: 18mm 16mm;
      position: relative;
      background: #fff;
    }
    .page:last-child { page-break-after: auto; }

    .page::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4mm;
      background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
    }

    .page-footer {
      position: absolute;
      bottom: 8mm;
      left: 16mm; right: 16mm;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: var(--eb-dark-400);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    /* ─── COVER ─────────────────────────────────────────────────────────────────────── */
    .cover {
      padding: 24mm 18mm;
      background:
        radial-gradient(circle at 80% 10%, ${c.from}33 0%, transparent 50%),
        radial-gradient(circle at 20% 90%, ${c.to}66 0%, transparent 50%),
        linear-gradient(135deg, #0a0a0d 0%, ${c.to} 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 297mm;
    }
    .cover::before { display: none; }

    .cover-brand {
      font-size: 10pt;
      letter-spacing: 0.35em;
      font-weight: 700;
      color: ${c.solid};
      text-transform: uppercase;
    }

    .cover-eyebrow {
      font-size: 11pt;
      color: rgba(255,255,255,0.65);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 8mm;
    }

    .cover-title {
      font-size: 42pt;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.02em;
      margin-bottom: 10mm;
      background: linear-gradient(135deg, #fff 0%, ${c.from} 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }

    .cover-tagline {
      font-size: 14pt;
      line-height: 1.5;
      color: rgba(255,255,255,0.85);
      max-width: 150mm;
      font-weight: 400;
    }

    .cover-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid rgba(255,255,255,0.15);
      padding-top: 6mm;
      font-size: 9pt;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .cover-footer strong { color: #fff; font-weight: 700; }

    /* ─── TIPOGRAFIA INTERNA ──────────────────────────────────────────────────────────── */
    h1.page-title {
      font-size: 28pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin: 6mm 0 3mm;
      color: #0a0a0d;
    }
    .eyebrow {
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 0.25em;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 2mm;
    }
    h2 {
      font-size: 16pt;
      font-weight: 700;
      margin: 6mm 0 3mm;
      color: #0a0a0d;
      letter-spacing: -0.01em;
    }
    h3 {
      font-size: 13pt;
      font-weight: 700;
      margin: 5mm 0 2mm;
      color: #1a1a22;
    }
    p { line-height: 1.55; margin-bottom: 3mm; color: #2a2a37; }
    .lead { font-size: 12pt; color: #1a1a22; line-height: 1.5; }

    ul, ol { padding-left: 6mm; margin-bottom: 3mm; }
    li { line-height: 1.55; margin-bottom: 1.5mm; color: #2a2a37; }

    strong { color: #0a0a0d; font-weight: 700; }

    /* ─── CARDS / BLOCOS ────────────────────────────────────────────────────────────── */
    .card {
      background: #f7f7fa;
      border: 1px solid #e8e8ee;
      border-radius: 4mm;
      padding: 5mm 6mm;
      margin-bottom: 4mm;
    }
    .card-accent {
      background: linear-gradient(135deg, ${c.from}10, ${c.from}05);
      border: 1px solid ${c.solid}40;
      border-left: 1.5mm solid var(--accent);
      border-radius: 3mm;
      padding: 5mm 6mm;
      margin-bottom: 4mm;
    }
    .card-dark {
      background: var(--eb-dark-950);
      color: #e8e8ee;
      border-radius: 3mm;
      padding: 6mm 7mm;
      margin-bottom: 4mm;
      border: 1px solid var(--eb-dark-700);
    }
    .card-dark .label {
      font-size: 8.5pt;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 3mm;
      font-weight: 700;
    }

    /* ─── STEP / NUMBERED LIST ──────────────────────────────────────────────────────── */
    .step {
      display: flex;
      gap: 5mm;
      padding: 4mm 0;
      border-bottom: 1px solid #eee;
    }
    .step:last-child { border-bottom: none; }
    .step-num {
      flex-shrink: 0;
      width: 11mm;
      height: 11mm;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14pt;
    }
    .step-body h3 { margin-top: 0; }
    .step-body p { font-size: 10.5pt; color: #4a4a5a; }

    /* ─── BLOCO DO PROMPT (copia e cola) ─────────────────────────────────────────────────── */
    .prompt-block {
      background: var(--eb-dark-950);
      color: #d4d4d8;
      border-radius: 3mm;
      padding: 6mm 7mm;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 9pt;
      line-height: 1.55;
      white-space: pre-wrap;
      word-break: break-word;
      border: 1px solid var(--eb-dark-700);
      margin: 3mm 0 5mm;
    }
    .prompt-block h1, .prompt-block h2, .prompt-block h3 {
      color: ${c.solid};
      font-family: 'Inter', sans-serif;
      margin: 4mm 0 2mm;
    }
    .prompt-block h1 { font-size: 14pt; }
    .prompt-block h2 { font-size: 12pt; }
    .prompt-block h3 { font-size: 10.5pt; }
    .prompt-block p { color: #d4d4d8; font-size: 9pt; line-height: 1.55; margin-bottom: 2mm; }
    .prompt-block ul, .prompt-block ol { padding-left: 5mm; }
    .prompt-block li { color: #d4d4d8; font-size: 9pt; line-height: 1.55; margin-bottom: 1mm; }
    .prompt-block strong { color: #fff; }
    .prompt-block code, .prompt-block pre {
      background: var(--eb-dark-800);
      color: ${c.from};
      padding: 0.5mm 1.5mm;
      border-radius: 1mm;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 8.5pt;
    }
    .prompt-block pre {
      padding: 3mm 4mm;
      margin: 2mm 0;
      display: block;
      overflow-x: auto;
    }
    .prompt-block blockquote {
      border-left: 1mm solid ${c.solid};
      padding-left: 4mm;
      margin: 2mm 0;
      color: #a0a0aa;
      font-style: italic;
    }
    .prompt-block table {
      border-collapse: collapse;
      width: 100%;
      font-size: 8.5pt;
      margin: 2mm 0;
    }
    .prompt-block th, .prompt-block td {
      border: 1px solid var(--eb-dark-700);
      padding: 1.5mm 3mm;
      text-align: left;
    }
    .prompt-block th {
      background: var(--eb-dark-800);
      color: ${c.from};
      font-weight: 700;
    }
    .prompt-block hr {
      border: none;
      border-top: 1px solid var(--eb-dark-700);
      margin: 4mm 0;
    }

    /* ─── EXEMPLOS ─────────────────────────────────────────────────────────────────── */
    .example {
      margin-bottom: 6mm;
      padding-bottom: 5mm;
      border-bottom: 1px solid #eee;
    }
    .example:last-child { border-bottom: none; }
    .example-prompt {
      background: #f7f7fa;
      padding: 4mm 5mm;
      border-radius: 2mm;
      border-left: 1mm solid var(--accent);
      font-style: italic;
      color: #1a1a22;
      margin-bottom: 3mm;
    }
    .example-output {
      font-size: 10.5pt;
      color: #4a4a5a;
      padding-left: 5mm;
      position: relative;
    }
    .example-output::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--accent);
      font-weight: 700;
    }

    /* ─── GRID 2 COL ───────────────────────────────────────────────────────────────── */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5mm;
      margin: 4mm 0;
    }

    /* ─── UPSELL LIST ───────────────────────────────────────────────────────────── */
    .agent-list { margin-top: 4mm; }
    .agent-list-item {
      display: flex;
      gap: 4mm;
      padding: 4mm 0;
      border-bottom: 1px solid #eee;
    }
    .agent-list-item:last-child { border-bottom: none; }
    .agent-list-dot {
      width: 3mm;
      height: 3mm;
      border-radius: 50%;
      background: var(--accent);
      margin-top: 2mm;
      flex-shrink: 0;
    }
    .agent-list-body h4 {
      font-size: 11pt;
      font-weight: 700;
      color: #0a0a0d;
      margin-bottom: 1mm;
    }
    .agent-list-body p {
      font-size: 10pt;
      color: #4a4a5a;
      margin-bottom: 0;
    }

    /* ─── BACK COVER ────────────────────────────────────────────────────────────── */
    .back {
      background: linear-gradient(135deg, #0a0a0d 0%, ${c.to} 100%);
      color: #fff;
      padding: 30mm 18mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 297mm;
    }
    .back::before { display: none; }
    .back-quote {
      font-size: 22pt;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.01em;
      margin-bottom: 8mm;
      max-width: 160mm;
    }
    .back-quote-mark {
      font-size: 60pt;
      line-height: 0.5;
      color: ${c.solid};
      margin-bottom: 6mm;
      font-family: Georgia, serif;
    }
    .back-cta {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      padding: 8mm 10mm;
      border-radius: 4mm;
    }
    .back-cta h2 {
      color: #fff;
      font-size: 16pt;
      margin: 0 0 3mm;
    }
    .back-cta p {
      color: rgba(255,255,255,0.8);
      font-size: 11pt;
      margin-bottom: 4mm;
      line-height: 1.5;
    }
    .back-cta-list {
      list-style: none;
      padding: 0;
    }
    .back-cta-list li {
      color: rgba(255,255,255,0.9);
      padding: 1.5mm 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-size: 10.5pt;
      letter-spacing: 0.02em;
    }
    .back-cta-list li:last-child { border: none; }
    .back-cta-list strong { color: ${c.solid}; font-weight: 700; }
  `;
}
