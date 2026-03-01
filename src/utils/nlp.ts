// ══════════════════════════════════════════════════════════════════════════════
// 🤖 NLP Local — Motor de Detecção de Intenções do Chatbot "Myka IA"
// 14 Intenções com scoring semântico por similaridade de palavras-chave
// ══════════════════════════════════════════════════════════════════════════════

export type IntencaoId =
  | "saudacao"
  | "agendamento"
  | "cancelamento"
  | "reagendamento"
  | "precos"
  | "servicos"
  | "horarios"
  | "localizacao"
  | "pagamento"
  | "anamnese"
  | "resultados"
  | "promocao"
  | "reclamacao"
  | "despedida";

interface Intencao {
  id: IntencaoId;
  label: string;
  keywords: string[];
  respostas: string[];
  prioridade: number;
}

// ─── Base de Conhecimento (14 Intenções) ──────────────────────────────────────
const intencoes: Intencao[] = [
  {
    id: "saudacao",
    label: "Saudação",
    keywords: [
      "oi", "olá", "ola", "bom dia", "boa tarde", "boa noite",
      "hey", "eae", "e aí", "salve", "hello", "hi",
    ],
    respostas: [
      "Olá! Eu sou a Myka, assistente virtual da Emmanuel Estética. 💕 Como posso te ajudar hoje?",
      "Oi! Bem-vinda à Emmanuel Estética Premium! ✨ Posso te ajudar com agendamentos, preços ou informações sobre nossos tratamentos.",
    ],
    prioridade: 1,
  },
  {
    id: "agendamento",
    label: "Agendamento",
    keywords: [
      "agendar", "agendamento", "marcar", "reservar", "horário",
      "disponível", "vaga", "consulta", "sessão", "quero marcar",
      "tem horário", "agenda", "combinar",
    ],
    respostas: [
      "Adoraria te ajudar a agendar! 📅 Você pode agendar diretamente pelo nosso sistema clicando no botão abaixo, ou me dizer qual procedimento deseja.",
      "Vamos agendar seu tratamento! ✨ Qual procedimento você tem interesse? Temos horários disponíveis esta semana.",
    ],
    prioridade: 10,
  },
  {
    id: "cancelamento",
    label: "Cancelamento",
    keywords: [
      "cancelar", "cancela", "desmarcar", "desistir", "não quero mais",
      "não vou", "remover agendamento", "tirar da agenda",
    ],
    respostas: [
      "Entendo que imprevistos acontecem. 😊 Para cancelar seu agendamento, acesse sua área de cliente ou me informe a data e procedimento, e eu te direciono.",
      "Sem problemas! Para cancelar, preciso confirmar alguns dados. Pode me informar seu nome e a data do agendamento?",
    ],
    prioridade: 9,
  },
  {
    id: "reagendamento",
    label: "Reagendamento",
    keywords: [
      "reagendar", "remarcar", "mudar data", "trocar horário",
      "mudar horário", "alterar data", "outro dia", "outra hora",
    ],
    respostas: [
      "Claro! Vamos reagendar seu horário. 🔄 Me informe a data atual do seu agendamento e a nova data desejada.",
      "Sem problemas! Posso te ajudar a encontrar um novo horário. Qual procedimento e data você precisa alterar?",
    ],
    prioridade: 9,
  },
  {
    id: "precos",
    label: "Preços",
    keywords: [
      "preço", "preco", "valor", "quanto custa", "quanto é", "tabela",
      "custo", "investimento", "quanto fica", "quanto sai", "$$",
    ],
    respostas: [
      "Nossos valores são personalizados para cada tratamento! 💰 Posso te enviar nossa tabela de preços. Qual área te interessa mais: facial, corporal ou capilar?",
      "Ótima pergunta! Nossos preços variam de acordo com o procedimento. Vou te mostrar nossa tabela atualizada. Tem algum tratamento específico em mente?",
    ],
    prioridade: 8,
  },
  {
    id: "servicos",
    label: "Serviços",
    keywords: [
      "serviço", "servico", "procedimento", "tratamento", "o que vocês fazem",
      "quais", "opções", "opcoes", "catálogo", "menu", "lista",
      "facial", "corporal", "massagem", "depilação", "limpeza de pele",
    ],
    respostas: [
      "Temos uma linha completa de tratamentos premium! ✨ Oferecemos: Facial (limpeza, peeling, botox), Corporal (drenagem, criolipólise, radiofrequência), Capilar e muito mais!",
      "Nossa clínica oferece tratamentos de ponta! 💎 As categorias são: Facial, Corporal, Capilar, Depilação a Laser e Massagens. Quer saber mais sobre alguma?",
    ],
    prioridade: 7,
  },
  {
    id: "horarios",
    label: "Horários",
    keywords: [
      "horário", "horario", "que horas", "funcionamento", "abre",
      "fecha", "aberto", "fechado", "expediente", "sábado", "domingo",
    ],
    respostas: [
      "Nosso horário de atendimento: Segunda a Sexta das 08h às 20h e Sábado das 08h às 16h. 🕐 Domingo não abrimos.",
      "Funcionamos de segunda a sexta das 8h às 20h e sábado das 8h às 16h. ⏰ Quer agendar um horário?",
    ],
    prioridade: 5,
  },
  {
    id: "localizacao",
    label: "Localização",
    keywords: [
      "endereço", "endereco", "onde fica", "localização", "localizacao",
      "como chegar", "mapa", "rua", "bairro", "cep",
    ],
    respostas: [
      "Estamos localizados em um endereço privilegiado! 📍 Acesse nosso Google Maps pelo link no rodapé do site para traçar sua rota.",
      "Para ver nossa localização exata e traçar a melhor rota, acesse o mapa no rodapé do nosso site! 🗺️",
    ],
    prioridade: 4,
  },
  {
    id: "pagamento",
    label: "Pagamento",
    keywords: [
      "pagar", "pagamento", "pix", "cartão", "cartao", "boleto",
      "parcelar", "parcela", "forma de pagamento", "débito", "crédito",
    ],
    respostas: [
      "Aceitamos diversas formas de pagamento! 💳 PIX (com desconto), Cartão de Crédito (até 12x), Cartão de Débito e Dinheiro.",
      "Facilitamos para você! 💰 Pagamentos via PIX (instantâneo com desconto), Cartão de Crédito parcelado, Débito ou Dinheiro.",
    ],
    prioridade: 6,
  },
  {
    id: "anamnese",
    label: "Anamnese",
    keywords: [
      "ficha", "anamnese", "formulário", "formulario", "dados médicos",
      "alergia", "saúde", "saude", "histórico", "contraindicação",
    ],
    respostas: [
      "A ficha de anamnese é essencial para garantir sua segurança! 🏥 Você pode preenchê-la online na sua área de cliente antes da sessão.",
      "Sua segurança é prioridade! O preenchimento da anamnese é obrigatório e seus dados são protegidos por criptografia. Acesse sua área de cliente para preenchê-la.",
    ],
    prioridade: 6,
  },
  {
    id: "resultados",
    label: "Resultados",
    keywords: [
      "resultado", "antes e depois", "foto", "evolução", "evolucao",
      "progresso", "medida", "medição", "antes depois",
    ],
    respostas: [
      "Seus resultados ficam registrados na área de Evolução! 📊 Lá você acompanha medições corporais, fotos antes/depois e seu progresso completo.",
      "Acompanhe sua evolução pela área de cliente! 📈 Registramos 13 medições corporais e fotos comparativas a cada sessão.",
    ],
    prioridade: 5,
  },
  {
    id: "promocao",
    label: "Promoção",
    keywords: [
      "promoção", "promocao", "desconto", "oferta", "cupom",
      "black friday", "combo", "pacote", "especial",
    ],
    respostas: [
      "Temos promoções especiais rolando! 🎉 Confira nossos pacotes com desconto na página principal. Quer que eu te mostre as ofertas ativas?",
      "Ótimo timing! ✨ Temos pacotes promocionais com até 30% de desconto. Dá uma olhada na nossa página de serviços!",
    ],
    prioridade: 7,
  },
  {
    id: "reclamacao",
    label: "Reclamação",
    keywords: [
      "reclamação", "reclamacao", "problema", "insatisfeito", "ruim",
      "péssimo", "pessimo", "horrível", "horrivel", "não gostei",
      "devolver", "reembolso",
    ],
    respostas: [
      "Lamento que tenha tido uma experiência ruim. 😔 Sua satisfação é muito importante para nós. Vou direcionar sua mensagem para nossa equipe resolver o mais rápido possível.",
      "Sinto muito por isso. 💙 Quero garantir que resolvamos sua situação. Um membro da nossa equipe vai entrar em contato com você em breve.",
    ],
    prioridade: 10,
  },
  {
    id: "despedida",
    label: "Despedida",
    keywords: [
      "tchau", "até mais", "ate mais", "obrigado", "obrigada",
      "valeu", "falou", "bye", "adeus", "até logo",
    ],
    respostas: [
      "Foi um prazer te atender! 💕 Se precisar de algo mais, estarei aqui. Até breve! ✨",
      "Obrigada por conversar comigo! 😊 Estou sempre aqui quando precisar. Tenha um dia maravilhoso! 💖",
    ],
    prioridade: 1,
  },
];

// ─── Motor de NLP (Scoring por Similaridade) ──────────────────────────────────

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(" ").filter(Boolean);
}

interface DeteccaoResultado {
  intencao: IntencaoId;
  label: string;
  confianca: number;
  resposta: string;
}

/**
 * Detecta a intenção do usuário com base no texto e retorna a melhor correspondência
 */
export function detectarIntencao(texto: string): DeteccaoResultado {
  const tokens = tokenize(texto);
  const textoNormalizado = normalizeText(texto);

  let melhorScore = 0;
  let melhorIntencao: Intencao = intencoes[0]; // fallback: saudação

  for (const intencao of intencoes) {
    let score = 0;

    for (const keyword of intencao.keywords) {
      const keywordNorm = normalizeText(keyword);

      // Match exato completo (maior peso)
      if (textoNormalizado.includes(keywordNorm)) {
        score += 3 * keywordNorm.split(" ").length; // Frases multipalavra valem mais
        continue;
      }

      // Match parcial por token
      const keyTokens = keywordNorm.split(" ");
      for (const kToken of keyTokens) {
        for (const token of tokens) {
          if (token === kToken) {
            score += 2;
          } else if (token.includes(kToken) || kToken.includes(token)) {
            score += 1;
          }
        }
      }
    }

    // Boost de prioridade
    score *= 1 + intencao.prioridade * 0.05;

    if (score > melhorScore) {
      melhorScore = score;
      melhorIntencao = intencao;
    }
  }

  // Calcular confiança normalizada (0 a 1)
  const confianca = Math.min(melhorScore / 15, 1);

  // Selecionar resposta aleatória
  const resposta =
    melhorIntencao.respostas[
      Math.floor(Math.random() * melhorIntencao.respostas.length)
    ];

  return {
    intencao: melhorIntencao.id,
    label: melhorIntencao.label,
    confianca,
    resposta:
      confianca < 0.15
        ? "Desculpe, não entendi muito bem. 😅 Posso te ajudar com agendamentos, preços, serviços ou informações da clínica. O que prefere?"
        : resposta,
  };
}

/**
 * Retorna sugestões de ações rápidas baseadas na intenção detectada
 */
export function obterSugestoes(intencaoId: IntencaoId): string[] {
  const mapa: Record<IntencaoId, string[]> = {
    saudacao: ["Ver serviços", "Agendar horário", "Ver preços"],
    agendamento: ["Facial", "Corporal", "Massagem", "Ver horários"],
    cancelamento: ["Confirmar cancelamento", "Reagendar", "Falar com atendente"],
    reagendamento: ["Ver horários disponíveis", "Próxima semana", "Falar com atendente"],
    precos: ["Facial", "Corporal", "Pacotes", "Agendar"],
    servicos: ["Facial", "Corporal", "Capilar", "Depilação"],
    horarios: ["Agendar agora", "Ver serviços"],
    localizacao: ["Ver no mapa", "Agendar visita"],
    pagamento: ["Pagar com PIX", "Ver parcelas", "Agendar"],
    anamnese: ["Preencher ficha", "Minha área"],
    resultados: ["Ver evolução", "Fotos antes/depois"],
    promocao: ["Ver ofertas", "Agendar com desconto"],
    reclamacao: ["Falar com gerente", "Solicitar reembolso"],
    despedida: ["Nova consulta", "Ver serviços"],
  };

  return mapa[intencaoId] || ["Ver serviços", "Agendar", "Preços"];
}
