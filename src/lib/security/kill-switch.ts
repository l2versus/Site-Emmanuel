import { prisma } from "../prisma";

const CACHE_TTL_MS = 5_000;
let lastCheck = 0;
let cached = new Map<string, boolean>();

async function refresh(): Promise<void> {
  const switches = await prisma.killSwitch.findMany();
  cached = new Map(switches.map((s) => [s.agente, s.ativo]));
  lastCheck = Date.now();
}

export async function isKilled(agentName: string): Promise<boolean> {
  if (Date.now() - lastCheck > CACHE_TTL_MS) {
    await refresh();
  }
  if (cached.get("*")) return true;
  return cached.get(agentName) ?? false;
}

export async function setKill(
  agentName: string,
  ativo: boolean,
  motivo: string,
  ativadoPor: string
): Promise<void> {
  await prisma.killSwitch.upsert({
    where: { agente: agentName },
    create: {
      agente: agentName,
      ativo,
      motivo,
      ativadoPor,
      ativadoEm: ativo ? new Date() : null,
    },
    update: {
      ativo,
      motivo,
      ativadoPor,
      ativadoEm: ativo ? new Date() : null,
    },
  });
  await refresh();
}
