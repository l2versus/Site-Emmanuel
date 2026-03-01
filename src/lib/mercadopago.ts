// ══════════════════════════════════════════════════════════════════════════════
// 💳 SDK do Mercado Pago — Pagamentos com PIX e Cartão
// Inclui helpers de criação de pagamento, verificação HMAC e anti-fraude
// ══════════════════════════════════════════════════════════════════════════════

import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import crypto from "crypto";

// ─── Instância do Mercado Pago ────────────────────────────────────────────────
const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const paymentClient = new Payment(mercadoPagoClient);
export const preferenceClient = new Preference(mercadoPagoClient);

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface CriarPagamentoPixParams {
  valor: number;
  descricao: string;
  emailPagador: string;
  cpfPagador: string;
  nomePagador: string;
  idempotencyKey: string;
  agendamentoId: string;
}

export interface CriarPreferenciaParams {
  titulo: string;
  descricao: string;
  valor: number;
  agendamentoId: string;
  emailPagador: string;
}

// ─── Criar Pagamento PIX (Instantâneo) ───────────────────────────────────────
export async function criarPagamentoPix({
  valor,
  descricao,
  emailPagador,
  cpfPagador,
  nomePagador,
  idempotencyKey,
  agendamentoId,
}: CriarPagamentoPixParams) {
  const response = await paymentClient.create({
    body: {
      transaction_amount: valor,
      description: descricao,
      payment_method_id: "pix",
      payer: {
        email: emailPagador,
        first_name: nomePagador.split(" ")[0],
        last_name: nomePagador.split(" ").slice(1).join(" "),
        identification: {
          type: "CPF",
          number: cpfPagador.replace(/\D/g, ""),
        },
      },
      metadata: {
        agendamento_id: agendamentoId,
      },
    },
    requestOptions: {
      idempotencyKey,
    },
  });

  return {
    id: response.id,
    status: response.status,
    qrCode: response.point_of_interaction?.transaction_data?.qr_code,
    qrCodeBase64:
      response.point_of_interaction?.transaction_data?.qr_code_base64,
    expiresAt: response.date_of_expiration,
  };
}

// ─── Criar Preferência de Pagamento (Cartão/Boleto) ──────────────────────────
export async function criarPreferencia({
  titulo,
  descricao,
  valor,
  agendamentoId,
  emailPagador,
}: CriarPreferenciaParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const response = await preferenceClient.create({
    body: {
      items: [
        {
          id: agendamentoId,
          title: titulo,
          description: descricao,
          quantity: 1,
          unit_price: valor,
          currency_id: "BRL",
        },
      ],
      payer: {
        email: emailPagador,
      },
      back_urls: {
        success: `${baseUrl}/dashboard?pagamento=sucesso`,
        failure: `${baseUrl}/dashboard?pagamento=falha`,
        pending: `${baseUrl}/dashboard?pagamento=pendente`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      metadata: {
        agendamento_id: agendamentoId,
      },
      statement_descriptor: "EMMANUEL ESTETICA",
    },
  });

  return {
    id: response.id,
    initPoint: response.init_point,
    sandboxInitPoint: response.sandbox_init_point,
  };
}

// ─── Validação HMAC-SHA256 do Webhook ─────────────────────────────────────────
export function validarWebhookHMAC(
  xSignature: string,
  xRequestId: string,
  dataId: string
): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET!;

  // Parsear x-signature header
  const parts = xSignature.split(",");
  let ts = "";
  let hash = "";

  for (const part of parts) {
    const [key, value] = part.trim().split("=");
    if (key === "ts") ts = value;
    if (key === "v1") hash = value;
  }

  // Construir o manifest para gerar o hash
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hmac, "hex"),
    Buffer.from(hash, "hex")
  );
}

// ─── Detecção de Fraude (Anti-fraude de Transação) ────────────────────────────
export function detectarFraude(
  valorOriginal: number,
  valorPago: number
): { fraude: boolean; motivo: string | null } {
  const diferenca = Math.abs(valorOriginal - valorPago);

  // Bloqueia se diferença for maior que R$ 0,50
  if (diferenca > 0.5) {
    return {
      fraude: true,
      motivo: `Diferença de valor detectada: R$ ${diferenca.toFixed(2)} (original: R$ ${valorOriginal.toFixed(2)}, pago: R$ ${valorPago.toFixed(2)})`,
    };
  }

  return { fraude: false, motivo: null };
}

// ─── Consultar Status de Pagamento ────────────────────────────────────────────
export async function consultarPagamento(paymentId: number) {
  const response = await paymentClient.get({ id: paymentId });

  return {
    id: response.id,
    status: response.status,
    statusDetail: response.status_detail,
    transactionAmount: response.transaction_amount,
    metadata: response.metadata,
  };
}

export default mercadoPagoClient;
