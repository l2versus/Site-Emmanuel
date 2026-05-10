import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInstanceStatus } from "@/lib/evolution/client";
import { redis } from "@/lib/redis";
import { whatsappInboundQueue } from "@/lib/queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Check = { ok: boolean; detail?: string };

export async function GET() {
  const checks: Record<string, Check> = {};

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = { ok: true };
  } catch (e) {
    checks.db = { ok: false, detail: e instanceof Error ? e.message : String(e) };
  }

  try {
    await redis.ping();
    checks.redis = { ok: true };
  } catch (e) {
    checks.redis = { ok: false, detail: e instanceof Error ? e.message : String(e) };
  }

  try {
    const counts = await whatsappInboundQueue.getJobCounts("waiting", "active", "failed");
    checks.queue = { ok: true, detail: JSON.stringify(counts) };
  } catch (e) {
    checks.queue = { ok: false, detail: e instanceof Error ? e.message : String(e) };
  }

  try {
    const state = await getInstanceStatus();
    checks.evolution = { ok: state.state === "open", detail: state.state };
  } catch (e) {
    checks.evolution = { ok: false, detail: e instanceof Error ? e.message : String(e) };
  }

  const allOk = Object.values(checks).every((c) => c.ok);
  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 503 });
}
