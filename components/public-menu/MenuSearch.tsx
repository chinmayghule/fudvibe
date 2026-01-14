"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MenuSearch({ value, onChange }: MenuSearchProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#E23744] transition-colors" />
      <Input
        placeholder="Search for dishes..."
        className="pl-12 pr-12 h-12 rounded-xl border-gray-200 shadow-sm focus:border-[#E23744] focus:ring-[#E23744] transition-all bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600 rounded-full"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
