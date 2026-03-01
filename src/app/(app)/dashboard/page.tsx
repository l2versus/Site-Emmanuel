// ══════════════════════════════════════════════════════════════════════════════
// 📊 Dashboard do Cliente — Próximo agendamento, progresso, cards
// ══════════════════════════════════════════════════════════════════════════════

import {
  Calendar,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, KPICard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Saudação */}
      <div>
        <h2 className="text-2xl font-bold text-white">Olá, bem-vinda! 👋</h2>
        <p className="text-dark-400 mt-1">
          Confira seus próximos compromissos e acompanhe sua evolução
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Próximo Agendamento"
          value="15 Mar"
          change="Em 5 dias"
          changeType="neutral"
          icon={<Calendar className="h-5 w-5" />}
        />
        <KPICard
          label="Sessões Realizadas"
          value="12"
          change="+2 este mês"
          changeType="positive"
          icon={<Star className="h-5 w-5" />}
        />
        <KPICard
          label="Evolução Corporal"
          value="-8cm"
          change="Abdômen últimos 3 meses"
          changeType="positive"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          label="Fidelidade"
          value="Gold"
          change="15% de desconto ativo"
          changeType="positive"
          icon={<Sparkles className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximo Agendamento */}
        <Card variant="gradient" className="lg:col-span-2">
          <CardHeader
            title="Próximo Agendamento"
            icon={<Calendar className="h-5 w-5" />}
            action={
              <Link href="/dashboard/agendamentos">
                <Button variant="ghost" size="sm">
                  Ver todos <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            }
          />

          <div className="p-5 rounded-xl border border-dark-700/50 bg-dark-800/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold text-white">
                  Radiofrequência Corporal
                </p>
                <div className="flex items-center gap-3 mt-2 text-sm text-dark-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> 15/03/2026
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> 14:30
                  </span>
                </div>
              </div>
              <Badge variant="success" pulse>
                Confirmado
              </Badge>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" size="sm">
                Reagendar
              </Button>
              <Button variant="ghost" size="sm">
                Cancelar
              </Button>
            </div>
          </div>

          {/* Histórico recente */}
          <div className="mt-4 space-y-2">
            {[
              { servico: "Limpeza de Pele", data: "28/02/2026", status: "CONCLUIDO" },
              { servico: "Drenagem Linfática", data: "20/02/2026", status: "CONCLUIDO" },
            ].map((item) => (
              <div
                key={item.data}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-800/20 border border-dark-700/30"
              >
                <div>
                  <p className="text-sm text-white">{item.servico}</p>
                  <p className="text-xs text-dark-500">{item.data}</p>
                </div>
                <Badge variant="success" size="sm">
                  Concluído
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Ações rápidas */}
        <div className="space-y-4">
          <Card variant="glass">
            <CardHeader
              title="Ações Rápidas"
              icon={<Sparkles className="h-5 w-5" />}
            />

            <div className="space-y-2">
              <Link href="/agendamento" className="block">
                <Button variant="gold" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </Link>
              <Link href="/anamnese" className="block">
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Atualizar Anamnese
                </Button>
              </Link>
              <Link href="/evolucao" className="block">
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Ver Evolução
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card de Promoção */}
          <Card variant="bordered" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <Badge variant="gold" className="mb-3">Promoção</Badge>
            <h4 className="text-sm font-semibold text-white mb-1">
              Pacote Verão 2026
            </h4>
            <p className="text-xs text-dark-400 mb-3">
              3 sessões de criolipólise + drenagem com 30% OFF
            </p>
            <Button variant="primary" size="sm" className="w-full">
              Aproveitar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
