"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8 text-center bg-gray-50 rounded-lg m-4">
        <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
      <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="text-gray-600 max-w-md">
        We encountered an unexpected error. Please try again later or contact support if the issue persists.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="danger" onClick={() => window.location.reload()}>
            Reload Page
        </Button>
      </div>
    </div>
  );
}
