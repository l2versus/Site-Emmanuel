// LLM client — Groq (OpenAI-compatible API).
// Groq oferece free tier para Llama 3.x, Qwen, Mixtral, etc.
// Limites do free tier (free):
//   llama-3.3-70b-versatile : 30 req/min, 6k TPM, 100k TPD
//   llama-3.1-8b-instant    : 30 req/min, 30k TPM, 500k TPD
// Fonte: https://console.groq.com/docs/rate-limits

import Groq from "groq-sdk";
import { env } from "../env";

export const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export const DEFAULT_MODEL = env.LLM_DEFAULT_MODEL;
export const MAX_TOKENS = env.LLM_MAX_TOKENS;
