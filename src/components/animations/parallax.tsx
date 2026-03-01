// ══════════════════════════════════════════════════════════════════════════════
// 🌊 Componente: Parallax — Efeito parallax suave com scroll
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  animate,
} from "framer-motion";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // -1 a 1 (negativo = inverso)
  className?: string;
}

export function Parallax({ children, speed = 0.3, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -200]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Parallax com Opacidade ───────────────────────────────────────────────────

interface ParallaxFadeProps {
  children: React.ReactNode;
  className?: string;
}

export function ParallaxFade({ children, className }: ParallaxFadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Counter animado (para KPIs) ──────────────────────────────────────────────

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const count = useMotionValue(from);
  const rounded = useTransform(count, (value: number) =>
    `${prefix}${value.toFixed(decimals)}${suffix}`
  );

  if (isInView) {
    animate(count, to, { duration, ease: "easeOut" });
  }

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
