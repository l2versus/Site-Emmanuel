// ══════════════════════════════════════════════════════════════════════════════
// 📊 Admin Dashboard — Visão geral com KPIs estilo Power BI
// ══════════════════════════════════════════════════════════════════════════════

import { Card, CardHeader, KPICard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DonutChart, BarChartCustom, LineChartCustom } from "@/components/charts/charts";
import {
  DollarSign,
  Users,
  CalendarDays,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  Star,
  Zap,
  Target,
} from "lucide-react";

export const metadata = { title: "Admin — Dashboard" };

// Mock KPIs
const kpis = [
  {
    titulo: "Faturamento Mensal",
    valor: "R$ 87.450",
    variacao: "+12.5%",
    positivo: true,
    icon: DollarSign,
    cor: "emerald" as const,
  },
  {
    titulo: "Agendamentos Hoje",
    valor: "24",
    variacao: "+3 vs ontem",
    positivo: true,
    icon: CalendarDays,
    cor: "brand" as const,
  },
  {
    titulo: "Novos Clientes (mês)",
    valor: "156",
    variacao: "+22%",
    positivo: true,
    icon: Users,
    cor: "purple" as const,
  },
  {
    titulo: "Ticket Médio",
    valor: "R$ 285",
    variacao: "-2.1%",
    positivo: false,
    icon: Target,
    cor: "gold" as const,
  },
];

const faturamentoMensal = [
  { label: "Set", valor: 62000 },
  { label: "Out", valor: 71000 },
  { label: "Nov", valor: 68000 },
  { label: "Dez", valor: 85000 },
  { label: "Jan", valor: 79000 },
  { label: "Fev", valor: 87450 },
];

const servicosPorCategoria = [
  { name: "Facial", valor: 42 },
  { name: "Corporal", valor: 28 },
  { name: "Massagem", valor: 18 },
  { name: "Depilação", valor: 12 },
];

const statusAgendamentos = [
  { name: "Confirmados", value: 18, color: "#10b981" },
  { name: "Pendentes", value: 4, color: "#f59e0b" },
  { name: "Cancelados", value: 2, color: "#ef4444" },
];

const ultimosAgendamentos = [
  {
    cliente: "Ana Carolina S.",
    servico: "Radiofrequência Facial",
    horario: "09:00",
    status: "CONFIRMADO",
  },
  {
    cliente: "Beatriz M.",
    servico: "Criolipólise",
    horario: "10:30",
    status: "CONFIRMADO",
  },
  {
    cliente: "Camila R.",
    servico: "Limpeza de Pele",
    horario: "11:00",
    status: "PENDENTE",
  },
  {
    cliente: "Daniela F.",
    servico: "Drenagem Linfática",
    horario: "14:00",
    status: "CONFIRMADO",
  },
  {
    cliente: "Eduarda L.",
    servico: "Peeling Químico",
    horario: "15:30",
    status: "PENDENTE",
  },
];

const statusColors: Record<string, string> = {
  CONFIRMADO: "text-emerald-400 bg-emerald-500/10",
  PENDENTE: "text-amber-400 bg-amber-500/10",
  CANCELADO: "text-red-400 bg-red-500/10",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-dark-400 mt-1">
            Visão geral da clínica — 01 de março de 2026
          </p>
        </div>
        <Badge variant="gold">
          <Zap className="h-3 w-3 mr-1" /> Tempo real
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.titulo} variant="glass">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-dark-400 mb-1">{kpi.titulo}</p>
                <p className="text-2xl font-bold text-white">{kpi.valor}</p>
                <div
                  className={`flex items-center gap-1 mt-1 text-xs ${
                    kpi.positivo ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {kpi.positivo ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {kpi.variacao}
                </div>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  kpi.cor === "emerald"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : kpi.cor === "brand"
                    ? "bg-brand-500/10 text-brand-400"
                    : kpi.cor === "purple"
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-gold-500/10 text-gold-400"
                }`}
              >
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faturamento (2/3) */}
        <Card variant="gradient" className="lg:col-span-2">
          <CardHeader
            title="Faturamento Mensal"
            subtitle="Últimos 6 meses"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <LineChartCustom
            data={faturamentoMensal}
            lines={[
              { key: "valor", color: "#e14a72", label: "Faturamento (R$)" },
            ]}
            area
            height={300}
          />
        </Card>

        {/* Donut status (1/3) */}
        <Card variant="glass">
          <CardHeader
            title="Agendamentos Hoje"
            subtitle="24 no total"
            icon={<CalendarDays className="h-5 w-5" />}
          />
          <DonutChart
            data={statusAgendamentos}
            height={220}
            centerValue="24"
            centerLabel="total"
          />
        </Card>
      </div>

      {/* Linha 2: Serviços + Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Serviços por categoria */}
        <Card variant="glass">
          <CardHeader
            title="Serviços Populares"
            subtitle="Top categorias do mês"
            icon={<Star className="h-5 w-5" />}
          />
          <BarChartCustom
            data={servicosPorCategoria}
            barColor="#d99c22"
            height={250}
          />
        </Card>

        {/* Tabela de agendamentos */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader
            title="Agenda do Dia"
            subtitle="Próximos atendimentos"
            icon={<Clock className="h-5 w-5" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-500 border-b border-dark-700/50">
                  <th className="text-left py-2 px-3 font-medium">Cliente</th>
                  <th className="text-left py-2 px-3 font-medium">Serviço</th>
                  <th className="text-left py-2 px-3 font-medium">Horário</th>
                  <th className="text-left py-2 px-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ultimosAgendamentos.map((ag, i) => (
                  <tr
                    key={i}
                    className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                  >
                    <td className="py-3 px-3 text-white font-medium">
                      {ag.cliente}
                    </td>
                    <td className="py-3 px-3 text-dark-300">{ag.servico}</td>
                    <td className="py-3 px-3 text-dark-300">{ag.horario}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          statusColors[ag.status] || "text-dark-400"
                        }`}
                      >
                        {ag.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Métricas extras */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold gradient-text-brand">R$ 1.247</p>
            <p className="text-xs text-dark-400 mt-1">LTV Médio por Cliente</p>
          </div>
        </Card>
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold gradient-text-gold">87%</p>
            <p className="text-xs text-dark-400 mt-1">Taxa de Retorno</p>
          </div>
        </Card>
        <Card variant="glass">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">4.9★</p>
            <p className="text-xs text-dark-400 mt-1">Avaliação Média</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
