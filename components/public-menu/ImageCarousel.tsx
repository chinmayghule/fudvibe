"use client";

import { XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { MenuItem } from "@/lib/db";

interface ImageCarouselProps {
  item: MenuItem;
  index: number;
  setIndex: (index: number | ((prev: number) => number)) => void;
  onClose: () => void;
}

export function ImageCarousel({ item, index, setIndex, onClose }: ImageCarouselProps) {
  if (!item.imageUrls || item.imageUrls.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-300">
      <button 
        className="absolute top-6 right-6 z-[110] text-white/70 hover:text-white transition-colors"
        onClick={onClose}
      >
        <XCircle className="h-10 w-10" />
      </button>

      {item.imageUrls.length > 1 && (
        <>
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-2 rounded-full"
            onClick={() => setIndex((prev) => (prev === 0 ? item.imageUrls!.length - 1 : prev - 1))}
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-2 rounded-full"
            onClick={() => setIndex((prev) => (prev === item.imageUrls!.length - 1 ? 0 : prev + 1))}
          >
            <ChevronRight className="h-10 w-10" />
          </button>
        </>
      )}

      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full h-auto flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.imageUrls[index]} 
            alt={item.name}
            className="max-h-[80vh] max-w-full object-contain shadow-2xl rounded-lg"
          />
        </div>
        
        <div className="mt-6 text-center text-white space-y-2">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          {item.imageUrls.length > 1 && (
            <p className="text-white/50 font-medium">
              {index + 1} / {item.imageUrls.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
