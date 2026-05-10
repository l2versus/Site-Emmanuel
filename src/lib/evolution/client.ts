import { env } from "../env";

const BASE = env.EVOLUTION_API_URL.replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: env.EVOLUTION_API_KEY,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Evolution API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function sendText(toNumber: string, text: string): Promise<void> {
  const number = toNumber.replace(/^\+/, "");
  await request(`/message/sendText/${env.EVOLUTION_INSTANCE}`, {
    method: "POST",
    body: JSON.stringify({
      number,
      text,
      delay: 1200,
      linkPreview: false,
    }),
  });
}

export async function getInstanceStatus(): Promise<{ state: string }> {
  return request<{ state: string }>(`/instance/connectionState/${env.EVOLUTION_INSTANCE}`);
}
