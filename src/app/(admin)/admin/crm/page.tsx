// ════════════════════════════════════════════════════════════════════════════
// 📈 CRM — Lista de leads (Server Component)
// ════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { EstagioLead, OrigemLead, Prisma } from "@prisma/client";
import { MessageSquare, Phone, Search, AlertTriangle, Ban, ShieldOff } from "lucide-react";
import { toggleKillSwitch } from "./actions";

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

const stageColor: Record<EstagioLead, string> = {
  NOVO: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SAUDACAO: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  DESCOBERTA: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  QUALIFICACAO: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  APRESENTACAO: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  FECHAMENTO: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  VENDIDO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PERDIDO: "bg-red-500/10 text-red-400 border-red-500/20",
  DESQUALIFICADO: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  ESCALADO: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function formatRelative(date: Date | null): string {
  if (!date) return "—";
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}m atrás`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d atrás`;
  return date.toLocaleDateString("pt-BR");
}

function initials(name: string | null, phone: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
  }
  return phone?.slice(-2) ?? "??";
}

type SearchParams = Promise<{
  q?: string;
  estagio?: string;
  origem?: string;
}>;

export default async function CrmListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const params = await searchParams;
  const where: Prisma.LeadWhereInput = {};

  if (params.q?.trim()) {
    const q = params.q.trim();
    where.OR = [
      { telefone: { contains: q } },
      { nome: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  if (params.estagio) where.estagio = params.estagio as EstagioLead;
  if (params.origem) where.origem = params.origem as OrigemLead;

  const [leads, totalsByStage, killSwitches] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { ultimoContato: "desc" },
      take: 100,
      include: {
        conversations: {
          select: { id: true, ultimaMensagemEm: true, status: true },
          orderBy: { ultimaMensagemEm: "desc" },
          take: 1,
        },
      },
    }),
    prisma.lead.groupBy({ by: ["estagio"], _count: true }),
    prisma.killSwitch.findMany(),
  ]);

  const totalLeads = totalsByStage.reduce((sum, s) => sum + s._count, 0);
  const vendidos = totalsByStage.find((s) => s.estagio === "VENDIDO")?._count ?? 0;
  const conversao = totalLeads > 0 ? ((vendidos / totalLeads) * 100).toFixed(1) : "0.0";

  const globalKill = killSwitches.find((k) => k.agente === "*");
  const isGlobalKilled = globalKill?.ativo ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">CRM — Leads WhatsApp</h2>
          <p className="text-sm text-dark-400 mt-1">
            {totalLeads} leads • {vendidos} vendidos • {conversao}% conversão
          </p>
        </div>

        <form action={toggleKillSwitch} className="flex items-center gap-2">
          <input type="hidden" name="agente" value="*" />
          <input type="hidden" name="ativo" value={isGlobalKilled ? "false" : "true"} />
          <input type="hidden" name="motivo" value={isGlobalKilled ? "reativado pelo admin" : "desligado pelo admin"} />
          <button
            type="submit"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isGlobalKilled
                ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
            }`}
          >
            {isGlobalKilled ? <ShieldOff className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            {isGlobalKilled ? "Bots DESLIGADOS — reativar" : "Bots ativos — desligar todos"}
          </button>
        </form>
      </div>

      {/* Stats por estágio */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(
          ["NOVO", "QUALIFICACAO", "APRESENTACAO", "FECHAMENTO", "VENDIDO"] as EstagioLead[]
        ).map((s) => {
          const count = totalsByStage.find((t) => t.estagio === s)?._count ?? 0;
          return (
            <Card key={s} className="p-4">
              <p className="text-xs text-dark-400 uppercase tracking-wider">{stageLabel[s]}</p>
              <p className="text-2xl font-bold text-white mt-1">{count}</p>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <form className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
            <Input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Buscar por nome, telefone ou e-mail..."
              className="pl-9"
            />
          </div>
          <select
            name="estagio"
            defaultValue={params.estagio ?? ""}
            className="px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm"
          >
            <option value="">Todos os estágios</option>
            {(Object.keys(stageLabel) as EstagioLead[]).map((s) => (
              <option key={s} value={s}>{stageLabel[s]}</option>
            ))}
          </select>
          <select
            name="origem"
            defaultValue={params.origem ?? ""}
            className="px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm"
          >
            <option value="">Todas as origens</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="SITE">Site</option>
            <option value="ADS_META">Ads Meta</option>
            <option value="ADS_GOOGLE">Ads Google</option>
            <option value="INDICACAO">Indicação</option>
            <option value="ORGANICO">Orgânico</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
          >
            Filtrar
          </button>
        </form>
      </Card>

      {/* Lista */}
      {leads.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400">Nenhum lead encontrado.</p>
          <p className="text-xs text-dark-500 mt-1">
            Os leads aparecem aqui automaticamente quando alguém manda mensagem no WhatsApp.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => {
            const lastConv = lead.conversations[0];
            const flagged = lead.flagsSeguranca.length > 0;
            return (
              <Link key={lead.id} href={`/admin/crm/${lead.id}`} className="block">
                <Card className="p-4 hover:border-brand-500/40 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white text-sm font-bold shrink-0">
                      {initials(lead.nome, lead.telefone)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-white truncate">
                          {lead.nome ?? "(sem nome)"}
                        </p>
                        <Badge className={`${stageColor[lead.estagio]} border text-[10px] uppercase tracking-wider`}>
                          {stageLabel[lead.estagio]}
                        </Badge>
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
                        {flagged && (
                          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                            <AlertTriangle className="h-3 w-3 mr-1 inline" />FLAG
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-dark-400">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.telefone ?? "—"}
                        </span>
                        <span>• {lead.origem.toLowerCase().replace("_", " ")}</span>
                        <span>• {formatRelative(lastConv?.ultimaMensagemEm ?? lead.ultimoContato)}</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-dark-500 shrink-0">
                      {lead.bantBudget && <p>💰 {lead.bantBudget}</p>}
                      {lead.proximoFollowup && (
                        <p className="text-amber-400 mt-1">
                          Follow-up: {lead.proximoFollowup.toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
