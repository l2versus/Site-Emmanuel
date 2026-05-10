import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),

  EVOLUTION_API_URL: z.string().url(),
  EVOLUTION_API_KEY: z.string().min(1),
  EVOLUTION_INSTANCE: z.string().min(1),
  EVOLUTION_WEBHOOK_SECRET: z.string().min(16),

  ANTHROPIC_API_KEY: z.string().min(20),
  ANTHROPIC_MODEL_DEFAULT: z.string().default("claude-sonnet-4-6"),

  REDIS_URL: z.string().url(),

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
