"use client";

import { Button } from "@/components/ui/button";

interface ErrorScreenProps {
  onRetry: () => void;
}

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center">
      <h1 className="text-2xl font-bold mb-2 text-red-600">Unable to load menu</h1>
      <p className="text-gray-600 mb-4">We encountered a problem loading the menu. Please try again.</p>
      <Button onClick={onRetry} className="bg-[#E23744] hover:bg-[#c12f3a]">Retry</Button>
    </div>
  );
}
