import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label 
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-black" : "bg-gray-200",
          className
        )}
        data-state={checked ? "checked" : "unchecked"}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          ref={ref}
          {...props}
        />
        <span 
          data-state={checked ? "checked" : "unchecked"}
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1"
          )}
        />
      </label>
    );
  }
);
Switch.displayName = "Switch";
