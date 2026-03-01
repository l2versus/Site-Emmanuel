// ══════════════════════════════════════════════════════════════════════════════
// 📝 Componente: Input — Campo de texto premium com máscara e validação
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, iconRight, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dark-200"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl border bg-dark-900/50 px-4 py-3 text-sm text-white",
              "placeholder:text-dark-500",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
              "hover:border-dark-500",
              error
                ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                : "border-dark-700",
              icon && "pl-10",
              iconRight && "pr-10",
              className
            )}
            {...props}
          />

          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
              {iconRight}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-dark-500 mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
