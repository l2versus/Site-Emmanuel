// ══════════════════════════════════════════════════════════════════════════════
// 📋 Anamnese do Cliente — Ficha médica com 12 flags + criptografia LGPD
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { anamneseSchema, type AnamneseInput } from "@/utils/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Shield,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const flagsMedicas = [
  { key: "alergia", label: "Alergia", descKey: "alergiaDescricao", desc: "Descreva suas alergias" },
  { key: "diabetes", label: "Diabetes", descKey: null, desc: null },
  { key: "hipertensao", label: "Hipertensão", descKey: null, desc: null },
  { key: "cardiopatia", label: "Cardiopatia", descKey: null, desc: null },
  { key: "gravidez", label: "Gravidez", descKey: null, desc: null },
  { key: "lactante", label: "Lactante", descKey: null, desc: null },
  { key: "marcapasso", label: "Marcapasso", descKey: null, desc: null },
  { key: "epilepsia", label: "Epilepsia", descKey: null, desc: null },
  { key: "cancer", label: "Câncer", descKey: "cancerDescricao", desc: "Descreva o tipo e tratamento" },
  { key: "cirurgiaRecente", label: "Cirurgia Recente", descKey: "cirurgiaDescricao", desc: "Descreva a cirurgia" },
  { key: "problemaPele", label: "Problema de Pele", descKey: "problemaPeleDescricao", desc: "Descreva o problema" },
  { key: "usoMedicamento", label: "Uso de Medicamento", descKey: "medicamentoDescricao", desc: "Liste os medicamentos" },
] as const;

export default function AnamnesePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AnamneseInput>({
    resolver: zodResolver(anamneseSchema),
    defaultValues: {
      alergia: false,
      diabetes: false,
      hipertensao: false,
      cardiopatia: false,
      gravidez: false,
      lactante: false,
      marcapasso: false,
      epilepsia: false,
      cancer: false,
      cirurgiaRecente: false,
      problemaPele: false,
      usoMedicamento: false,
      consentimentoLGPD: false as unknown as true,
    },
  });

  const onSubmit = async (data: AnamneseInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/anamnese", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      toast.success("Anamnese salva com sucesso!", {
        description: "Seus dados foram criptografados e armazenados com segurança.",
      });
    } catch {
      toast.error("Erro ao salvar anamnese. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Ficha de Anamnese</h2>
        <p className="text-dark-400 mt-1">
          Preencha sua ficha médica para garantir tratamentos seguros
        </p>
      </div>

      {/* Aviso LGPD */}
      <Card variant="bordered" className="border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-300">
              Seus dados são protegidos
            </p>
            <p className="text-xs text-dark-400 mt-1">
              Todas as informações médicas são criptografadas com AES-256 em conformidade
              com a LGPD (Lei Geral de Proteção de Dados). Somente profissionais
              autorizados têm acesso.
            </p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Flags Médicas */}
        <Card variant="glass">
          <CardHeader
            title="Histórico Médico"
            subtitle="Marque todas as condições que se aplicam"
            icon={<Heart className="h-5 w-5" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {flagsMedicas.map((flag) => {
              const isChecked = watch(flag.key as keyof AnamneseInput);

              return (
                <div key={flag.key}>
                  <label
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                      isChecked
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : "border-dark-700 bg-dark-800/30 hover:border-dark-500"
                    )}
                  >
                    <input
                      type="checkbox"
                      {...register(flag.key as keyof AnamneseInput)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all",
                        isChecked
                          ? "border-yellow-500 bg-yellow-500"
                          : "border-dark-500"
                      )}
                    >
                      {isChecked && (
                        <CheckCircle2 className="h-3 w-3 text-dark-950" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isChecked && (
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                      )}
                      <span className="text-sm text-white">{flag.label}</span>
                    </div>
                  </label>

                  {/* Campo de descrição condicional */}
                  {flag.descKey && isChecked && (
                    <div className="mt-2 ml-3">
                      <Input
                        {...register(flag.descKey as keyof AnamneseInput)}
                        placeholder={flag.desc || ""}
                        className="text-xs"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Observações */}
        <Card variant="glass">
          <CardHeader
            title="Observações Adicionais"
            icon={<Shield className="h-5 w-5" />}
          />

          <textarea
            {...register("observacoesAdicionais")}
            placeholder="Informe qualquer outra condição médica ou observação relevante..."
            className="w-full rounded-xl border border-dark-700 bg-dark-900/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 min-h-[100px] resize-none"
          />
        </Card>

        {/* Consentimento LGPD */}
        <Card variant="glass">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("consentimentoLGPD")}
              className="mt-1 h-5 w-5 rounded border-dark-500 bg-dark-900 text-brand-500 focus:ring-brand-500/50"
            />
            <div>
              <p className="text-sm text-white font-medium">
                Consentimento LGPD <Badge variant="danger">Obrigatório</Badge>
              </p>
              <p className="text-xs text-dark-400 mt-1 leading-relaxed">
                Autorizo a coleta e o armazenamento criptografado dos meus dados
                médicos exclusivamente para fins de avaliação estética e
                segurança dos procedimentos, conforme a Lei nº 13.709/2018 (LGPD).
                Estou ciente de que posso solicitar a exclusão dos meus dados a
                qualquer momento.
              </p>
              {errors.consentimentoLGPD && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.consentimentoLGPD.message}
                </p>
              )}
            </div>
          </label>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          variant="gold"
          size="lg"
          loading={isSubmitting}
          icon={<Shield className="h-5 w-5" />}
          className="w-full"
        >
          Salvar Anamnese com Segurança
        </Button>
      </form>
    </div>
  );
}
