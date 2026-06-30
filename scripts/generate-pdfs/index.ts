// ════════════════════════════════════════════════════════════════════════════
// 🚀 Gera os PDFs dos agentes
//
// Como rodar:
//   npm install               # primeira vez (baixa Chromium do puppeteer)
//   npm run pdf:generate
//
// Saída: dist/pdfs/<agente>.pdf (7 arquivos)
// ════════════════════════════════════════════════════════════════════════════

import { promises as fs } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import matter from "gray-matter";
import { marked } from "marked";
import { agentMeta, ORDER } from "./metadata";
import { buildHtml } from "./template";

const AGENTS_DIR = path.join(process.cwd(), "agents");
const OUT_DIR = path.join(process.cwd(), "dist", "pdfs");

async function main(): Promise<void> {
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Pré-carrega o tagline de todos os agentes pra usar no upsell
  const allAgentsData = await Promise.all(
    ORDER.map(async (name) => {
      const filePath = path.join(AGENTS_DIR, `${name}.md`);
      const raw = await fs.readFile(filePath, "utf-8");
      const fm = matter(raw).data as Record<string, unknown>;
      const meta = agentMeta[name];
      return {
        name,
        display: (fm.display_name as string) ?? (fm.name as string) ?? name,
        tagline: meta?.pdfTagline ?? "",
      };
    })
  );

  console.log(`\n🔨 Gerando PDFs em ${OUT_DIR}\n`);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const name of ORDER) {
      const filePath = path.join(AGENTS_DIR, `${name}.md`);
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = matter(raw);
      const fm = parsed.data as Record<string, unknown>;
      const bodyHtml = marked.parse(parsed.content) as string;
      const meta = agentMeta[name];

      if (!meta) {
        console.warn(`⚠️  Sem metadata pra "${name}" — pulando.`);
        continue;
      }

      const html = buildHtml({
        agentName: name,
        displayName: (fm.display_name as string) ?? (fm.name as string) ?? name,
        version: (fm.version as string) ?? "1.0.0",
        role: (fm.role as string) ?? "",
        bodyHtml,
        meta,
        allAgents: allAgentsData,
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.emulateMediaType("screen");

      const outPath = path.join(OUT_DIR, `${name}.pdf`);
      await page.pdf({
        path: outPath,
        format: "A4",
        printBackground: true,
        margin: { top: "0", bottom: "0", left: "0", right: "0" },
        preferCSSPageSize: true,
      });
      await page.close();

      const stat = await fs.stat(outPath);
      console.log(`✓ ${name}.pdf  (${(stat.size / 1024).toFixed(0)} KB)`);
    }
  } finally {
    await browser.close();
  }

  console.log(`\n✨ ${ORDER.length} PDFs gerados com sucesso.\n   Pasta: ${OUT_DIR}\n`);
}

main().catch((e) => {
  console.error("❌ Erro:", e);
  process.exit(1);
});
