// ════════════════════════════════════════════════════════════════════════════
// 💬 CRM — Detalhe do Lead + Conversa
// ════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EstagioLead } from "@prisma/client";
import {
  ArrowLeft, Phone, Mail, Calendar, AlertTriangle, Ban, ShieldOff,
  MessageSquare, User, Bot, FileText,
} from "lucide-react";
import {
  updateLeadStage,
  addLeadNote,
  toggleOptOut,
  toggleBloqueado,
  escalateConversation,
} from "../actions";

const stageLabel: Record<EstagioLead, string> = {
  NOVO: "Novo",
  SAUDACAO: "Saudação",
  DESCOBERTA: "Descoberta",
  QUALIFICACAO: "Qualificação",
  APRESENTACAO: "Apresentação",
  FECHAMENTO: "Fechamento",
  VENDIDO: "Vendido",
  PERDIDO: "Perdido",
  DESQUALIFICADO: "Desqualificado",
  ESCALADO: "Escalado",
};

function formatTime(date: Date): string {
  return date.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      conversations: {
        orderBy: { createdAt: "desc" },
        include: {
          messages: {
            orderBy: { enviadaEm: "asc" },
            take: 200,
            include: {
              agentRun: {
                select: { id: true, agente: true, modelo: true, latenciaMs: true, status: true, injectionDetectada: true },
              },
            },
          },
        },
      },
    },
  });

  if (!lead) notFound();

  const activeConv = lead.conversations.find((c) => c.status === "ABERTA") ?? lead.conversations[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/crm"
          className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Coluna esquerda: dados do lead */}
        <div className="lg:col-span-1 space-y-4">
          {/* Identificação */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white text-lg font-bold shrink-0">
                {lead.nome?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">
                  {lead.nome ?? "(sem nome)"}
                </h2>
                <p className="text-xs text-dark-400 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {lead.telefone ?? "—"}
                </p>
                {lead.email && (
                  <p className="text-xs text-dark-400 flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3" /> {lead.email}
                  </p>
                )}
              </div>
            </div>

            {/* Flags */}
            {(lead.optOut || lead.bloqueado || lead.flagsSeguranca.length > 0) && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-dark-800">
                {lead.optOut && (
                  <Badge className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-[10px]">
                    <Ban className="h-3 w-3 mr-1 inline" />OPT-OUT
                  </Badge>
                )}
                {lead.bloqueado && (
                  <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px]">
                    BLOQUEADO
                  </Badge>
                )}
                {lead.flagsSeguranca.map((f) => (
                  <Badge key={f} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                    <AlertTriangle className="h-3 w-3 mr-1 inline" />{f}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Estágio do funil */}
          <Card className="p-5">
            <h3 className="text-xs uppercase tracking-wider text-dark-400 mb-2">Estágio</h3>
            <form action={updateLeadStage} className="flex gap-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <select
                name="stage"
                defaultValue={lead.estagio}
                className="flex-1 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm"
              >
                {(Object.keys(stageLabel) as EstagioLead[]).map((s) => (
                  <option key={s} value={s}>{stageLabel[s]}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
              >
                Salvar
              </button>
            </form>
          </Card>

          {/* BANT */}
          <Card className="p-5">
            <h3 className="text-xs uppercase tracking-wider text-dark-400 mb-3">BANT</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-dark-400">Budget</dt>
                <dd className="text-white">{lead.bantBudget ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark-400">Authority</dt>
                <dd className="text-white">{lead.bantAuthority ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-dark-400">Need</dt>
                <dd className="text-white text-right">{lead.bantNeed ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark-400">Timeline</dt>
                <dd className="text-white">{lead.bantTimeline ?? "—"}</dd>
              </div>
            </dl>
          </Card>

          {/* Ações de segurança */}
          <Card className="p-5">
            <h3 className="text-xs uppercase tracking-wider text-dark-400 mb-3">Ações</h3>
            <div className="space-y-2">
              <form action={toggleOptOut}>
                <input type="hidden" name="leadId" value={lead.id} />
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-sm text-white transition-colors flex items-center gap-2"
                >
                  <Ban className="h-4 w-4" />
                  {lead.optOut ? "Reativar contato" : "Marcar opt-out (LGPD)"}
                </button>
              </form>
              <form action={toggleBloqueado} className="space-y-1">
                <input type="hidden" name="leadId" value={lead.id} />
                {!lead.bloqueado && (
                  <input
                    name="motivo"
                    placeholder="Motivo do bloqueio"
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm placeholder:text-dark-500"
                  />
                )}
                <button
                  type="submit"
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    lead.bloqueado
                      ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      : "bg-dark-800 hover:bg-dark-700 text-white"
                  }`}
                >
                  <ShieldOff className="h-4 w-4" />
                  {lead.bloqueado ? `Desbloquear (motivo: ${lead.motivoBloqueio ?? "—"})` : "Bloquear lead"}
                </button>
              </form>
            </div>
          </Card>
        </div>

        {/* Coluna direita: conversa */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="flex flex-col h-[600px]">
            <div className="flex items-center justify-between p-4 border-b border-dark-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-400" />
                <h3 className="text-sm font-semibold text-white">
                  Conversa {activeConv ? `• ${activeConv.canal}• agente: ${activeConv.agenteAtivo ?? "—"}` : ""}
                </h3>
                {activeConv?.status === "ESCALADA_HUMANO" && (
                  <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px]">
                    ESCALADA P/ HUMANO
                  </Badge>
                )}
              </div>
              {activeConv && activeConv.status === "ABERTA" && (
                <form action={escalateConversation}>
                  <input type="hidden" name="conversationId" value={activeConv.id} />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs hover:bg-rose-500/20"
                  >
                    Pausar bot e assumir
                  </button>
                </form>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!activeConv || activeConv.messages.length === 0 ? (
                <p className="text-center text-sm text-dark-500 py-8">Nenhuma mensagem ainda.</p>
              ) : (
                activeConv.messages.map((m) => {
                  const isInbound = m.direcao === "INBOUND";
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isInbound ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          isInbound
                            ? "bg-dark-800 text-white rounded-bl-sm"
                            : "bg-brand-500/20 text-white rounded-br-sm border border-brand-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1 opacity-70">
                          {isInbound ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                          <span className="text-[10px]">
                            {formatTime(m.enviadaEm)}
                            {m.agentRun?.agente && ` • ${m.agentRun.agente}`}
                            {m.agentRun?.latenciaMs && ` • ${m.agentRun.latenciaMs}ms`}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words">{m.conteudo}</p>
                        {m.flagsSeguranca.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {m.flagsSeguranca.map((f) => (
                              <span
                                key={f}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Notas */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-brand-400" />
              <h3 className="text-sm font-semibold text-white">Notas internas</h3>
            </div>
            {lead.notes && (
              <pre className="text-xs text-dark-300 whitespace-pre-wrap font-sans bg-dark-800/50 p-3 rounded-lg border border-dark-700 mb-3 max-h-40 overflow-y-auto">
                {lead.notes}
              </pre>
            )}
            <form action={addLeadNote} className="flex gap-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <input
                name="note"
                placeholder="Adicionar nota interna..."
                className="flex-1 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm placeholder:text-dark-500"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
              >
                Adicionar
              </button>
            </form>
          </Card>

          {/* Metadata pequena */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-dark-400 uppercase tracking-wider">Origem</p>
                <p className="text-white mt-0.5">{lead.origem.toLowerCase().replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-dark-400 uppercase tracking-wider">Pipeline</p>
                <p className="text-white mt-0.5">{lead.pipeline}</p>
              </div>
              <div>
                <p className="text-dark-400 uppercase tracking-wider">Primeiro contato</p>
                <p className="text-white mt-0.5">{formatTime(lead.primeiroContato)}</p>
              </div>
              <div>
                <p className="text-dark-400 uppercase tracking-wider">Último contato</p>
                <p className="text-white mt-0.5">{formatTime(lead.ultimoContato)}</p>
              </div>
              {lead.proximoFollowup && (
                <div className="col-span-2">
                  <p className="text-dark-400 uppercase tracking-wider">Próximo follow-up</p>
                  <p className="text-amber-400 mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTime(lead.proximoFollowup)}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
