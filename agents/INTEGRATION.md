# Integração Evolution API + CRM + Agentes IA — 24/7

> Documento de arquitetura da integração que conecta WhatsApp (Evolution API)
> aos agentes definidos em `agents/*.md`, persistindo leads e conversas no
> Postgres e operando de forma contínua via worker dedicado.

---

## Visão geral

```
   Lead WhatsApp
        │
        ▼
   Evolution API ─── webhook (HMAC) ──▶ /api/whatsapp/webhook (Next.js)
                                               │
                                       valida + enfileira
                                               │
                                               ▼
                                       BullMQ (Redis)
                                               │
                                               ▼
                                       worker (contêiner 24/7)
                                               │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                            ▼                          ▼
        upsert Lead             carregar Conversation        runAgent()
        + Conversation                                       │
             ▲                                              ├─ kill switch?
             │                                              ├─ injection?
             │                                              ├─ LLM (Anthropic + cache)
             │                                              └─ grava AgentRun
             │                                                       │
             └──────────────────────── grava Message OUT ◄────────────┘
                                              │
                                              ▼
                                       Evolution.sendText ───▶ lead
```

---

## Componentes

### Backend (`src/`)

| Caminho | Função |
|---|---|
| `src/lib/env.ts` | Valida env vars com Zod, falha rápido no boot |
| `src/lib/redis.ts` | Cliente Redis (compartilhado app + worker) |
| `src/lib/queue.ts` | Filas BullMQ (`whatsapp.inbound`) |
| `src/lib/evolution/client.ts` | HTTP client da Evolution API (sendText, status) |
| `src/lib/evolution/webhook.ts` | Schema Zod + verificação HMAC + extração de texto |
| `src/lib/llm/anthropic.ts` | Cliente Anthropic SDK |
| `src/lib/agents/loader.ts` | Lê os MDs em `agents/`, parseia frontmatter |
| `src/lib/agents/run.ts` | Pipeline: kill-switch → injection → LLM → persist |
| `src/lib/security/kill-switch.ts` | Liga/desliga agentes em <30s |
| `src/lib/security/injection.ts` | Detecção de prompt injection (camada 1) |
| `src/app/api/whatsapp/webhook/route.ts` | Endpoint webhook do Evolution |
| `src/app/api/agents/health/route.ts` | Health-check (DB + Redis + Queue + Evolution) |
| `src/workers/whatsapp.worker.ts` | Worker BullMQ que processa mensagens |
| `src/workers/index.ts` | Bootstrap dos workers (24/7) |

### Banco (Prisma)

Novos modelos: **`Lead`**, **`Conversation`**, **`Message`**, **`AgentRun`**,
**`KillSwitch`** — ver `prisma/schema.prisma` (§14–18).

### Infraestrutura (Docker Compose)

- `postgres` — banco principal
- `redis` — BullMQ + cache
- `app` — Next.js (web + API)
- `worker` — contêiner separado, `npm run worker`, `restart: unless-stopped` (24/7)

---

## Camadas de segurança

1. **HMAC no webhook** — sem `EVOLUTION_WEBHOOK_SECRET` válido, requisição cai com 401.
2. **Kill switch** — antes de cada `runAgent`, lemos a tabela `kill_switches` (cache 5s).
3. **Detecção de injection** — padrões regex bloqueiam antes do LLM, recusa com mensagem segura, sem custo de token.
4. **System prompt do agente** (§11 dos MDs) — camada 2, defesa em profundidade dentro do LLM.
5. **Output validation** — mensagens enviadas são gravadas em DB antes de irem para Evolution; auditoria total.
6. **LGPD** — comando `PARAR` reconhecido no worker; `optOut` honrado em todas as escritas.

---

## Setup local

```bash
# 1. Instalar deps novas
npm install

# 2. Copiar env
cp .env.example .env
# (preencher EVOLUTION_*, ANTHROPIC_API_KEY, REDIS_URL, etc.)

# 3. Subir infra
docker compose up -d postgres redis

# 4. Aplicar schema
npm run db:push          # ou: npm run db:migrate
npm run db:generate

# 5. Rodar app + worker em paralelo
npm run dev              # web (porta 3000)
npm run worker:dev       # worker (em outro terminal)
```

Ou tudo em containers:

```bash
docker compose up -d
# logs do worker:
docker compose logs -f worker
```

---

## Configurar webhook no Evolution

No painel/instance da Evolution, configurar:

- **URL:** `https://seu-dominio/api/whatsapp/webhook`
- **Eventos:** `MESSAGES_UPSERT` (mínimo). Outros opcionais.
- **Header de assinatura:** `x-evolution-signature` (HMAC SHA256 do body com `EVOLUTION_WEBHOOK_SECRET`).
  Se a versão do Evolution não suportar HMAC nativamente, usar proxy ou ajustar `verifyHmac` para o esquema específico (token simples com `timingSafeEqual`).

---

## Operar o kill switch

```sql
-- Desligar TODOS os bots (* = wildcard)
INSERT INTO kill_switches (id, agente, ativo, motivo, "updatedAt")
VALUES (gen_random_uuid()::text, '*', true, 'manutenção', NOW())
ON CONFLICT (agente)
DO UPDATE SET ativo = true, motivo = EXCLUDED.motivo, "ativadoEm" = NOW();

-- Reativar
UPDATE kill_switches SET ativo = false, "ativadoEm" = NULL WHERE agente = '*';
```

Mudança propaga em <5s (cache TTL).

---

## Health-check

`GET /api/agents/health` retorna:

```json
{
  "ok": true,
  "checks": {
    "db":        { "ok": true },
    "redis":     { "ok": true },
    "queue":     { "ok": true, "detail": "{\"waiting\":0,\"active\":0,\"failed\":0}" },
    "evolution": { "ok": true, "detail": "open" }
  }
}
```

Usar com Uptime Robot, Better Stack, etc., para alerta 24/7.

---

## Roadmap próximo

- [ ] Painel admin (React) para acompanhar leads, conversas, métricas, kill switch.
- [ ] Múltiplos agentes coordenados (orquestrador roteando entre vendas/suporte/financeiro).
- [ ] Sincronização com **Luna CRM** (export/import via API).
- [ ] Suite de evals em `agents/evals/<agente>/<versão>.jsonl` (incluindo cenários de injection).
- [ ] Rate-limit por contato (Redis fixed window).
- [ ] Resumo automático de conversa longa (sumarização por LLM).
- [ ] Tool use: agendar consulta, gerar link de pagamento Mercado Pago.

---

## Versão

- **0.1.0 (2026-05-10)** — Fundação: schema, env, clientes, webhook, worker,
  kill switch, anti-injection (camada 1), Docker compose com Redis + worker.
