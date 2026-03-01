// ══════════════════════════════════════════════════════════════════════════════
// 📅 Agenda Admin — Gerenciamento de agendamentos (8 status)
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
} from "lucide-react";

type StatusAgendamento =
  | "PENDENTE"
  | "CONFIRMADO"
  | "EM_ATENDIMENTO"
  | "CONCLUIDO"
  | "CANCELADO_CLIENTE"
  | "CANCELADO_CLINICA"
  | "REMARCADO"
  | "NAO_COMPARECEU";

const statusConfig: Record<
  StatusAgendamento,
  { label: string; color: string; bg: string }
> = {
  PENDENTE: { label: "Pendente", color: "text-amber-400", bg: "bg-amber-500/10" },
  CONFIRMADO: { label: "Confirmado", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  EM_ATENDIMENTO: { label: "Em Atendimento", color: "text-blue-400", bg: "bg-blue-500/10" },
  CONCLUIDO: { label: "Concluído", color: "text-purple-400", bg: "bg-purple-500/10" },
  CANCELADO_CLIENTE: { label: "Canc. Cliente", color: "text-red-400", bg: "bg-red-500/10" },
  CANCELADO_CLINICA: { label: "Canc. Clínica", color: "text-red-400", bg: "bg-red-500/10" },
  REMARCADO: { label: "Remarcado", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  NAO_COMPARECEU: { label: "Não Compareceu", color: "text-dark-400", bg: "bg-dark-700/50" },
};

interface Agendamento {
  id: string;
  cliente: string;
  telefone: string;
  servico: string;
  horario: string;
  duracao: string;
  status: StatusAgendamento;
  profissional: string;
}

const agendamentosHoje: Agendamento[] = [
  {
    id: "1",
    cliente: "Ana Carolina S.",
    telefone: "(11) 99999-1111",
    servico: "Radiofrequência Facial",
    horario: "08:00",
    duracao: "60min",
    status: "CONCLUIDO",
    profissional: "Dra. Maria",
  },
  {
    id: "2",
    cliente: "Beatriz M.",
    telefone: "(11) 99999-2222",
    servico: "Criolipólise Abdominal",
    horario: "09:00",
    duracao: "90min",
    status: "EM_ATENDIMENTO",
    profissional: "Dra. Maria",
  },
  {
    id: "3",
    cliente: "Camila R.",
    telefone: "(11) 99999-3333",
    servico: "Limpeza de Pele Premium",
    horario: "10:30",
    duracao: "45min",
    status: "CONFIRMADO",
    profissional: "Dra. Juliana",
  },
  {
    id: "4",
    cliente: "Daniela F.",
    telefone: "(11) 99999-4444",
    servico: "Drenagem Linfática",
    horario: "11:00",
    duracao: "60min",
    status: "PENDENTE",
    profissional: "Dra. Maria",
  },
  {
    id: "5",
    cliente: "Eduarda L.",
    telefone: "(11) 99999-5555",
    servico: "Peeling Químico",
    horario: "14:00",
    duracao: "30min",
    status: "CONFIRMADO",
    profissional: "Dra. Juliana",
  },
  {
    id: "6",
    cliente: "Fernanda G.",
    telefone: "(11) 99999-6666",
    servico: "Depilação a Laser",
    horario: "15:00",
    duracao: "45min",
    status: "PENDENTE",
    profissional: "Dra. Maria",
  },
  {
    id: "7",
    cliente: "Gabriela H.",
    telefone: "(11) 99999-7777",
    servico: "Radiofrequência Corporal",
    horario: "16:00",
    duracao: "60min",
    status: "CANCELADO_CLIENTE",
    profissional: "Dra. Juliana",
  },
  {
    id: "8",
    cliente: "Helena I.",
    telefone: "(11) 99999-8888",
    servico: "Limpeza de Pele",
    horario: "17:00",
    duracao: "45min",
    status: "REMARCADO",
    profissional: "Dra. Maria",
  },
];

const horarios = [
  "08:00", "09:00", "10:00", "10:30", "11:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

export default function AgendaPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>("TODOS");

  const agendamentosFiltrados =
    filtroStatus === "TODOS"
      ? agendamentosHoje
      : agendamentosHoje.filter((a) => a.status === filtroStatus);

  const contadores = {
    total: agendamentosHoje.length,
    confirmados: agendamentosHoje.filter(
      (a) => a.status === "CONFIRMADO" || a.status === "EM_ATENDIMENTO"
    ).length,
    pendentes: agendamentosHoje.filter((a) => a.status === "PENDENTE").length,
    cancelados: agendamentosHoje.filter(
      (a) => a.status.startsWith("CANCELADO") || a.status === "NAO_COMPARECEU"
    ).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Agenda</h2>
          <p className="text-dark-400 mt-1">
            Visualize e gerencie todos os agendamentos
          </p>
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />}>
          Novo Agendamento
        </Button>
      </div>

      {/* Navegação de data */}
      <Card variant="glass">
        <div className="flex items-center justify-between">
          <button className="p-2 text-dark-400 hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              Sábado, 01 de Março de 2026
            </p>
            <p className="text-sm text-dark-400">
              {contadores.total} agendamentos | {contadores.confirmados}{" "}
              confirmados | {contadores.pendentes} pendentes
            </p>
          </div>
          <button className="p-2 text-dark-400 hover:text-white transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Card>

      {/* Filtros de Status */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroStatus("TODOS")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filtroStatus === "TODOS"
              ? "bg-brand-500/20 text-brand-400"
              : "bg-dark-800 text-dark-400 hover:text-white"
          }`}
        >
          Todos ({contadores.total})
        </button>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = agendamentosHoje.filter((a) => a.status === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFiltroStatus(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtroStatus === key
                  ? `${cfg.bg} ${cfg.color}`
                  : "bg-dark-800 text-dark-400 hover:text-white"
              }`}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Timeline de Agendamentos */}
      <div className="space-y-3">
        {agendamentosFiltrados.map((ag) => {
          const cfg = statusConfig[ag.status];
          return (
            <Card key={ag.id} variant="glass" hover>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Horário */}
                <div className="flex items-center gap-3 sm:w-28 shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-800 text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{ag.horario}</p>
                    <p className="text-xs text-dark-500">{ag.duracao}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {ag.cliente}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-dark-400">{ag.servico}</p>
                  <p className="text-xs text-dark-500 mt-0.5">
                    {ag.profissional} • {ag.telefone}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 shrink-0">
                  {ag.status === "PENDENTE" && (
                    <>
                      <Button variant="primary" size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Confirmar
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {ag.status === "CONFIRMADO" && (
                    <Button variant="outline" size="sm">
                      Iniciar Atendimento
                    </Button>
                  )}
                  {ag.status === "EM_ATENDIMENTO" && (
                    <Button variant="gold" size="sm">
                      Finalizar
                    </Button>
                  )}
                  {(ag.status === "CANCELADO_CLIENTE" || ag.status === "REMARCADO") && (
                    <Button variant="ghost" size="sm" className="text-dark-500">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Grade de horários rápidos */}
      <Card variant="glass">
        <CardHeader
          title="Horários Disponíveis"
          subtitle="Slots restantes para hoje"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {horarios.map((h) => {
            const ocupado = agendamentosHoje.some((a) => a.horario === h);
            return (
              <button
                key={h}
                disabled={ocupado}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  ocupado
                    ? "bg-dark-800/50 text-dark-600 cursor-not-allowed line-through"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
