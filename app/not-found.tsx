import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-gray-50 text-center p-4">
        <div className="bg-gray-200 p-4 rounded-full">
            <FileQuestion className="h-10 w-10 text-gray-500" />
        </div>
      <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
      <p className="text-gray-600">Could not find the requested resource.</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
