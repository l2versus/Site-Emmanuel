import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type AgentDefinition = {
  name: string;
  displayName: string;
  version: string;
  language: string;
  modelRecommendation: string;
  temperature: number;
  systemPrompt: string;
  raw: string;
  metadata: Record<string, unknown>;
};

const AGENTS_DIR = path.join(process.cwd(), "agents");

export async function loadAgent(name: string): Promise<AgentDefinition> {
  const filePath = path.join(AGENTS_DIR, `${name}.md`);
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = matter(raw);
  const fm = parsed.data as Record<string, unknown>;
  return {
    name: (fm.name as string) ?? name,
    displayName: (fm.display_name as string) ?? (fm.name as string) ?? name,
    version: (fm.version as string) ?? "0.0.0",
    language: (fm.language as string) ?? "pt-BR",
    modelRecommendation: (fm.model_recommendation as string) ?? "claude-sonnet-4-6",
    temperature: typeof fm.temperature === "number" ? (fm.temperature as number) : 0.4,
    systemPrompt: parsed.content.trim(),
    raw,
    metadata: fm,
  };
}

type CacheEntry = { agent: AgentDefinition; loadedAt: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

export async function loadAgentCached(name: string): Promise<AgentDefinition> {
  const hit = cache.get(name);
  if (hit && Date.now() - hit.loadedAt < CACHE_TTL_MS) {
    return hit.agent;
  }
  const agent = await loadAgent(name);
  cache.set(name, { agent, loadedAt: Date.now() });
  return agent;
}

export function clearAgentCache(): void {
  cache.clear();
}
