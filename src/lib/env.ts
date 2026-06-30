import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),

  // Evolution API (self-hosted no VPS)
  EVOLUTION_API_URL: z.string().url(),
  EVOLUTION_API_KEY: z.string().min(1),
  EVOLUTION_INSTANCE: z.string().min(1),
  EVOLUTION_WEBHOOK_SECRET: z.string().min(16),

  // LLM — Groq (free tier)
  GROQ_API_KEY: z.string().min(20),
  LLM_DEFAULT_MODEL: z
    .string()
    .default("llama-3.3-70b-versatile"),
  LLM_MAX_TOKENS: z.coerce.number().int().positive().default(1024),

  // Redis (Upstash free no prod, Docker local em dev)
  REDIS_URL: z.string().url(),

  // Agent runtime
  AGENT_DEFAULT: z.string().default("consultor-vendas-eb"),
  AGENT_RATE_LIMIT_PER_CONTACT_PER_MINUTE: z.coerce.number().int().positive().default(10),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid env vars:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration. Check .env against .env.example");
}

export const env = parsed.data;
