// ══════════════════════════════════════════════════════════════════════════════
// 📋 Página de Orçamento — EB Emmanuel Bezerra
// Estilo editorial (serifa + paleta quente), de baixo atrito: envio direto pro WhatsApp
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Layers,
  Check,
  Send,
  Clock,
  Shield,
  Headphones,
  Rocket,
  Globe,
  Smartphone,
  ShoppingCart,
  ChevronRight,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";

// Número de WhatsApp (formato internacional, sem símbolos)
const WHATSAPP_NUMBER = "5585998500344";

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const projectTypes = [
  {
    id: "landing",
    icon: Globe,
    title: "Landing Page",
    desc: "Página única focada em conversão",
    features: ["Design responsivo", "SEO otimizado", "Formulário de contato", "Analytics integrado"],
    timeline: "7-14 dias",
  },
  {
    id: "institucional",
    icon: Layers,
    title: "Site Institucional",
    desc: "Múltiplas páginas com CMS",
    features: ["Até 10 páginas", "Painel admin", "Blog integrado", "Performance otimizada"],
    timeline: "15-30 dias",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce",
    desc: "Loja virtual completa",
    features: ["Catálogo de produtos", "Carrinho + checkout", "Gateway de pagamento", "Gestão de pedidos"],
    timeline: "30-60 dias",
  },
  {
    id: "webapp",
    icon: Rocket,
    title: "Web App / SaaS",
    desc: "Sistema web personalizado",
    features: ["Autenticação segura", "Dashboard interativo", "APIs customizadas", "Integrações"],
    timeline: "45-90 dias",
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "App Mobile",
    desc: "React Native / PWA",
    features: ["iOS + Android", "Notificações push", "Modo offline", "Publicação nas lojas"],
    timeline: "60-120 dias",
  },
];

const techShowcase = [
  {
    name: "Next.js",
    desc: "Framework React de última geração com Server Components e SEO impecável. Seu site carrega em milissegundos.",
    glyph: "▲",
  },
  {
    name: "TypeScript",
    desc: "Código 100% tipado significa menos bugs e manutenção mais fácil. É o padrão da indústria para projetos sérios.",
    glyph: "TS",
  },
  {
    name: "Tailwind CSS",
    desc: "Sistema de design moderno que garante consistência visual e responsividade perfeita em qualquer tela.",
    glyph: "✦",
  },
  {
    name: "PostgreSQL + Prisma",
    desc: "Banco de dados enterprise com queries otimizadas. Seus dados ficam seguros, organizados e acessíveis.",
    glyph: "◆",
  },
  {
    name: "Vercel / AWS",
    desc: "Infraestrutura de nível mundial com CDN global, SSL automático e escalabilidade. O mesmo que a Netflix usa.",
    glyph: "☁",
  },
];

const guarantees = [
  { icon: Clock, title: "Prazo Garantido", desc: "Compromisso com datas de entrega" },
  { icon: Shield, title: "Código Fonte Seu", desc: "Propriedade total do projeto" },
  { icon: Headphones, title: "Suporte Pós-Entrega", desc: "30 dias de suporte gratuito" },
  { icon: Rocket, title: "Performance A+", desc: "Nota máxima no Google PageSpeed" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Rótulo monoespaçado em caixa alta (assinatura visual do site)
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-[#a8977f]">
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function OrcamentoPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    investment: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Monta a mensagem para o WhatsApp
    const selectedProject = projectTypes.find((p) => p.id === selectedType);
    const message = encodeURIComponent(
      `🚀 *Novo Orçamento — pelo site*\n\n` +
        `*Nome:* ${formData.name}\n` +
        `*E-mail:* ${formData.email}\n` +
        `*WhatsApp:* ${formData.phone}\n` +
        `*Investimento pretendido:* ${formData.investment}\n` +
        (selectedProject ? `*Tipo de projeto:* ${selectedProject.title}\n` : "") +
        (formData.description ? `\n*Sobre o projeto:*\n${formData.description}` : "")
    );

    // IMPORTANTE: abrir de forma SÍNCRONA dentro do clique preserva o "user gesture"
    // e evita que o navegador (sobretudo no mobile) bloqueie o WhatsApp.
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    const win = window.open(url, "_blank");
    if (!win) window.location.href = url; // fallback (popup bloqueado / mobile)

    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0907] text-[#f3ece1] antialiased">
      {/* ─── Fundo quente (sem neon) ─────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[#e8a36b]/[0.07] blur-[150px]" />
        <div className="absolute bottom-[-15%] right-[-5%] h-[50vh] w-[50vh] rounded-full bg-[#b9763f]/[0.06] blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_40%,#070605_100%)]" />
      </div>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pt-28 pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-sm text-[#9c9286] transition-colors hover:text-[#f0a875]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao portfólio
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mb-7 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-[#f0a875]/40" />
              <Eyebrow>Orçamento · sem compromisso</Eyebrow>
              <span className="h-px w-8 bg-[#f0a875]/40" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-[#f4ede2] sm:text-5xl lg:text-6xl">
              Vamos transformar sua ideia
              <br />
              em{" "}
              <span className="italic text-[#f0a875]">algo memorável</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-[#9c9286] sm:text-lg">
              Preencha alguns campos rápidos e seu pedido cai direto no meu WhatsApp.
              Respondo pessoalmente em até 24 horas — sem robô, sem enrolação.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Garantias ───────────────────────────────────────────────────── */}
      <section className="relative z-10 border-y border-[#f3ece1]/[0.07] bg-[#0c0a08]/60 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {guarantees.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[#f0a875]/25 bg-[#f0a875]/10 text-[#f0a875]">
                    <g.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#f4ede2]">{g.title}</div>
                    <div className="text-xs leading-snug text-[#9c9286]">{g.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Formulário / Sucesso ────────────────────────────────────────── */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-5xl px-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-lg py-16 text-center"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#f0a875]/25 bg-[#f0a875]/10">
                <BadgeCheck className="h-10 w-10 text-[#f0a875]" />
              </div>
              <h2 className="font-display text-3xl text-[#f4ede2]">Pedido enviado!</h2>
              <p className="mx-auto mt-4 max-w-md text-[#9c9286]">
                Abri o WhatsApp com seu resumo — é só apertar enviar. Caso não tenha
                aberto, me chame direto pelo botão abaixo. Respondo em até 24 horas.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f0a875] px-7 py-3 text-sm font-semibold text-[#1a130d] transition-colors hover:bg-[#f5b98e]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Abrir WhatsApp
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-[#f3ece1]/15 px-7 py-3 text-sm font-medium text-[#cabfae] transition-colors hover:border-[#f0a875]/40 hover:text-[#f0a875]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao portfólio
                </Link>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-16">
              {/* Passo 1 — Tipo de projeto */}
              <div>
                <Reveal>
                  <div className="mb-8 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f0a875]/30 font-mono text-sm text-[#f0a875]">
                      1
                    </span>
                    <h2 className="font-display text-2xl text-[#f4ede2]">Tipo de projeto</h2>
                  </div>
                </Reveal>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projectTypes.map((type, i) => {
                    const active = selectedType === type.id;
                    return (
                      <Reveal key={type.id} delay={i * 0.05}>
                        <motion.button
                          type="button"
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedType(active ? null : type.id)}
                          className={`relative h-full w-full rounded-2xl border p-6 text-left transition-colors duration-300 ${
                            active
                              ? "border-[#f0a875]/50 bg-[#f0a875]/[0.06]"
                              : "border-[#f3ece1]/[0.08] bg-[#13110d] hover:border-[#f3ece1]/20"
                          }`}
                        >
                          {active && (
                            <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#f0a875] text-[#1a130d]">
                              <Check className="h-4 w-4" />
                            </span>
                          )}

                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#f0a875]/20 bg-[#f0a875]/10 text-[#f0a875]">
                            <type.icon className="h-6 w-6" />
                          </div>

                          <h3 className="font-display text-lg text-[#f4ede2]">{type.title}</h3>
                          <p className="mt-1 text-sm text-[#9c9286]">{type.desc}</p>

                          <div className="mt-4 flex items-center gap-1.5 text-xs text-[#8a8275]">
                            <Clock className="h-3 w-3" />
                            {type.timeline}
                          </div>

                          {active && (
                            <ul className="mt-4 space-y-2 border-t border-[#f3ece1]/[0.08] pt-4">
                              {type.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-[#b6ac9c]">
                                  <Check className="h-3 w-3 flex-none text-[#f0a875]" />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          )}
                        </motion.button>
                      </Reveal>
                    );
                  })}
                </div>
              </div>

              {/* Passo 2 — Seus dados */}
              <div>
                <Reveal>
                  <div className="mb-8 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f0a875]/30 font-mono text-sm text-[#f0a875]">
                      2
                    </span>
                    <h2 className="font-display text-2xl text-[#f4ede2]">Suas informações</h2>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="grid max-w-4xl gap-6 sm:grid-cols-2">
                    <Field label="Nome completo *">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputCls}
                        placeholder="Seu nome"
                      />
                    </Field>

                    <Field label="E-mail *">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputCls}
                        placeholder="seu@email.com"
                      />
                    </Field>

                    <Field label="WhatsApp *">
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={inputCls}
                        placeholder="(00) 00000-0000"
                      />
                    </Field>

                    <Field label="Investimento pretendido">
                      <select
                        value={formData.investment}
                        onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                        className={inputCls}
                      >
                        <option value="">Prefiro conversar</option>
                        <option value="ate-2k">Até R$ 2.000</option>
                        <option value="2k-5k">R$ 2.000 – R$ 5.000</option>
                        <option value="5k-10k">R$ 5.000 – R$ 10.000</option>
                        <option value="10k-mais">Acima de R$ 10.000</option>
                      </select>
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Sobre o projeto">
                        <textarea
                          rows={5}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className={`${inputCls} resize-none`}
                          placeholder="Conte sua ideia, funcionalidades desejadas, referências que você gosta, público-alvo..."
                        />
                      </Field>
                    </div>
                  </div>
                </Reveal>

                {/* Enviar */}
                <Reveal delay={0.15}>
                  <div className="mt-10">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-3 rounded-full bg-[#f0a875] px-9 py-4 font-semibold text-[#1a130d] shadow-[0_10px_40px_-12px_rgba(240,168,117,0.5)] transition-colors hover:bg-[#f5b98e]"
                    >
                      <Send className="h-5 w-5" />
                      Enviar pelo WhatsApp
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                    <p className="mt-3 text-xs text-[#8a8275]">
                      Seu pedido vai montado direto na conversa. Você só confere e envia.
                    </p>
                  </div>
                </Reveal>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ─── Tecnologias ─────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-[#f3ece1]/[0.07] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="mb-14 text-center">
              <Eyebrow>Stack</Eyebrow>
              <h2 className="mt-4 font-display text-3xl text-[#f4ede2]">
                Tecnologias que uso no seu projeto
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[#9c9286]">
                Ferramentas modernas e comprovadas para garantir performance, segurança e
                escalabilidade.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {techShowcase.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-[#f3ece1]/[0.08] bg-[#13110d] p-6 transition-colors hover:border-[#f0a875]/25">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#f0a875]/20 bg-[#f0a875]/10 text-lg text-[#f0a875]">
                    {tech.glyph}
                  </div>
                  <h3 className="font-display text-lg text-[#f4ede2]">{tech.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#9c9286]">{tech.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA final ───────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-[#f3ece1]/[0.07] py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <Eyebrow>Prefere conversar?</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-3xl text-[#f4ede2]">
              Me chame diretamente no WhatsApp
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-3 max-w-md text-[#9c9286]">
              Sem formulário, sem espera. Respondo pessoalmente e a gente alinha tudo por lá.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Olá Emmanuel! Vi seu portfólio e gostaria de um orçamento."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f0a875] px-8 py-4 font-semibold text-[#1a130d] transition-colors hover:bg-[#f5b98e]"
            >
              <MessageCircle className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ─── Helpers de formulário ──────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-[#f3ece1]/[0.1] bg-[#13110d] px-4 py-3 text-[#f4ede2] placeholder-[#6f6657] transition-colors focus:border-[#f0a875]/60 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#b6ac9c]">{label}</span>
      {children}
    </label>
  );
}
