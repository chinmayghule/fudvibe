"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message: string;
  className?: string;
  disabled?: boolean;
}

export function WhatsAppButton({ phoneNumber, message, className, disabled }: WhatsAppButtonProps) {
  const [showFallback, setShowFallback] = useState(false);

  // Clean phone number: remove non-numeric chars except +
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");

  const handleOrder = () => {
    // Try api.whatsapp.com
    const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(message)}`;
    
    // We can't really detect if it failed easily in a web app due to custom protocol handlers
    // But we can set a timeout to show fallback if the user is still here?
    // A better UX for "fallback" might be to just try opening it, and if they come back or nothing happens, 
    // they can click a "Help, it didn't open" button.
    
    // For this requirements: "WhatsApp button must have fallback options when redirect fails."
    // We will open the URL, but also show a dialog with the number and message so they can copy-paste if needed.
    
    window.open(url, '_blank');
    
    // Show fallback dialog after a short delay or immediately
    setTimeout(() => {
      setShowFallback(true);
    }, 1000);
  };

  return (
    <>
      <Button 
        onClick={handleOrder} 
        disabled={disabled || !phoneNumber}
        className={`bg-[#25D366] hover:bg-[#128C7E] text-white ${className}`}
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Order on WhatsApp
      </Button>

      <Dialog open={showFallback} onOpenChange={setShowFallback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Did WhatsApp open?</DialogTitle>
            <DialogDescription>
              If the app didn&apos;t open automatically, you can send the message manually.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">1. Save this number:</label>
              <div className="p-2 bg-gray-100 rounded select-all font-mono">
                {phoneNumber}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">2. Send this message:</label>
              <div className="p-2 bg-gray-100 rounded select-all font-mono text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">
                {message}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowFallback(false)}>
              Close
            </Button>
            <Button onClick={() => window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')}>
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
