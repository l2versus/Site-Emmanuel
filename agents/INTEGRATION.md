# Integração Evolution API + CRM + Agentes IA — 24/7

> Stack: **Vercel** (web/API) + **VPS** (worker + Evolution API + Postgres) +
> **Upstash** (Redis free) + **Groq** (LLM free — Llama 3.3 70B).
> Custo total esperado em volume baixo: **R$ 0/mês** em LLM e fila;
> infra já paga (VPS + Vercel).

---

## Arquitetura

```
         [VERCEL]                                    [VPS]
  +------------------+   webhook (HMAC)     +-----------------------+
  | Next.js + /api   | <----------------+   |  Evolution API        |
  |                  |                  |   |  (self-hosted, free)  |
  | webhook:         |                  +---|                       |
  |  /api/whatsapp/  |  ---enqueue--+       +-----------------------+
  |  webhook         |              |       +-----------------------+
  +------------------+              |       |  Worker 24/7          |
           ^                        |       |  (Docker, restart:    |
           |                        |       |   unless-stopped)     |
           | reads/writes           |       +-----------------------+
           |                        |       +-----------------------+
           v                        |       |  Postgres             |
  +------------------+              |       |  (Docker)             |
  |  Postgres        | <------------+       +-----------------------+
  |  (mesma inst.    |               
  |   no VPS)        |       [UPSTASH]       
  +------------------+    +---------------+  
           ^              |  Redis (free) | <-- BullMQ
           |              |  rediss://    |
           +--------------|  TLS          |
                          +---------------+

            [GROQ]
  +-------------------+
  |  Llama 3.3 70B    | <-- chamado pelo worker
  |  (free tier)      |
  +-------------------+
```

**Fluxo de uma mensagem:**

1. Lead manda msg → Evolution API recebe.
2. Evolution dispara webhook → `https://seu-site.vercel.app/api/whatsapp/webhook`.
3. Vercel valida HMAC, conecta no Upstash (lazy), enfileira job.
4. Worker no VPS pega da fila, processa: lead/conversa, kill switch,
   anti-injection, chama Groq, grava no Postgres, envia resposta via Evolution.

---

## Componentes (código)

| Caminho | Função |
|---|---|
| `src/lib/env.ts` | Valida env vars com Zod |
| `src/lib/redis.ts` | ioredis singleton (Upstash-friendly, lazyConnect) |
| `src/lib/queue.ts` | Filas BullMQ |
| `src/lib/evolution/client.ts` | Cliente HTTP da Evolution API |
| `src/lib/evolution/webhook.ts` | Schema Zod + HMAC + extração |
| `src/lib/llm/client.ts` | Cliente **Groq** (OpenAI-compatible) |
| `src/lib/agents/loader.ts` | Lê os MDs em `agents/` |
| `src/lib/agents/run.ts` | Pipeline: kill-switch → injection → LLM → persist |
| `src/lib/security/kill-switch.ts` | Liga/desliga em <30s |
| `src/lib/security/injection.ts` | Detecção anti-prompt-injection |
| `src/app/api/whatsapp/webhook/route.ts` | Webhook (Vercel) |
| `src/app/api/agents/health/route.ts` | Health-check |
| `src/workers/whatsapp.worker.ts` | Worker BullMQ |
| `src/workers/index.ts` | Bootstrap (24/7) |

---

## Setup do zero

### A) Vercel (web + webhook)

1. Conectar o repo no Vercel.
2. Setar env vars no painel Vercel (Settings → Environment Variables):
   - `DATABASE_URL` (Postgres do VPS, com IP público/SSL ou tunnel; ou Neon free)
   - `REDIS_URL` (Upstash: `rediss://default:TOKEN@xxx.upstash.io:6379`)
   - `EVOLUTION_API_URL` (URL pública do VPS, ex: `https://evolution.seudominio.com`)
   - `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE`, `EVOLUTION_WEBHOOK_SECRET`
   - `GROQ_API_KEY`, `LLM_DEFAULT_MODEL`
   - `AGENT_DEFAULT`
   - demais vars existentes (AUTH_*, MERCADOPAGO_*, ENCRYPTION_*)
3. Deploy.

### B) Upstash Redis (free)

1. Criar conta em https://console.upstash.com
2. Create Database → Region: `sa-east-1` (São Paulo) ou próximo do VPS.
3. Copiar `UPSTASH_REDIS_REST_URL` e converter para `rediss://...:6379` (a console mostra a string `redis://`).
4. Setar como `REDIS_URL` no Vercel **e** no `.env` do VPS.
5. Free tier: 256MB, ~10k commands/dia. Volume médio do bot consome ~5–10 commands por mensagem.

### C) Groq (free)

1. Criar conta em https://console.groq.com
2. Get API Key.
3. `GROQ_API_KEY=gsk_...`
4. Modelo default: `llama-3.3-70b-versatile` (qualidade) ou
   `llama-3.1-8b-instant` (mais rápido + mais headroom no free).

Limites do free tier:
- `llama-3.3-70b-versatile`: 30 req/min, 6k tokens/min, **100k tokens/dia**
- `llama-3.1-8b-instant`: 30 req/min, 30k tokens/min, **500k tokens/dia**

Com system prompt dos agentes (~3k tokens) + histórico, cada chamada
consome ~4k tokens. Logo:
- 70B: ~25 chamadas/dia (bom pra dev/MVP, apertado em prod)
- 8B: ~125 chamadas/dia (suporta volume baixo/médio)

Quando estourar, migrar para Gemini Flash (free tier maior) ou Groq pago.

### D) VPS (Evolution + Worker + Postgres)

No VPS:

```bash
# 1. Clonar o repo
git clone https://github.com/l2versus/site-emmanuel.git
cd site-emmanuel

# 2. Configurar .env
cp .env.example .env
nano .env
# Setar especialmente:
#   DATABASE_URL=postgresql://emmanuel:SENHA@postgres:5432/clinica_estetica
#   REDIS_URL=rediss://default:TOKEN@xxx.upstash.io:6379
#   EVOLUTION_API_KEY=<gerar com `openssl rand -hex 32`>
#   EVOLUTION_WEBHOOK_SECRET=<gerar com `openssl rand -hex 32`>
#   WEBHOOK_GLOBAL_URL=https://seu-site.vercel.app/api/whatsapp/webhook
#   GROQ_API_KEY=gsk_...

# 3. Subir stack VPS (postgres + worker + evolution-api)
docker compose --profile vps up -d postgres worker evolution-api

# 4. Aplicar schema do Prisma
docker compose exec worker npx prisma db push

# 5. Configurar Nginx (ou Caddy) para HTTPS público no Evolution
#    (a Vercel precisa alcançar a Evolution e vice-versa via HTTPS)
# Exemplo Caddy:
#   evolution.seudominio.com {
#     reverse_proxy localhost:8080
#   }

# 6. Conectar a instância ao WhatsApp (escanear QR Code)
curl -X POST "https://evolution.seudominio.com/instance/create" \
  -H "apikey: $EVOLUTION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "eb-bot",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
# A resposta inclui um QR code em base64 — abre no WhatsApp e escaneia.
```

---

## Camadas de segurança

1. **HMAC** no webhook (rejeita requisições não-assinadas).
2. **Kill switch** — antes de cada `runAgent` (cache 5s).
3. **Detecção de injection** — padrões regex bloqueiam antes do LLM, recusa segura sem custo.
4. **System prompt** dos agentes (§11 dos MDs) — defesa em profundidade dentro do LLM.
5. **Audit log** — toda mensagem grava em `messages` + `agent_runs`.
6. **LGPD** — comando `PARAR` reconhecido; `optOut` honrado.

---

## Operar o kill switch

```sql
-- Desligar TODOS os bots
INSERT INTO kill_switches (id, agente, ativo, motivo, "updatedAt")
VALUES (gen_random_uuid()::text, '*', true, 'manutenção', NOW())
ON CONFLICT (agente) DO UPDATE
  SET ativo = true, motivo = EXCLUDED.motivo, "ativadoEm" = NOW();

-- Reativar
UPDATE kill_switches SET ativo = false, "ativadoEm" = NULL WHERE agente = '*';
```

Propaga em <5s (cache TTL).

---

## Custos esperados

| Volume / mês | LLM (Groq) | Redis (Upstash) | Infra | Total |
|---|---|---|---|---|
| 100 leads | R$ 0 | R$ 0 | já pago | **R$ 0** |
| 500 leads | R$ 0 (no 8B) | R$ 0 | já pago | **R$ 0** |
| 2000 leads | ~R$ 130 (Groq pago) ou R$ 0 (Gemini Flash) | R$ 5–10 (Upstash pay-as-you-go) | já pago | **~R$ 135 ou R$ 10** |

---

## Roadmap

- [ ] Painel admin (React) — leads, conversas, kill switch, métricas.
- [ ] Suite de evals em `agents/evals/` (cenários de injection + venda).
- [ ] Tool use no Groq (function calling) — agendar consulta, gerar PIX.
- [ ] Sumarização automática de conversa longa.
- [ ] Sincronização com Luna CRM.
- [ ] Fallback de modelo (Groq → Gemini → OpenAI) quando free tier estourar.

---

## Versões

- **0.2.0 (2026-05-10)** — Switch Anthropic → **Groq** (free, Llama 3.3 70B).
  Redis singleton lazy-connect (Upstash-friendly). Docker compose com
  profile `vps` + serviço evolution-api. Documentação de deploy split
  Vercel + VPS + Upstash + Groq.
- **0.1.0 (2026-05-10)** — Fundação: schema, env, clientes, webhook, worker,
  kill switch, anti-injection (camada 1).
