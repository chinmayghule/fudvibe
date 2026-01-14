"use client";

import { Utensils } from "lucide-react";
import { BusinessSettings } from "@/lib/db";

interface LoadingScreenProps {
  settings: BusinessSettings | null;
}

export function LoadingScreen({ settings }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center transition-colors">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
        <div className="relative h-24 w-24 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-primary/10 overflow-hidden">
           {settings?.businessIcon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.businessIcon} alt="Logo" className="h-full w-full object-cover animate-pulse" />
           ) : (
              <Utensils className="h-10 w-10 text-primary animate-bounce" />
           )}
        </div>
      </div>
      <h2 className="text-xl font-black text-gray-800 tracking-tight animate-pulse">
         {settings?.businessName || "Restaurant Menu"}
      </h2>
      <p className="text-sm text-gray-400 font-medium mt-1">Preparing your delicious experience...</p>
    </div>
  );
}
