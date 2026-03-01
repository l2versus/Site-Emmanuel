// ══════════════════════════════════════════════════════════════════════════════
// 🎬 Componente: HeroCrossfade — Background com crossfade entre imagens/vídeos
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HeroCrossfadeProps {
  images: string[];
  interval?: number; // ms entre transições
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
}

export function HeroCrossfade({
  images,
  interval = 5000,
  overlayOpacity = 0.6,
  children,
  className,
}: HeroCrossfadeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background images com crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt=""
            fill
            className="object-cover"
            priority={currentIndex === 0}
            quality={90}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay escuro com gradiente */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(to bottom, rgba(13,13,15,${overlayOpacity}) 0%, rgba(13,13,15,0.4) 50%, rgba(13,13,15,${overlayOpacity + 0.2}) 100%)`,
        }}
      />

      {/* Gradiente brand no bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-dark-950 to-transparent" />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
