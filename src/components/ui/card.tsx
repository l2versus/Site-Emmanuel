// ══════════════════════════════════════════════════════════════════════════════
// 📊 Componente: Card — Card premium com glassmorphism e variantes
// ══════════════════════════════════════════════════════════════════════════════

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient" | "bordered";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantClasses = {
  default: "bg-dark-900 border border-dark-700/50",
  glass:
    "bg-dark-900/40 backdrop-blur-xl border border-dark-700/30 shadow-glass",
  gradient:
    "bg-gradient-to-br from-dark-900 to-dark-800 border border-dark-700/50",
  bordered: "bg-dark-900/80 border-2 border-brand-500/20",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  variant = "default",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variantClasses[variant],
        paddingClasses[padding],
        hover &&
          "transition-all duration-300 hover:border-brand-500/30 hover:shadow-glow hover:-translate-y-1 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Card Header ──────────────────────────────────────────────────────────────

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-4", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-dark-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── KPI Card (Para Dashboard Admin) ──────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  className?: string;
}

export function KPICard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
}: KPICardProps) {
  return (
    <Card variant="glass" className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-dark-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1 tracking-tight">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "text-xs mt-2 flex items-center gap-1",
                changeType === "positive" && "text-emerald-400",
                changeType === "negative" && "text-red-400",
                changeType === "neutral" && "text-dark-400"
              )}
            >
              {changeType === "positive" && "↑"}
              {changeType === "negative" && "↓"}
              {change}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          {icon}
        </div>
      </div>

      {/* Glow decorativo */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-500/5 blur-2xl" />
    </Card>
  );
}
