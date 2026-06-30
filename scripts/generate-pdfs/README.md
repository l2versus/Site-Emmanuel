# Gerador de PDFs dos Agentes — Time IA EB Develop

Gera 1 PDF profissional por agente, prontos pra empacotar como infoproduto
(Hotmart, Kiwify, Drive, etc.).

## Como rodar

```bash
# 1. Instalar dependências (primeira vez — baixa Chromium ~170MB)
npm install

# 2. Gerar os 7 PDFs
npm run pdf:generate
```

Saída em `dist/pdfs/`:

```
dist/pdfs/
  orquestrador-cto-ceo.pdf
  consultor-vendas-eb.pdf
  agente-vendas-wpp.pdf
  agente-frontend-senior.pdf
  agente-backend-senior.pdf
  agente-prompt-engineer.pdf
  agente-ia-automacao.pdf
```

## Estrutura de cada PDF (~8 páginas)

1. **Capa** — gradiente coral EB com nome, tagline e versão
2. **Sobre o agente** — para quem é + o que entrega
3. **Como usar em 3 passos** — ChatGPT/Claude/Gemini
4. **O agente (copia e cola)** — system prompt em bloco escuro destacado
5. **Exemplos práticos** — 3 perguntas testadas
6. **O time completo** — cross-sell dos outros 6 agentes
7. **CTA** — "quer rodando no seu WhatsApp?" + contato EB Develop

Cada agente tem uma **cor de capa diferente** (rose/amber/emerald/cyan/
indigo/purple/blue) pra distinguir visualmente no pacote.

## Customizar

- **Tagline, exemplos, público-alvo:** edita `metadata.ts`
- **Cores, fontes, layout:** edita `styles.ts`
- **Páginas (adicionar / remover):** edita `template.ts`
- **Adicionar agente novo:** adiciona em `metadata.ts` + array `ORDER`

Depois roda `npm run pdf:generate` de novo.

## Dicas de negócio

- Pacote básico (R$ 47): 1 PDF + tutorial 1 página
- Pacote completo (R$ 197): os 7 PDFs + vídeo seu de uso
- Pacote VIP (R$ 497): tudo + 1h consultoria por chamada

Plataformas pra vender: **Hotmart**, **Kiwify**, **Eduzz**. Comissão ~10%,
cadastro grátis.

## Troubleshooting

- **"Cannot find Chrome"**: roda `npx puppeteer browsers install chrome`
- **PDF saiu com fonte feia**: verifica internet (precisa baixar Inter do Google Fonts)
- **Tudo em branco**: é erro de marked — confere se `agents/<nome>.md` existe e tem conteúdo
