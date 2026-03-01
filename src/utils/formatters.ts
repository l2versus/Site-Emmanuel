// ══════════════════════════════════════════════════════════════════════════════
// 🎨 Formatadores e Máscaras — CPF, Moeda, Datas, Telefone
// ══════════════════════════════════════════════════════════════════════════════

import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// ─── CPF ──────────────────────────────────────────────────────────────────────

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function unformatCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

// ─── Telefone ─────────────────────────────────────────────────────────────────

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function unformatPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

// ─── Moeda (BRL) ─────────────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  const numValue = parseInt(digits, 10) / 100;
  if (isNaN(numValue)) return "R$ 0,00";
  return formatCurrency(numValue);
}

export function parseCurrencyToNumber(formatted: string): number {
  return (
    parseInt(formatted.replace(/\D/g, ""), 10) / 100 || 0
  );
}

// ─── Datas ────────────────────────────────────────────────────────────────────

export function formatDate(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatTime(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "HH:mm", { locale: ptBR });
}

export function formatDateLong(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatRelativeDate(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;

  if (isToday(parsed)) return `Hoje às ${format(parsed, "HH:mm")}`;
  if (isTomorrow(parsed)) return `Amanhã às ${format(parsed, "HH:mm")}`;

  return formatDistanceToNow(parsed, {
    addSuffix: true,
    locale: ptBR,
  });
}

export function formatDateForInput(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "yyyy-MM-dd'T'HH:mm");
}

// ─── CNPJ ─────────────────────────────────────────────────────────────────────

export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

// ─── Porcentagem ──────────────────────────────────────────────────────────────

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ─── Número compacto ──────────────────────────────────────────────────────────

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

// ─── CEP ──────────────────────────────────────────────────────────────────────

export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, "$1-$2");
}

// ─── Status Display ───────────────────────────────────────────────────────────

export const statusAgendamentoLabels: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  EM_ATENDIMENTO: "Em Atendimento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  NO_SHOW: "Não Compareceu",
  REAGENDADO: "Reagendado",
  LISTA_ESPERA: "Lista de Espera",
};

export const statusAgendamentoColors: Record<string, string> = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADO: "bg-green-100 text-green-800",
  EM_ATENDIMENTO: "bg-blue-100 text-blue-800",
  CONCLUIDO: "bg-emerald-100 text-emerald-800",
  CANCELADO: "bg-red-100 text-red-800",
  NO_SHOW: "bg-gray-100 text-gray-800",
  REAGENDADO: "bg-purple-100 text-purple-800",
  LISTA_ESPERA: "bg-orange-100 text-orange-800",
};

export const statusPagamentoLabels: Record<string, string> = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
  CANCELADO: "Cancelado",
  REEMBOLSADO: "Reembolsado",
  EM_ANALISE: "Em Análise",
  FRAUDE_BLOQUEADO: "Bloqueado — Fraude",
};

// ─── Utilitários de classe CSS ────────────────────────────────────────────────

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
