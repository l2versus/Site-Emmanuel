// ══════════════════════════════════════════════════════════════════════════════
// 🏷️ Componente: Badge — Status badge com cores dinâmicas
// ══════════════════════════════════════════════════════════════════════════════

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "gold";
  size?: "sm" | "md";
  pulse?: boolean;
  className?: string;
}

const variantClasses = {
  default: "bg-dark-700 text-dark-200 border-dark-600",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  gold: "bg-gold-500/10 text-gold-400 border-gold-500/20",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  pulse = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantClasses[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              variant === "success" && "bg-emerald-400",
              variant === "warning" && "bg-yellow-400",
              variant === "danger" && "bg-red-400",
              variant === "info" && "bg-blue-400"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              variant === "success" && "bg-emerald-500",
              variant === "warning" && "bg-yellow-500",
              variant === "danger" && "bg-red-500",
              variant === "info" && "bg-blue-500"
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
