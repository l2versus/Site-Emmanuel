// ══════════════════════════════════════════════════════════════════════════════
// 🪟 Componente: Modal — Dialog premium com glassmorphism
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = "md",
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay com blur */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />

        {/* Conteúdo */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-dark-700/50",
            "bg-dark-900/95 backdrop-blur-xl",
            "shadow-premium",
            "p-6",
            "data-[state=open]:animate-scale-in",
            "focus:outline-none",
            sizeClasses[size],
            className
          )}
        >
          {/* Header */}
          {(title || description) && (
            <div className="mb-6">
              {title && (
                <Dialog.Title className="text-lg font-semibold text-white">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-1 text-sm text-dark-400">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}

          {/* Body */}
          {children}

          {/* Close Button */}
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-lg p-1.5 text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
