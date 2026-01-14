"use client";

import React from "react";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2">
        <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
          Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by <span className="text-gray-900 font-bold">Chinmay Ghule</span>
        </p>
        <p className="text-[10px] uppercase tracking-widest text-gray-300 font-black">
          Project Fud &bull; 2026
        </p>
      </div>
    </footer>
  );
}
