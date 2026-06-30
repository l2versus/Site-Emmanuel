"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setKill } from "@/lib/security/kill-switch";
import type { EstagioLead } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    throw new Error("Acesso negado");
  }
  return session.user;
}

export async function updateLeadStage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("leadId") ?? "");
  const stage = String(formData.get("stage") ?? "") as EstagioLead;
  if (!id || !stage) return;
  await prisma.lead.update({ where: { id }, data: { estagio: stage } });
  revalidatePath(`/admin/crm/${id}`);
  revalidatePath("/admin/crm");
}

export async function addLeadNote(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const id = String(formData.get("leadId") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  if (!id || !note) return;

  const lead = await prisma.lead.findUnique({ where: { id }, select: { notes: true } });
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const author = user.name ?? user.email ?? "admin";
  const newNotes = `${lead?.notes ? lead.notes + "\n\n" : ""}[${stamp} — ${author}]\n${note}`;

  await prisma.lead.update({ where: { id }, data: { notes: newNotes } });
  revalidatePath(`/admin/crm/${id}`);
}

export async function toggleOptOut(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("leadId") ?? "");
  if (!id) return;
  const lead = await prisma.lead.findUniqueOrThrow({ where: { id } });
  await prisma.lead.update({ where: { id }, data: { optOut: !lead.optOut } });
  revalidatePath(`/admin/crm/${id}`);
  revalidatePath("/admin/crm");
}

export async function toggleBloqueado(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("leadId") ?? "");
  const motivo = String(formData.get("motivo") ?? "").trim();
  if (!id) return;
  const lead = await prisma.lead.findUniqueOrThrow({ where: { id } });
  await prisma.lead.update({
    where: { id },
    data: {
      bloqueado: !lead.bloqueado,
      motivoBloqueio: !lead.bloqueado ? motivo || "manual" : null,
    },
  });
  revalidatePath(`/admin/crm/${id}`);
  revalidatePath("/admin/crm");
}

export async function setActiveAgent(formData: FormData): Promise<void> {
  await requireAdmin();
  const conversationId = String(formData.get("conversationId") ?? "");
  const agente = String(formData.get("agente") ?? "");
  if (!conversationId || !agente) return;
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { agenteAtivo: agente },
  });
  revalidatePath(`/admin/crm`);
}

export async function escalateConversation(formData: FormData): Promise<void> {
  await requireAdmin();
  const conversationId = String(formData.get("conversationId") ?? "");
  if (!conversationId) return;
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: "ESCALADA_HUMANO" },
  });
  revalidatePath(`/admin/crm`);
}

export async function toggleKillSwitch(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const agente = String(formData.get("agente") ?? "*");
  const ativo = formData.get("ativo") === "true";
  const motivo = String(formData.get("motivo") ?? "manual");
  await setKill(agente, ativo, motivo, user.id);
  revalidatePath("/admin/crm");
}
