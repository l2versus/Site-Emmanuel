// ══════════════════════════════════════════════════════════════════════════════
// ⚙️ Configurações — Horários, bloqueios, preferências do sistema
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Clock,
  Calendar,
  Shield,
  Bell,
  Palette,
  Save,
  Plus,
  Trash2,
  ToggleLeft,
  Globe,
  CreditCard,
  MessageSquare,
} from "lucide-react";

export default function ConfiguracoesPage() {
  const [horaAbertura, setHoraAbertura] = useState("08:00");
  const [horaFechamento, setHoraFechamento] = useState("20:00");
  const [intervaloMin, setIntervaloMin] = useState("30");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Configurações</h2>
          <p className="text-dark-400 mt-1">
            Gerencie horários, bloqueios e preferências da clínica
          </p>
        </div>
        <Button variant="gold" size="sm" icon={<Save className="h-4 w-4" />}>
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ═══ Horários de Funcionamento ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Horários de Funcionamento"
            subtitle="Configure os horários da clínica"
            icon={<Clock className="h-5 w-5" />}
          />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Abertura"
                type="time"
                value={horaAbertura}
                onChange={(e) => setHoraAbertura(e.target.value)}
              />
              <Input
                label="Fechamento"
                type="time"
                value={horaFechamento}
                onChange={(e) => setHoraFechamento(e.target.value)}
              />
            </div>
            <Input
              label="Intervalo entre atendimentos (min)"
              type="number"
              value={intervaloMin}
              onChange={(e) => setIntervaloMin(e.target.value)}
            />
            <div>
              <p className="text-xs text-dark-400 mb-2 font-medium uppercase tracking-wider">
                Dias de Funcionamento
              </p>
              <div className="flex flex-wrap gap-2">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                  (dia, i) => (
                    <button
                      key={dia}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        i < 6
                          ? "bg-brand-500/20 text-brand-400"
                          : "bg-dark-800 text-dark-600"
                      }`}
                    >
                      {dia}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Horário sábado */}
            <div className="p-3 rounded-xl border border-dark-700/50 bg-dark-800/30">
              <p className="text-xs text-dark-400 mb-2">
                Sábado (horário especial)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Input type="time" value="08:00" label="" />
                <Input type="time" value="16:00" label="" />
              </div>
            </div>
          </div>
        </Card>

        {/* ═══ Bloqueios de Agenda ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Bloqueios de Agenda"
            subtitle="Feriados, folgas e indisponibilidades"
            icon={<Calendar className="h-5 w-5" />}
          />
          <div className="space-y-3">
            {[
              { data: "15/04/2026", motivo: "Feriado — Sexta-feira Santa", tipo: "FERIADO" },
              { data: "21/04/2026", motivo: "Feriado — Tiradentes", tipo: "FERIADO" },
              { data: "01/05/2026", motivo: "Feriado — Dia do Trabalho", tipo: "FERIADO" },
              { data: "10/03/2026", motivo: "Manutenção equipamentos", tipo: "MANUTENCAO" },
            ].map((bloqueio, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-dark-700/50 bg-dark-800/30"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-dark-500" />
                  <div>
                    <p className="text-sm text-white">{bloqueio.motivo}</p>
                    <p className="text-xs text-dark-500">{bloqueio.data}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={bloqueio.tipo === "FERIADO" ? "gold" : "info"}
                    size="sm"
                  >
                    {bloqueio.tipo}
                  </Badge>
                  <button className="p-1 text-dark-600 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              icon={<Plus className="h-4 w-4" />}
            >
              Adicionar Bloqueio
            </Button>
          </div>
        </Card>

        {/* ═══ Integrações ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Integrações"
            subtitle="APIs e serviços conectados"
            icon={<Globe className="h-5 w-5" />}
          />
          <div className="space-y-3">
            {[
              {
                nome: "Mercado Pago",
                icon: CreditCard,
                status: "Conectado",
                ativo: true,
              },
              {
                nome: "WhatsApp (Evolution API)",
                icon: MessageSquare,
                status: "Conectado",
                ativo: true,
              },
              {
                nome: "Google OAuth",
                icon: Shield,
                status: "Configurado",
                ativo: true,
              },
              {
                nome: "Instagram API",
                icon: Globe,
                status: "Não configurado",
                ativo: false,
              },
            ].map((integracao, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-dark-700/50 bg-dark-800/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      integracao.ativo
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-dark-700/50 text-dark-500"
                    }`}
                  >
                    <integracao.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {integracao.nome}
                    </p>
                    <p
                      className={`text-xs ${
                        integracao.ativo ? "text-emerald-400" : "text-dark-500"
                      }`}
                    >
                      {integracao.status}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                    integracao.ativo ? "bg-emerald-500" : "bg-dark-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      integracao.ativo ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ═══ Notificações ═══ */}
        <Card variant="glass">
          <CardHeader
            title="Notificações"
            subtitle="Canais e automações"
            icon={<Bell className="h-5 w-5" />}
          />
          <div className="space-y-3">
            {[
              { label: "Confirmação de agendamento (WhatsApp)", ativo: true },
              { label: "Lembrete 24h antes (WhatsApp)", ativo: true },
              { label: "Lembrete 1h antes (SMS)", ativo: false },
              { label: "Pós-atendimento (Email)", ativo: true },
              { label: "Promoções e novidades (Email)", ativo: true },
              { label: "Aniversário do cliente (WhatsApp)", ativo: true },
            ].map((notif, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-dark-700/50 bg-dark-800/30"
              >
                <p
                  className={`text-sm ${
                    notif.ativo ? "text-white" : "text-dark-500"
                  }`}
                >
                  {notif.label}
                </p>
                <div
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                    notif.ativo ? "bg-brand-500" : "bg-dark-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      notif.ativo ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ═══ LGPD / Segurança ═══ */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader
            title="LGPD & Segurança"
            subtitle="Conformidade com a Lei Geral de Proteção de Dados"
            icon={<Shield className="h-5 w-5" />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <Shield className="h-6 w-6 text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-white">
                Criptografia AES-256
              </p>
              <p className="text-xs text-dark-400 mt-1">
                Dados médicos (anamnese) são criptografados com AES-256-CBC em
                repouso e em trânsito.
              </p>
              <Badge variant="success" size="sm" className="mt-2">
                Ativo
              </Badge>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <Shield className="h-6 w-6 text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-white">
                Logs de Auditoria
              </p>
              <p className="text-xs text-dark-400 mt-1">
                Todas as ações sensíveis são registradas no AuditLog com IP,
                userAgent e timestamp.
              </p>
              <Badge variant="success" size="sm" className="mt-2">
                Ativo
              </Badge>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <Shield className="h-6 w-6 text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-white">
                Rate Limiting
              </p>
              <p className="text-xs text-dark-400 mt-1">
                Proteção contra DDoS e brute-force com limite de 100 req/min
                por IP no middleware.
              </p>
              <Badge variant="success" size="sm" className="mt-2">
                Ativo
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
