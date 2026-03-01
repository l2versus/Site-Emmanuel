// ══════════════════════════════════════════════════════════════════════════════
// 💰 Financeiro — KPIs estilo Power BI + Pagamentos
// ══════════════════════════════════════════════════════════════════════════════

import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChartCustom, DonutChart, BarChartCustom } from "@/components/charts/charts";
import {
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  CreditCard,
  QrCode,
  Wallet,
  Download,
  Filter,
  AlertTriangle,
} from "lucide-react";

export const metadata = { title: "Admin — Financeiro" };

const receitaMensal = [
  { label: "Set", receita: 62000, despesa: 18000 },
  { label: "Out", receita: 71000, despesa: 19500 },
  { label: "Nov", receita: 68000, despesa: 17800 },
  { label: "Dez", receita: 85000, despesa: 21000 },
  { label: "Jan", receita: 79000, despesa: 20500 },
  { label: "Fev", receita: 87450, despesa: 22100 },
];

const metodosPagamento = [
  { name: "PIX", value: 45, color: "#10b981" },
  { name: "Cartão Crédito", value: 35, color: "#e14a72" },
  { name: "Cartão Débito", value: 12, color: "#d99c22" },
  { name: "Boleto", value: 8, color: "#8b5cf6" },
];

const topServicos = [
  { name: "Criolipólise", valor: 18500 },
  { name: "Radiofrequência", valor: 14200 },
  { name: "Limpeza Pele", valor: 11800 },
  { name: "Drenagem", valor: 9400 },
  { name: "Peeling", valor: 7200 },
];

const ultimosPagamentos = [
  {
    cliente: "Ana Carolina S.",
    valor: "R$ 599,00",
    metodo: "PIX",
    status: "APROVADO",
    data: "01/03/2026",
  },
  {
    cliente: "Beatriz M.",
    valor: "R$ 249,00",
    metodo: "Cartão",
    status: "APROVADO",
    data: "01/03/2026",
  },
  {
    cliente: "Camila R.",
    valor: "R$ 189,00",
    metodo: "PIX",
    status: "PENDENTE",
    data: "28/02/2026",
  },
  {
    cliente: "Daniela F.",
    valor: "R$ 159,00",
    metodo: "Cartão",
    status: "APROVADO",
    data: "28/02/2026",
  },
  {
    cliente: "Eduarda L.",
    valor: "R$ 1.197,00",
    metodo: "Cartão 3x",
    status: "APROVADO",
    data: "27/02/2026",
  },
  {
    cliente: "Fernanda G.",
    valor: "R$ 0,50",
    metodo: "PIX",
    status: "FRAUDE",
    data: "26/02/2026",
  },
];

const statusColors: Record<string, string> = {
  APROVADO: "text-emerald-400 bg-emerald-500/10",
  PENDENTE: "text-amber-400 bg-amber-500/10",
  FRAUDE: "text-red-400 bg-red-500/10",
  REEMBOLSADO: "text-blue-400 bg-blue-500/10",
};

export default function FinanceiroPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Financeiro</h2>
          <p className="text-dark-400 mt-1">
            Gestão de receitas, pagamentos e análise financeira
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Filter className="h-4 w-4" />}>
            Filtrar
          </Button>
          <Button variant="gold" size="sm" icon={<Download className="h-4 w-4" />}>
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-400 mb-1">MRR</p>
              <p className="text-2xl font-bold text-white">R$ 87.450</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400">
                <ArrowUp className="h-3 w-3" /> +12.5% vs mês anterior
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-400 mb-1">Lucro Líquido</p>
              <p className="text-2xl font-bold text-white">R$ 65.350</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400">
                <ArrowUp className="h-3 w-3" /> Margem: 74.7%
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-400 mb-1">Ticket Médio</p>
              <p className="text-2xl font-bold text-white">R$ 285</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-red-400">
                <ArrowDown className="h-3 w-3" /> -2.1% vs mês anterior
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-dark-400 mb-1">LTV Médio</p>
              <p className="text-2xl font-bold text-white">R$ 1.247</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400">
                <ArrowUp className="h-3 w-3" /> +8.3% vs trimestre
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="gradient" className="lg:col-span-2">
          <CardHeader
            title="Receita vs Despesas"
            subtitle="Últimos 6 meses"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <LineChartCustom
            data={receitaMensal}
            lines={[
              { key: "receita", color: "#10b981", label: "Receita (R$)" },
              { key: "despesa", color: "#ef4444", label: "Despesas (R$)" },
            ]}
            area
            height={300}
          />
        </Card>

        <Card variant="glass">
          <CardHeader
            title="Métodos de Pagamento"
            subtitle="Distribuição do mês"
            icon={<QrCode className="h-5 w-5" />}
          />
          <DonutChart
            data={metodosPagamento}
            height={220}
            centerValue="PIX"
            centerLabel="mais usado"
          />
        </Card>
      </div>

      {/* Top serviços + Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="glass">
          <CardHeader
            title="Top Serviços (R$)"
            subtitle="Por faturamento"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <BarChartCustom
            data={topServicos}
            barColor="#e14a72"
            height={250}
          />
        </Card>

        <Card variant="glass" className="lg:col-span-2">
          <CardHeader
            title="Últimos Pagamentos"
            subtitle="Transações recentes"
            icon={<CreditCard className="h-5 w-5" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-500 border-b border-dark-700/50">
                  <th className="text-left py-2 px-3 font-medium">Cliente</th>
                  <th className="text-left py-2 px-3 font-medium">Valor</th>
                  <th className="text-left py-2 px-3 font-medium">Método</th>
                  <th className="text-left py-2 px-3 font-medium">Data</th>
                  <th className="text-left py-2 px-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ultimosPagamentos.map((pg, i) => (
                  <tr
                    key={i}
                    className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                  >
                    <td className="py-3 px-3 text-white font-medium">
                      {pg.cliente}
                    </td>
                    <td className="py-3 px-3 text-dark-300">{pg.valor}</td>
                    <td className="py-3 px-3 text-dark-300">{pg.metodo}</td>
                    <td className="py-3 px-3 text-dark-400">{pg.data}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                          statusColors[pg.status] || "text-dark-400"
                        }`}
                      >
                        {pg.status === "FRAUDE" && (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {pg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
