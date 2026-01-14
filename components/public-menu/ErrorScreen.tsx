"use client";

import { Button } from "@/components/ui/button";

interface ErrorScreenProps {
  onRetry: () => void;
}

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center transition-colors">
      <h1 className="text-2xl font-bold mb-2 text-primary">Unable to load menu</h1>
      <p className="text-gray-600 mb-4">We encountered a problem loading the menu. Please try again.</p>
      <Button onClick={onRetry} className="bg-primary hover:bg-primary/90 rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20">Retry</Button>
    </div>
  );
}
