"use client";

import { ShoppingCart, PhoneCall, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessSettings } from "@/lib/db";
import { useRouter } from "next/navigation";

interface MenuHeaderProps {
  settings: BusinessSettings | null;
  cartCount: number;
}

export function MenuHeader({ settings, cartCount }: MenuHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center justify-between flex-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center shrink-0">
              {settings?.businessIcon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.businessIcon} alt="" className="h-full w-full object-cover" />
              ) : (
                <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1C1C1C] leading-tight tracking-tight">
                {settings?.businessName || "Restaurant Menu"}
              </h1>
              <p className="text-[10px] uppercase font-bold text-primary tracking-widest leading-none mt-0.5">Menu</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/contact")}
              className="text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <PhoneCall className="h-5 w-5" />
            </Button>
            <Button 
              className="relative bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full px-4 h-10 shadow-sm" 
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-5 w-5 text-[#E23744]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E23744] text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/contact")}
              className="text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <PhoneCall className="h-5 w-5" />
            </Button>
            <Button 
              className="relative bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full px-4 h-10 shadow-sm" 
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-5 w-5 mr-2 text-[#E23744]" />
              <span className="font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E23744] text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border transition-colors ${
            settings?.businessOpen 
              ? "bg-green-50 text-green-700 border-green-200" 
              : "bg-red-50 text-red-700 border-red-200"
          }`}>
            <div className={`h-2 w-2 rounded-full ${settings?.businessOpen ? "bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.5)]" : "bg-red-600"}`} />
            Business: {settings?.businessOpen ? "OPEN" : "CLOSED"}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border transition-colors ${
            settings?.acceptingOrders 
              ? "bg-blue-50 text-blue-700 border-blue-200" 
              : "bg-orange-50 text-orange-700 border-orange-200"
          }`}>
            <div className={`h-2 w-2 rounded-full ${settings?.acceptingOrders ? "bg-blue-600 animate-pulse" : "bg-orange-600"}`} />
            Online Orders: {settings?.acceptingOrders ? "YES" : "NO"}
          </div>
        </div>
      </div>
    </header>
  );
}
