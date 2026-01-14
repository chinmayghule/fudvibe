"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  className,
  disabled = false,
}: SelectProps) {
  const selectedLabel = options.find(o => o.value === value)?.label;

  return (
    <BaseSelect.Root
      value={value}
      onValueChange={(val) => onValueChange(val ?? "")}
      disabled={disabled}
    >
      <BaseSelect.Trigger
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-gray-50",
          className
        )}
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {selectedLabel || placeholder}
        </span>
        <BaseSelect.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="z-50" sideOffset={8}>
          <BaseSelect.Popup
            className="w-[var(--anchor-width)] max-h-[300px] overflow-y-auto rounded-xl border bg-white/95 backdrop-blur-sm p-1 text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 duration-200"
          >
            <BaseSelect.List className="outline-none space-y-0.5">
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-3 pr-9 text-sm outline-none hover:bg-primary/5 focus:bg-primary/5 data-[highlighted]:bg-primary/5 data-[selected]:font-bold data-[selected]:text-primary transition-colors"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
