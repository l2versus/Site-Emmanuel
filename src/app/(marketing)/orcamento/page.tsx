// ══════════════════════════════════════════════════════════════════════════════
// 📋 Página de Orçamento — EB Emmanuel Bezerra
// Form de baixo atrito: 4 campos + envio direto pro WhatsApp
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Layers,
  Check,
  Send,
  Sparkles,
  Zap,
  Clock,
  Shield,
  Headphones,
  Rocket,
  Globe,
  Smartphone,
  ShoppingCart,
  ChevronRight,
  Star,
  BadgeCheck,
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
    color: "#00f0ff",
  },
  {
    id: "institucional",
    icon: Layers,
    title: "Site Institucional",
    desc: "Múltiplas páginas com CMS",
    features: ["Até 10 páginas", "Painel admin", "Blog integrado", "Otimização de performance"],
    timeline: "15-30 dias",
    color: "#ff00ff",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce",
    desc: "Loja virtual completa",
    features: ["Catálogo de produtos", "Carrinho + checkout", "Gateway de pagamento", "Gestão de pedidos"],
    timeline: "30-60 dias",
    color: "#00ff41",
  },
  {
    id: "webapp",
    icon: Rocket,
    title: "Web App / SaaS",
    desc: "Sistema web personalizado",
    features: ["Autenticação segura", "Dashboard interativo", "APIs customizadas", "Integrações"],
    timeline: "45-90 dias",
    color: "#ffaa00",
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "App Mobile",
    desc: "React Native / PWA",
    features: ["iOS + Android", "Notificações push", "Modo offline", "Publicação nas lojas"],
    timeline: "60-120 dias",
    color: "#aa00ff",
  },
];

const techShowcase = [
  {
    name: "Next.js 14",
    desc: "Framework React de última geração com Server Components, otimização automática de imagens e SEO perfeito. Seu site carrega em milissegundos.",
    icon: "▲",
    color: "#fff",
  },
  {
    name: "TypeScript",
    desc: "Código 100% tipado significa menos bugs, manutenção mais fácil e confiabilidade. É o padrão da indústria para projetos sérios.",
    icon: "TS",
    color: "#3178c6",
  },
  {
    name: "Tailwind CSS",
    desc: "Sistema de design moderno que garante consistência visual, responsividade perfeita em todos os dispositivos e performance CSS otimizada.",
    icon: "🎨",
    color: "#38bdf8",
  },
  {
    name: "PostgreSQL + Prisma",
    desc: "Banco de dados enterprise-grade com queries otimizadas. Seus dados ficam seguros, organizados e acessíveis de forma eficiente.",
    icon: "◆",
    color: "#2d3748",
  },
  {
    name: "Vercel / AWS",
    desc: "Infraestrutura de nível mundial com CDN global, SSL automático, backups e escalabilidade infinita. O mesmo que Netflix e Airbnb usam.",
    icon: "☁️",
    color: "#ff9900",
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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
    <main className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Backgrounds */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#00f0ff]/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ff00ff]/[0.03] rounded-full blur-[150px] pointer-events-none" />

      {/* Hero (pt-28 garante espaço pra nav global fixa) */}
      <section className="relative z-10 pt-28 pb-16 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#6b6b80] hover:text-[#00f0ff] transition-colors mb-10"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao portfólio
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-8">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-sm font-mono text-[#00f0ff]">
                Orçamento sem compromisso
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Vamos transformar sua
              <br />
              <span className="gradient-text-cyber">ideia em realidade</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-[#6b6b80] max-w-2xl mx-auto">
              Preencha 4 campos rápidos e seu pedido cai direto no meu WhatsApp.
              Respondo pessoalmente em até 24 horas — sem robô, sem enrolação.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Guarantees */}
      <section className="relative z-10 py-12 border-y border-[#1e1e2e] bg-[#0a0a0f]/80">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {guarantees.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.1}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
                    <g.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{g.title}</div>
                    <div className="text-xs text-[#6b6b80]">{g.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-14"
              >
                {/* Step 1: Project Type (opcional) */}
                <div>
                  <Reveal>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00f0ff] text-black text-sm font-bold">
                        1
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        Tipo de projeto{" "}
                        <span className="text-[#6b6b80] text-base font-normal">(opcional)</span>
                      </h2>
                    </div>
                    <p className="text-sm text-[#6b6b80] mb-8 ml-11">
                      Se já tiver uma ideia, escolha abaixo. Se não souber, deixa em branco que a
                      gente define junto.
                    </p>
                  </Reveal>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projectTypes.map((type, i) => (
                      <Reveal key={type.id} delay={i * 0.05}>
                        <motion.button
                          type="button"
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setSelectedType((prev) => (prev === type.id ? null : type.id))
                          }
                          className={`relative w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                            selectedType === type.id
                              ? "border-[#00f0ff]/50 bg-[#00f0ff]/5"
                              : "border-[#1e1e2e] bg-[#0f0f18] hover:border-[#1e1e2e]/80"
                          }`}
                        >
                          {/* Selected indicator */}
                          {selectedType === type.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#00f0ff] text-black"
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                          )}

                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                            style={{
                              background: `${type.color}15`,
                              border: `1px solid ${type.color}25`,
                              color: type.color,
                            }}
                          >
                            <type.icon className="w-6 h-6" />
                          </div>

                          <h3 className="text-lg font-bold text-white mb-1">
                            {type.title}
                          </h3>
                          <p className="text-sm text-[#6b6b80] mb-4">
                            {type.desc}
                          </p>

                          <div className="flex items-center justify-end text-sm">
                            <span className="text-[#6b6b80] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {type.timeline}
                            </span>
                          </div>

                          {/* Features quando selecionado */}
                          <AnimatePresence>
                            {selectedType === type.id && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 pt-4 border-t border-[#1e1e2e] space-y-2 overflow-hidden"
                              >
                                {type.features.map((f) => (
                                  <li key={f} className="flex items-center gap-2 text-sm text-[#9999ab]">
                                    <Check className="w-3 h-3 text-[#00ff41]" />
                                    {f}
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </Reveal>
                    ))}
                  </div>
                </div>

                {/* Step 2: Seus dados */}
                <div>
                  <Reveal>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00ff41] text-black text-sm font-bold">
                        2
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        Seus dados
                      </h2>
                    </div>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                          placeholder="Seu nome"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          Quanto pretende investir? *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.investment}
                          onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors"
                          placeholder="Ex: R$ 1.000"
                        />
                        <p className="mt-2 text-xs text-[#6b6b80]">
                          Projetos a partir de R$ 1.000. Me diz sua faixa que eu monto a melhor
                          solução pra ela.
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-[#9999ab] mb-2">
                          Conte sobre seu projeto{" "}
                          <span className="text-[#6b6b80] font-normal">(opcional)</span>
                        </label>
                        <textarea
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] text-white placeholder-[#6b6b80] focus:outline-none focus:border-[#00f0ff]/50 transition-colors resize-none"
                          placeholder="Ideia, funcionalidades, referências de sites que você curte, público-alvo..."
                        />
                      </div>
                    </div>
                  </Reveal>

                  {/* Submit */}
                  <Reveal delay={0.2}>
                    <div className="mt-10">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-black bg-[#00ff41] hover:shadow-[0_0_40px_rgba(0,255,65,0.4)] transition-all duration-300"
                      >
                        <Send className="w-5 h-5" />
                        Receber meu orçamento no WhatsApp
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>

                      <p className="text-sm text-[#6b6b80] mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[#00ff41]">✓</span> Resposta em até 24h
                        <span className="text-[#1e1e2e]">•</span>
                        <span className="text-[#00ff41]">✓</span> Sem compromisso
                        <span className="text-[#1e1e2e]">•</span>
                        <span className="text-[#00ff41]">✓</span> Você fala direto comigo
                      </p>
                    </div>
                  </Reveal>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00ff41]/10 border border-[#00ff41]/20 mx-auto mb-8"
                >
                  <BadgeCheck className="w-10 h-10 text-[#00ff41]" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  Quase lá! 🚀
                </h2>
                <p className="text-[#6b6b80] mb-8">
                  Abri o WhatsApp com seu pedido pronto — é só apertar enviar.
                  Se não abriu automaticamente, toque no botão abaixo.
                </p>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black bg-[#00ff41] hover:shadow-[0_0_40px_rgba(0,255,65,0.4)] transition-all mb-6"
                >
                  <Zap className="w-5 h-5" />
                  Abrir o WhatsApp
                </a>

                <div>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/10 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao Portfólio
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Tech Showcase */}
      <section className="relative z-10 py-20 border-t border-[#1e1e2e]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Tecnologias que uso no seu projeto
              </h2>
              <p className="text-[#6b6b80] max-w-2xl mx-auto">
                Stack moderna e comprovada para garantir performance,
                segurança e escalabilidade
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techShowcase.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold mb-4"
                    style={{
                      background: `${tech.color}15`,
                      border: `1px solid ${tech.color}25`,
                      color: tech.color,
                    }}
                  >
                    {tech.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{tech.name}</h3>
                  <p className="text-sm text-[#6b6b80] leading-relaxed">{tech.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 border-t border-[#1e1e2e]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/20 mb-6">
              <Star className="w-3 h-3 text-[#00ff41]" />
              <span className="text-xs font-mono text-[#00ff41]">100% de clientes satisfeitos</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Prefere conversar diretamente?
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-[#6b6b80] mb-8">
              Sem problema! Me chama no WhatsApp que responderei rapidamente.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Olá Emmanuel! Vi seu portfólio e quero conversar sobre um projeto."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black bg-[#00ff41] hover:shadow-[0_0_40px_rgba(0,255,65,0.4)] transition-all"
            >
              <Zap className="w-5 h-5" />
              Chamar no WhatsApp
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
