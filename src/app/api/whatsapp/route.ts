// ══════════════════════════════════════════════════════════════════════════════
// 📱 WhatsApp API — Disparo via Evolution API
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EVOLUTION_API_URL = process.env.WHATSAPP_API_URL || "";
const EVOLUTION_API_KEY = process.env.WHATSAPP_API_KEY || "";
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || "emmanuel-clinica";

interface WhatsAppPayload {
  telefone: string;
  mensagem: string;
  tipo: "CONFIRMACAO" | "LEMBRETE" | "MARKETING" | "CANCELAMENTO" | "CUSTOM";
  agendamentoId?: string;
  userId?: string;
}

// ─── Templates de mensagem ──────────────────────────────────────────────────

const templates: Record<string, (data: any) => string> = {
  CONFIRMACAO: (data) =>
    `✅ *Agendamento Confirmado!*\n\n` +
    `Olá ${data.nome}! Seu agendamento na Emmanuel Estética foi confirmado:\n\n` +
    `📋 *Serviço:* ${data.servico}\n` +
    `📅 *Data:* ${data.data}\n` +
    `🕐 *Horário:* ${data.horario}\n` +
    `👩‍⚕️ *Profissional:* ${data.profissional}\n\n` +
    `📍 Fortaleza - CE\n\n` +
    `Para cancelar ou reagendar, acesse sua área do cliente.\n` +
    `_Emmanuel Estética Premium_ ✨`,

  LEMBRETE: (data) =>
    `⏰ *Lembrete de Agendamento*\n\n` +
    `Olá ${data.nome}! Passando para lembrar do seu horário:\n\n` +
    `📋 *${data.servico}*\n` +
    `📅 *Amanhã*, ${data.data} às ${data.horario}\n\n` +
    `Confirme sua presença respondendo esta mensagem.\n` +
    `_Emmanuel Estética Premium_ 💖`,

  CANCELAMENTO: (data) =>
    `😔 *Agendamento Cancelado*\n\n` +
    `Olá ${data.nome}, seu agendamento de ${data.servico} em ${data.data} foi cancelado.\n\n` +
    `Deseja reagendar? Acesse nosso site ou responda esta mensagem.\n` +
    `_Emmanuel Estética Premium_`,

  MARKETING: (data) =>
    `🎉 *Oferta Especial!*\n\n${data.mensagem}\n\n` +
    `Agende pelo site ou responda esta mensagem!\n` +
    `_Emmanuel Estética Premium_ ✨`,

  CUSTOM: (data) => data.mensagem,
};

// ─── Enviar via Evolution API ───────────────────────────────────────────────

async function enviarWhatsApp(telefone: string, mensagem: string) {
  // Normalizar telefone para formato internacional
  const numero = telefone.replace(/\D/g, "");
  const telInternacional = numero.startsWith("55") ? numero : `55${numero}`;

  const response = await fetch(
    `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: EVOLUTION_API_KEY,
      },
      body: JSON.stringify({
        number: `${telInternacional}@s.whatsapp.net`,
        text: mensagem,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Evolution API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ─── POST Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Verificar API key interna (proteção da rota)
    const authHeader = request.headers.get("x-api-key");
    if (authHeader !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body: WhatsAppPayload = await request.json();

    if (!body.telefone || !body.tipo) {
      return NextResponse.json(
        { error: "telefone e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // Gerar mensagem a partir do template
    const templateFn = templates[body.tipo];
    if (!templateFn) {
      return NextResponse.json(
        { error: "Tipo de mensagem inválido" },
        { status: 400 }
      );
    }

    const mensagem = templateFn(body);

    // Enviar via Evolution API
    const resultado = await enviarWhatsApp(body.telefone, mensagem);

    // Registrar notificação no banco
    if (body.userId) {
      const tipoNotificacao =
        body.tipo === "LEMBRETE" ? "LEMBRETE_24H" as const
        : body.tipo === "MARKETING" ? "PROMOCAO" as const
        : "SISTEMA" as const;

      await prisma.notificacao.create({
        data: {
          userId: body.userId,
          tipo: tipoNotificacao,
          canal: "WHATSAPP",
          titulo: `WhatsApp: ${body.tipo}`,
          mensagem: mensagem.substring(0, 500),
          enviadaEm: new Date(),
        },
      });
    }

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        action: "WHATSAPP_ENVIADO",
        entity: "Notificacao",
        entityId: body.agendamentoId || "direct",
        newData: {
          tipo: body.tipo,
          telefone: body.telefone.replace(/\d{4}$/, "****"),
          evolutionResponse: resultado,
        },
        ip: request.headers.get("x-forwarded-for") || "server",
        userAgent: "whatsapp-api",
      },
    });

    return NextResponse.json({
      success: true,
      messageId: resultado?.key?.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[WHATSAPP] Erro:", error);
    return NextResponse.json(
      { error: "Falha ao enviar mensagem" },
      { status: 500 }
    );
  }
}
