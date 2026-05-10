import crypto from "node:crypto";
import { z } from "zod";
import { env } from "../env";

const webhookSchema = z
  .object({
    event: z.string(),
    instance: z.string().optional(),
    data: z
      .object({
        key: z.object({
          id: z.string(),
          remoteJid: z.string(),
          fromMe: z.boolean().optional(),
        }),
        pushName: z.string().nullish(),
        message: z.unknown().optional(),
        messageType: z.string().optional(),
        messageTimestamp: z.union([z.number(), z.string()]).optional(),
      })
      .passthrough(),
  })
  .passthrough();

export type EvolutionWebhookPayload = z.infer<typeof webhookSchema>;

export function parseWebhook(raw: unknown): EvolutionWebhookPayload | null {
  const parsed = webhookSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function verifyHmac(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", env.EVOLUTION_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export function extractText(payload: EvolutionWebhookPayload): string | null {
  const msg = (payload.data as { message?: Record<string, unknown> }).message;
  if (!msg) return null;
  if (typeof msg.conversation === "string") return msg.conversation;
  const ext = msg.extendedTextMessage as { text?: string } | undefined;
  if (ext?.text) return ext.text;
  return null;
}

export function normalizePhone(remoteJid: string): string {
  const num = remoteJid.replace(/@.*$/, "");
  return num.startsWith("+") ? num : `+${num}`;
}
