"use client";

import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone, MessageSquare, MapPin, Clock, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ContactPage() {
  const { settings, loading } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (settings?.businessName) {
      document.title = `${settings.businessName}: Contact`;
    }
  }, [settings]);

  const handleCall = () => {
    if (settings?.whatsappNumber) {
      window.location.href = `tel:${settings.whatsappNumber.replace(/\D/g, "")}`;
    }
  };

  const handleWhatsApp = () => {
    if (settings?.whatsappNumber) {
      const cleanNumber = settings.whatsappNumber.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanNumber}`, "_blank");
    }
  };

  if (loading) {
     return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-white">
         {settings?.businessIcon ? (
           // eslint-disable-next-line @next/next/no-img-element
           <img src={settings.businessIcon} alt="Logo" className="h-16 w-16 rounded-full object-cover animate-pulse mb-4" />
         ) : (
           <Phone className="h-12 w-12 animate-bounce text-primary mb-4" />
         )}
         <p className="text-sm font-bold text-gray-400 animate-pulse">Connecting...</p>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white border-b h-16 flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Contact Us</h1>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold">Get in Touch</h2>
          <p className="text-muted-foreground mt-2">We'd love to hear from you!</p>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full h-16 text-lg font-semibold justify-start px-6 bg-white hover:bg-gray-50 text-black border shadow-sm transition-all"
            onClick={handleCall}
          >
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
              <Phone className="h-5 w-5 text-blue-500" />
            </div>
            <span>Call Us Now</span>
          </Button>

          <Button 
            className="w-full h-16 text-lg font-semibold justify-start px-6 bg-white hover:bg-gray-50 text-black border shadow-sm transition-all"
            onClick={handleWhatsApp}
          >
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-4">
              <MessageSquare className="h-5 w-5 text-green-500" />
            </div>
            <span>Chat on WhatsApp</span>
          </Button>

          <Card className="mt-8 border-none bg-gray-50 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Our Location</h4>
                  <p className="text-sm text-muted-foreground italic">
                    {settings?.location || "Visit us at our restaurant"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Business Hours</h4>
                  <div className="text-sm mt-1 space-y-2">
                    <p className="flex justify-between">
                      <span className={settings?.businessOpen ? "text-green-600 font-medium font-bold" : "text-red-500 font-medium font-bold"}>
                        Currently: {settings?.businessOpen ? "OPEN" : "CLOSED"}
                      </span>
                    </p>
                    <div className="space-y-1">
                      {settings?.openingHours ? (
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {settings.openingHours}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">Mon - Sun: 10:00 AM - 11:00 PM</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
