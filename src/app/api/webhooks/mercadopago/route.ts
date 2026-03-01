// ══════════════════════════════════════════════════════════════════════════════
// 💳 Webhook Mercado Pago — Validação HMAC-SHA256 + Anti-fraude
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { validarWebhookHMAC, consultarPagamento, detectarFraude } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // ─── 1. Validar assinatura HMAC ─────────────────────────────────────
    const body = await request.text();
    const signature = request.headers.get("x-signature") || "";
    const requestId = request.headers.get("x-request-id") || "";

    const isValid = validarWebhookHMAC(body, signature, requestId);
    if (!isValid) {
      console.error("[WEBHOOK] Assinatura HMAC inválida");
      return NextResponse.json(
        { error: "Assinatura inválida" },
        { status: 401 }
      );
    }

    // ─── 2. Parse do evento ─────────────────────────────────────────────
    const event = JSON.parse(body);

    if (event.type !== "payment") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const paymentId = Number(event.data?.id);
    if (!paymentId) {
      return NextResponse.json({ error: "ID ausente" }, { status: 400 });
    }

    // ─── 3. Consultar pagamento no MP ───────────────────────────────────
    const pagamento = await consultarPagamento(paymentId);
    if (!pagamento) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      );
    }

    // ─── 4. Detecção de fraude (threshold R$ 0,50) ──────────────────────
    const valorOriginal = pagamento.transactionAmount ?? 0;
    const valorPago = pagamento.transactionAmount ?? 0;
    const fraudeResult = detectarFraude(valorOriginal, valorPago);
    const isFraude = fraudeResult.fraude;

    // ─── 5. Mapear status MP → nosso enum ───────────────────────────────
    const statusMap: Record<string, string> = {
      approved: "APROVADO",
      pending: "PENDENTE",
      authorized: "PENDENTE",
      in_process: "PROCESSANDO",
      in_mediation: "EM_DISPUTA",
      rejected: "REJEITADO",
      cancelled: "CANCELADO",
      refunded: "REEMBOLSADO",
      charged_back: "ESTORNADO",
    };

    const statusInterno = statusMap[pagamento.status ?? ""] || "PENDENTE";
    const paymentIdStr = String(paymentId);

    // ─── 6. Atualizar no banco ──────────────────────────────────────────
    await prisma.pagamento.updateMany({
      where: { mercadoPagoId: paymentIdStr },
      data: {
        status: statusInterno as any,
        mercadoPagoStatus: pagamento.status ?? undefined,
        fraudeDetected: isFraude,
        fraudeMotivo: fraudeResult.motivo,
      },
    });

    // Se aprovado, confirmar agendamento vinculado (relação 1:1)
    if (statusInterno === "APROVADO" && !isFraude) {
      await prisma.agendamento.updateMany({
        where: {
          pagamento: { mercadoPagoId: paymentIdStr },
        },
        data: {
          status: "CONFIRMADO",
        },
      });
    }

    // Se fraude detectada, cancelar
    if (isFraude) {
      await prisma.agendamento.updateMany({
        where: {
          pagamento: { mercadoPagoId: paymentIdStr },
        },
        data: {
          status: "CANCELADO" as any,
        },
      });

      // Log de auditoria
      await prisma.auditLog.create({
        data: {
          action: "FRAUDE_DETECTADA",
          entity: "Pagamento",
          entityId: paymentIdStr,
          newData: {
            valor: valorOriginal,
            motivo: fraudeResult.motivo,
            ip: request.headers.get("x-forwarded-for"),
          },
          ip: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "webhook",
        },
      });
    }

    // ─── 7. Log de auditoria do webhook ─────────────────────────────────
    await prisma.auditLog.create({
      data: {
        action: "WEBHOOK_MERCADOPAGO",
        entity: "Pagamento",
        entityId: paymentIdStr,
        newData: {
          status: pagamento.status,
          amount: pagamento.transactionAmount,
          fraude: isFraude,
        },
        ip: request.headers.get("x-forwarded-for") || "webhook",
        userAgent: request.headers.get("user-agent") || "mercadopago",
      },
    });

    return NextResponse.json({ received: true, status: statusInterno });
  } catch (error) {
    console.error("[WEBHOOK] Erro:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}

// Desabilitar body parser do Next (necessário para HMAC raw body)
export const runtime = "nodejs";
