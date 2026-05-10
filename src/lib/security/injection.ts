// Camada 1 de defesa anti-prompt-injection.
// Detecção leve baseada em padrões — a defesa principal continua sendo o
// próprio system prompt do agente (§11 do agente-vendas-wpp.md).
// Aqui registramos + recusamos sem chamar o LLM, economizando tokens.

const PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: "ignore_instructions", re: /ignor[ae].{0,20}(instru|previous|anteriores)/i },
  { name: "cancel_guardrails", re: /(cancele?|esque[çc]a|desativ[ae]).{0,20}(guard ?rail|regras|defesas|prote[çc][ãa]o)/i },
  { name: "developer_mode", re: /\b(modo (desenvolvedor|admin|livre)|developer mode|admin mode|dan mode)\b/i },
  { name: "system_override", re: /\b(system override|jailbreak|sudo)\b/i },
  { name: "reveal_prompt", re: /(mostre|revele|repita|print|reveal).{0,20}(prompt|instru|sistema|system)/i },
  { name: "list_rules", re: /(liste|list).{0,20}(suas regras|your rules|instru)/i },
  { name: "free_no_rules", re: /voc[êse] (n[ãa]o tem (mais )?regras|[ée] livre)/i },
  { name: "roleplay", re: /\b(atue como|pretenda ser|roleplay as|pretend you are)\b/i },
  { name: "system_tag", re: /<\s*(system|im_start|inst)\s*>/i },
  { name: "base64_payload", re: /base64.{0,10}(decode|seguir|execute|run)/i },
];

export type InjectionDetection = {
  detected: boolean;
  pattern: string | null;
};

export function detectInjection(text: string): InjectionDetection {
  for (const { name, re } of PATTERNS) {
    if (re.test(text)) return { detected: true, pattern: name };
  }
  return { detected: false, pattern: null };
}

export const SAFE_REFUSAL =
  "Aqui só consigo te ajudar com informações sobre nossas soluções, prazos e investimento. Quer que eu te conte como a gente pode ajudar seu negócio?";
