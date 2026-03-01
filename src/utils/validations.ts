// ══════════════════════════════════════════════════════════════════════════════
// ✅ Schemas de Validação Zod — Proteção contra fraudes e erros
// Todas as entradas de dados do sistema são validadas aqui
// ══════════════════════════════════════════════════════════════════════════════

import { z } from "zod";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;

function validarCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false; // Todos iguais

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(digits.charAt(i)) * (10 - i);
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(digits.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(digits.charAt(i)) * (11 - i);
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(digits.charAt(10))) return false;

  return true;
}

// ─── 1. Cadastro / Registro de Usuário ────────────────────────────────────────

export const registroSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(100, "Nome muito longo"),
    email: z.string().email("Email inválido"),
    phone: z
      .string()
      .regex(phoneRegex, "Telefone no formato (XX) XXXXX-XXXX")
      .optional(),
    cpf: z
      .string()
      .regex(cpfRegex, "CPF no formato XXX.XXX.XXX-XX")
      .refine(validarCPF, "CPF inválido")
      .optional(),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Senha deve ter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve ter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve ter pelo menos um número")
      .regex(/[^A-Za-z0-9]/, "Senha deve ter pelo menos um caractere especial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegistroInput = z.infer<typeof registroSchema>;

// ─── 2. Login ─────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── 3. Agendamento ──────────────────────────────────────────────────────────

export const agendamentoSchema = z.object({
  servicoId: z.string().cuid("ID do serviço inválido"),
  dataHora: z
    .string()
    .datetime("Data/hora inválida")
    .refine(
      (dt) => new Date(dt) > new Date(),
      "A data deve ser no futuro"
    ),
  observacoes: z.string().max(500, "Observações muito longas").optional(),
});

export type AgendamentoInput = z.infer<typeof agendamentoSchema>;

// ─── 4. Anamnese (Ficha Médica) ──────────────────────────────────────────────

export const anamneseSchema = z.object({
  alergia: z.boolean(),
  alergiaDescricao: z.string().max(500).optional(),
  diabetes: z.boolean(),
  hipertensao: z.boolean(),
  cardiopatia: z.boolean(),
  gravidez: z.boolean(),
  lactante: z.boolean(),
  marcapasso: z.boolean(),
  epilepsia: z.boolean(),
  cancer: z.boolean(),
  cancerDescricao: z.string().max(500).optional(),
  cirurgiaRecente: z.boolean(),
  cirurgiaDescricao: z.string().max(500).optional(),
  problemaPele: z.boolean(),
  problemaPeleDescricao: z.string().max(500).optional(),
  usoMedicamento: z.boolean(),
  medicamentoDescricao: z.string().max(500).optional(),
  observacoesAdicionais: z.string().max(1000).optional(),
  consentimentoLGPD: z.literal(true, {
    errorMap: () => ({
      message: "Você deve aceitar o consentimento para prosseguir",
    }),
  }),
});

export type AnamneseInput = z.infer<typeof anamneseSchema>;

// ─── 5. Evolução Clínica ────────────────────────────────────────────────────

const medidasOptional = z
  .number()
  .min(0, "Medida não pode ser negativa")
  .max(500, "Medida fora do intervalo")
  .optional();

export const evolucaoSchema = z.object({
  abdomen: medidasOptional,
  cintura: medidasOptional,
  quadril: medidasOptional,
  coxaDireita: medidasOptional,
  coxaEsquerda: medidasOptional,
  bracoDireito: medidasOptional,
  bracoEsquerdo: medidasOptional,
  torax: medidasOptional,
  panturrilhaDir: medidasOptional,
  panturrilhaEsq: medidasOptional,
  peso: z.number().min(20).max(400).optional(),
  altura: z.number().min(0.5).max(2.5).optional(),
  observacoes: z.string().max(1000).optional(),
});

export type EvolucaoInput = z.infer<typeof evolucaoSchema>;

// ─── 6. Pagamento ────────────────────────────────────────────────────────────

export const pagamentoSchema = z.object({
  agendamentoId: z.string().cuid("ID do agendamento inválido"),
  metodo: z.enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO"]),
  cpf: z
    .string()
    .regex(cpfRegex, "CPF no formato XXX.XXX.XXX-XX")
    .refine(validarCPF, "CPF inválido"),
  email: z.string().email("Email inválido"),
  nome: z.string().min(3, "Nome é obrigatório"),
});

export type PagamentoInput = z.infer<typeof pagamentoSchema>;

// ─── 7. Serviço (Admin) ──────────────────────────────────────────────────────

export const servicoSchema = z.object({
  nome: z.string().min(3, "Nome do serviço é obrigatório").max(100),
  descricao: z.string().min(10, "Descrição muito curta").max(2000),
  descricaoCurta: z.string().max(200).optional(),
  categoria: z.enum([
    "FACIAL",
    "CORPORAL",
    "CAPILAR",
    "DEPILACAO",
    "MASSAGEM",
    "PACOTE",
  ]),
  preco: z.number().min(0.01, "Preço deve ser maior que zero").max(99999.99),
  precoPromocional: z.number().min(0).max(99999.99).optional(),
  duracaoMinutos: z
    .number()
    .int()
    .min(15, "Duração mínima de 15 minutos")
    .max(480, "Duração máxima de 8 horas"),
  ativo: z.boolean().optional(),
  destaque: z.boolean().optional(),
});

export type ServicoInput = z.infer<typeof servicoSchema>;

// ─── 8. Configurações do Sistema (Admin) ─────────────────────────────────────

export const configuracaoSchema = z.object({
  nomeClinica: z.string().min(3).max(100),
  telefone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  endereco: z.string().max(300).optional(),
  cnpj: z.string().max(20).optional(),
  horarioAbertura: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  horarioFechamento: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  intervaloMinutos: z.number().int().min(10).max(120),
  diasFuncionamento: z.array(z.number().int().min(0).max(6)),
});

export type ConfiguracaoInput = z.infer<typeof configuracaoSchema>;

// ─── 9. Bloqueio de Agenda (Admin) ───────────────────────────────────────────

export const bloqueioAgendaSchema = z
  .object({
    titulo: z.string().min(3, "Título é obrigatório").max(100),
    dataInicio: z.string().datetime("Data inválida"),
    dataFim: z.string().datetime("Data inválida"),
    motivo: z.string().max(300).optional(),
    diaTodo: z.boolean().optional(),
  })
  .refine((data) => new Date(data.dataFim) > new Date(data.dataInicio), {
    message: "Data final deve ser após data inicial",
    path: ["dataFim"],
  });

export type BloqueioAgendaInput = z.infer<typeof bloqueioAgendaSchema>;

// ─── 10. Chatbot / Mensagem ──────────────────────────────────────────────────

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Mensagem vazia")
    .max(500, "Mensagem muito longa")
    .trim(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
