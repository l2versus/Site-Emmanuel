// ══════════════════════════════════════════════════════════════════════════════
// 📈 Evolução Clínica — 13 zonas de medição corporal + fotos antes/depois
// ══════════════════════════════════════════════════════════════════════════════

import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChartCustom } from "@/components/charts/charts";
import {
  TrendingUp,
  TrendingDown,
  Camera,
  Ruler,
  Activity,
} from "lucide-react";

export const metadata = {
  title: "Evolução Clínica",
};

// Mock data de evolução
const evolucaoData = [
  { label: "Jan", abdomen: 98, cintura: 82, quadril: 105 },
  { label: "Fev", abdomen: 96, cintura: 80, quadril: 104 },
  { label: "Mar", abdomen: 94, cintura: 78, quadril: 102 },
  { label: "Abr", abdomen: 92, cintura: 77, quadril: 101 },
  { label: "Mai", abdomen: 90, cintura: 75, quadril: 100 },
];

const medidasAtuais = [
  { zona: "Abdômen", valor: 90, anterior: 98, unidade: "cm" },
  { zona: "Cintura", valor: 75, anterior: 82, unidade: "cm" },
  { zona: "Quadril", valor: 100, anterior: 105, unidade: "cm" },
  { zona: "Coxa Direita", valor: 58, anterior: 61, unidade: "cm" },
  { zona: "Coxa Esquerda", valor: 57, anterior: 60, unidade: "cm" },
  { zona: "Braço Direito", valor: 30, anterior: 32, unidade: "cm" },
  { zona: "Braço Esquerdo", valor: 30, anterior: 31, unidade: "cm" },
  { zona: "Tórax", valor: 92, anterior: 94, unidade: "cm" },
  { zona: "Panturrilha Dir.", valor: 36, anterior: 37, unidade: "cm" },
  { zona: "Panturrilha Esq.", valor: 36, anterior: 37, unidade: "cm" },
  { zona: "Peso", valor: 68, anterior: 73, unidade: "kg" },
  { zona: "Altura", valor: 165, anterior: 165, unidade: "cm" },
  { zona: "IMC", valor: 25.0, anterior: 26.8, unidade: "" },
];

export default function EvolucaoPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Evolução Clínica</h2>
        <p className="text-dark-400 mt-1">
          Acompanhe suas medições corporais e veja seu progresso
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">-8cm</p>
              <p className="text-xs text-dark-400">Abdômen total</p>
            </div>
          </div>
        </Card>
        <Card variant="glass">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">-5kg</p>
              <p className="text-xs text-dark-400">Peso total</p>
            </div>
          </div>
        </Card>
        <Card variant="glass">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">-1.8</p>
              <p className="text-xs text-dark-400">Pontos de IMC</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      <Card variant="gradient">
        <CardHeader
          title="Gráfico de Evolução"
          subtitle="Medidas principais nos últimos 5 meses"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <LineChartCustom
          data={evolucaoData}
          lines={[
            { key: "abdomen", color: "#e14a72", label: "Abdômen (cm)" },
            { key: "cintura", color: "#d99c22", label: "Cintura (cm)" },
            { key: "quadril", color: "#8b5cf6", label: "Quadril (cm)" },
          ]}
          area
          height={350}
        />
      </Card>

      {/* 13 Zonas de Medição */}
      <Card variant="glass">
        <CardHeader
          title="13 Zonas de Medição"
          subtitle="Última avaliação: 01/03/2026"
          icon={<Ruler className="h-5 w-5" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {medidasAtuais.map((m) => {
            const diff = m.valor - m.anterior;
            const isPositive = diff > 0;
            const isZero = diff === 0;

            return (
              <div
                key={m.zona}
                className="flex items-center justify-between p-3 rounded-xl border border-dark-700/50 bg-dark-800/30"
              >
                <div>
                  <p className="text-sm text-white font-medium">{m.zona}</p>
                  <p className="text-xs text-dark-500">
                    Anterior: {m.anterior}
                    {m.unidade}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {m.valor}
                    <span className="text-xs text-dark-400 ml-0.5">
                      {m.unidade}
                    </span>
                  </p>
                  {!isZero && (
                    <Badge
                      variant={isPositive ? "danger" : "success"}
                      size="sm"
                    >
                      {isPositive ? "+" : ""}
                      {diff.toFixed(1)}
                      {m.unidade}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Fotos Antes/Depois */}
      <Card variant="glass">
        <CardHeader
          title="Fotos Antes & Depois"
          subtitle="Registros fotográficos do seu progresso"
          icon={<Camera className="h-5 w-5" />}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] rounded-xl border border-dark-700/50 bg-dark-800/30 flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-8 w-8 text-dark-600 mx-auto mb-2" />
              <p className="text-sm text-dark-500">Foto Antes</p>
              <p className="text-xs text-dark-600">01/01/2026</p>
            </div>
          </div>
          <div className="aspect-[3/4] rounded-xl border border-dark-700/50 bg-dark-800/30 flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-8 w-8 text-dark-600 mx-auto mb-2" />
              <p className="text-sm text-dark-500">Foto Depois</p>
              <p className="text-xs text-dark-600">01/03/2026</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
