// ══════════════════════════════════════════════════════════════════════════════
// 📅 Wizard de Agendamento em 4 Passos
// Passo 1: Serviço | Passo 2: Data/Hora | Passo 3: Dados | Passo 4: Pagamento
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Calendar,
  User,
  CreditCard,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Serviço", icon: Sparkles },
  { id: 2, label: "Data & Hora", icon: Calendar },
  { id: 3, label: "Seus Dados", icon: User },
  { id: 4, label: "Pagamento", icon: CreditCard },
];

export default function AgendamentoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    servicoId: "",
    dataHora: "",
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    observacoes: "",
    metodoPagamento: "PIX",
  });

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-display-md text-white mb-3">
            Agende seu <span className="gradient-text-brand">tratamento</span>
          </h1>
          <p className="text-dark-400">
            Preencha os dados abaixo em 4 passos rápidos
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  currentStep === step.id
                    ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                    : currentStep > step.id
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-dark-800 text-dark-500 border border-dark-700"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
                <span className="text-sm font-medium hidden sm:inline">
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 lg:w-16 h-px mx-1",
                    currentStep > step.id ? "bg-emerald-500/50" : "bg-dark-700"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card variant="glass" padding="lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* PASSO 1: Escolher serviço */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Escolha o serviço
                  </h2>
                  <p className="text-sm text-dark-400 mb-6">
                    Selecione o tratamento que deseja agendar
                  </p>

                  <div className="grid gap-3">
                    {[
                      { id: "1", nome: "Limpeza de Pele Premium", preco: "R$ 189", duracao: "60 min" },
                      { id: "2", nome: "Radiofrequência Corporal", preco: "R$ 249", duracao: "45 min" },
                      { id: "3", nome: "Drenagem Linfática", preco: "R$ 159", duracao: "60 min" },
                      { id: "4", nome: "Criolipólise", preco: "R$ 599", duracao: "90 min" },
                      { id: "5", nome: "Peeling Químico", preco: "R$ 219", duracao: "40 min" },
                      { id: "6", nome: "Depilação a Laser", preco: "R$ 149", duracao: "30 min" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setFormData({ ...formData, servicoId: s.id })}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                          formData.servicoId === s.id
                            ? "border-brand-500 bg-brand-500/10"
                            : "border-dark-700 bg-dark-800/50 hover:border-dark-500"
                        )}
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{s.nome}</p>
                          <p className="text-xs text-dark-400 mt-0.5">{s.duracao}</p>
                        </div>
                        <span className="text-sm font-bold text-gold-400">{s.preco}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PASSO 2: Data e Hora */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Escolha a data e horário
                  </h2>
                  <p className="text-sm text-dark-400 mb-6">
                    Selecione o melhor dia e horário para você
                  </p>

                  <Input
                    type="datetime-local"
                    label="Data e Horário"
                    value={formData.dataHora}
                    onChange={(e) =>
                      setFormData({ ...formData, dataHora: e.target.value })
                    }
                    icon={<Calendar className="h-4 w-4" />}
                  />

                  <p className="text-xs text-dark-500 mt-4">
                    Horários disponíveis: Segunda a Sexta 8h-20h | Sábado 8h-16h
                  </p>
                </div>
              )}

              {/* PASSO 3: Dados Pessoais */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Seus dados
                  </h2>
                  <p className="text-sm text-dark-400 mb-6">
                    Preencha seus dados para confirmar o agendamento
                  </p>

                  <div className="space-y-4">
                    <Input
                      label="Nome completo"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                    />
                    <Input
                      label="E-mail"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Telefone"
                        placeholder="(11) 99999-9999"
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData({ ...formData, telefone: e.target.value })
                        }
                      />
                      <Input
                        label="CPF"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) =>
                          setFormData({ ...formData, cpf: e.target.value })
                        }
                      />
                    </div>
                    <Input
                      label="Observações (opcional)"
                      placeholder="Alguma informação adicional..."
                      value={formData.observacoes}
                      onChange={(e) =>
                        setFormData({ ...formData, observacoes: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* PASSO 4: Pagamento */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Forma de pagamento
                  </h2>
                  <p className="text-sm text-dark-400 mb-6">
                    Escolha como deseja realizar o pagamento
                  </p>

                  <div className="grid gap-3">
                    {[
                      { id: "PIX", label: "PIX", desc: "Desconto de 5% — Pagamento instantâneo" },
                      { id: "CARTAO_CREDITO", label: "Cartão de Crédito", desc: "Até 12x sem juros" },
                      { id: "CARTAO_DEBITO", label: "Cartão de Débito", desc: "Pagamento à vista" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() =>
                          setFormData({ ...formData, metodoPagamento: m.id })
                        }
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                          formData.metodoPagamento === m.id
                            ? "border-brand-500 bg-brand-500/10"
                            : "border-dark-700 bg-dark-800/50 hover:border-dark-500"
                        )}
                      >
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                            formData.metodoPagamento === m.id
                              ? "border-brand-500"
                              : "border-dark-500"
                          )}
                        >
                          {formData.metodoPagamento === m.id && (
                            <div className="h-2 w-2 rounded-full bg-brand-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{m.label}</p>
                          <p className="text-xs text-dark-400">{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Resumo */}
                  <div className="mt-8 p-4 rounded-xl border border-dark-700 bg-dark-800/30">
                    <h3 className="text-sm font-semibold text-white mb-3">
                      Resumo do Agendamento
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-dark-400">
                        <span>Serviço</span>
                        <span className="text-white">Limpeza de Pele Premium</span>
                      </div>
                      <div className="flex justify-between text-dark-400">
                        <span>Data/Hora</span>
                        <span className="text-white">{formData.dataHora || "—"}</span>
                      </div>
                      <div className="flex justify-between text-dark-400">
                        <span>Cliente</span>
                        <span className="text-white">{formData.nome || "—"}</span>
                      </div>
                      <div className="flex justify-between text-dark-400 pt-2 border-t border-dark-700">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-gold-400">R$ 189,00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-700/50">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Voltar
            </Button>

            {currentStep < 4 ? (
              <Button
                variant="primary"
                onClick={nextStep}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="gold"
                icon={<CreditCard className="h-4 w-4" />}
              >
                Confirmar e Pagar
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
