"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}

export function AccordionItem({ title, children, defaultOpen = true, count }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border rounded-xl shadow-sm overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800">{title}</span>
          {count !== undefined && (
            <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <ChevronDown 
          className={cn("h-5 w-5 text-gray-500 transition-transform duration-300", isOpen && "rotate-180")} 
        />
      </button>
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 border-t bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
