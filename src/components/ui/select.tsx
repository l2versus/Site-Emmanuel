// ══════════════════════════════════════════════════════════════════════════════
// 📋 Componente: Select — Select premium com Radix UI
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  className?: string;
}

export function Select({
  label,
  placeholder = "Selecione...",
  options,
  value,
  onValueChange,
  error,
  className,
}: SelectProps) {
  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-dark-200">
          {label}
        </label>
      )}

      <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger
          className={cn(
            "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm",
            "bg-dark-900/50 text-white",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
            "hover:border-dark-500",
            "data-[placeholder]:text-dark-500",
            error
              ? "border-red-500 focus:ring-red-500/50"
              : "border-dark-700"
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-dark-400" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-50 overflow-hidden rounded-xl border border-dark-700 bg-dark-900 shadow-premium"
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-dark-200",
                    "cursor-pointer select-none outline-none",
                    "data-[highlighted]:bg-dark-800 data-[highlighted]:text-white",
                    "data-[state=checked]:text-brand-400"
                  )}
                >
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4 text-brand-500" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
