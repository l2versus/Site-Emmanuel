import { NextRequest, NextResponse } from "next/server";
import { parseWebhook, verifyHmac, extractText, normalizePhone } from "@/lib/evolution/webhook";
import { whatsappInboundQueue } from "@/lib/queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-evolution-signature");

  if (!verifyHmac(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const payload = parseWebhook(json);
  if (!payload) {
    return NextResponse.json({ ok: true, ignored: "schema-mismatch" });
  }

  if (payload.event !== "messages.upsert") {
    return NextResponse.json({ ok: true, ignored: "event-type" });
  }

  const data = payload.data as {
    key: { id: string; remoteJid: string; fromMe?: boolean };
    pushName?: string | null;
    messageType?: string;
    messageTimestamp?: number | string;
  };

  if (data.key.fromMe) {
    return NextResponse.json({ ok: true, ignored: "self-message" });
  }

  const text = extractText(payload);
  if (!text) {
    return NextResponse.json({ ok: true, ignored: "non-text" });
  }

  const fromNumber = normalizePhone(data.key.remoteJid);
  const ts =
    typeof data.messageTimestamp === "string"
      ? parseInt(data.messageTimestamp, 10)
      : data.messageTimestamp ?? Math.floor(Date.now() / 1000);

  await whatsappInboundQueue.add(
    "inbound",
    {
      evolutionMessageId: data.key.id,
      fromNumber,
      pushName: data.pushName ?? null,
      text,
      type: data.messageType ?? "text",
      timestamp: ts,
      raw: payload,
    },
    {
      jobId: data.key.id, // idempotência
    }
  );

  return NextResponse.json({ ok: true });
}
