"use client";

import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Minus, Plus, ShoppingBag, MessageSquare, Phone, MapPin, ClipboardList, UtensilsCrossed, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { 
    items, updateQuantity, total, count, clearCart,
    orderType, setOrderType,
    specialInstructions, setSpecialInstructions,
    cookingInstructions, setCookingInstructions,
    deliveryAddress, setDeliveryAddress
  } = useCart();
  const router = useRouter();
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (settings?.businessName) {
      document.title = `${settings.businessName}: Cart`;
    }
  }, [settings]);

  const handleCallOrder = () => {
    if (settings?.whatsappNumber) {
      window.location.href = `tel:${settings.whatsappNumber.replace(/\D/g, "")}`;
    }
  };

  const handleWhatsAppOrder = () => {
    if (!settings?.whatsappNumber) {
      toast.error("Business WhatsApp number not configured");
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      toast.error("Please provide a delivery address");
      return;
    }

    // Generate WhatsApp text without pricing
    let message = `*NEW ORDER REQUEST*\n`;
    message += `Type: ${orderType.toUpperCase()}\n`;
    message += `Date: ${new Date().toLocaleString()}\n\n`;
    
    message += `*ITEMS*\n`;
    items.forEach(item => {
      message += `• ${item.name} x${item.quantity}\n`;
    });

    if (cookingInstructions.trim()) {
      message += `\n*COOKING INSTRUCTIONS*\n${cookingInstructions}\n`;
    }

    if (specialInstructions.trim()) {
      message += `\n*SPECIAL INSTRUCTIONS*\n${specialInstructions}\n`;
    }

    if (orderType === 'delivery') {
      message += `\n*DELIVERY ADDRESS*\n${deliveryAddress}\n`;
    }

    message += `\n_This is a request formulated via the digital menu._`;

    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = settings.whatsappNumber.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    toast.success("Order details sent to WhatsApp!");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        {settings?.businessIcon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.businessIcon} alt="Logo" className="h-16 w-16 rounded-full object-cover animate-pulse mb-4" />
        ) : (
          <ShoppingBag className="h-12 w-12 animate-bounce text-primary mb-4" />
        )}
        <p className="text-sm font-bold text-gray-400 animate-pulse">Loading items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Browse our menu and add some delicious items!</p>
        <Button onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm h-16 flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Your Cart</h1>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Pricing Disclaimer */}
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 shadow-sm">
          <div className="shrink-0 pt-0.5 font-bold">ℹ️</div>
          <div>
            <p className="text-sm font-bold">Price Formulation Only</p>
            <p className="text-xs opacity-90">
              The prices shown here are for your personal calculation. Final pricing will be confirmed by the restaurant when you place your order via Call or WhatsApp.
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-none overflow-hidden mb-8">
          <CardHeader className="bg-primary text-primary-foreground p-6">
            <CardTitle className="flex justify-between items-center">
              <span>Selected Items</span>
              <span className="text-sm font-normal opacity-80">{count} items</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4 sm:gap-0">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:ml-4">
                    <div className="flex items-center bg-gray-100 rounded-full p-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right w-24">
                      <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 border-t">
              <div className="flex justify-between items-center font-black text-2xl">
                <span className="text-gray-500 text-lg">Estimated Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Form */}
        <Card className="shadow-lg border-none overflow-hidden mb-8">
          <CardHeader className="p-6 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Order Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Order Type */}
            <div className="space-y-3">
              <Label className="text-base font-bold">Delivery or Pickup?</Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setOrderType('pickup')}
                  className={`py-2 text-sm font-bold rounded-md transition-all ${
                    orderType === 'pickup' 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pickup
                </button>
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`py-2 text-sm font-bold rounded-md transition-all ${
                    orderType === 'delivery' 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Delivery
                </button>
              </div>
            </div>

            {/* Cooking Instructions */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold">
                <UtensilsCrossed className="h-4 w-4 text-gray-400" />
                Cooking Instructions
              </Label>
              <textarea
                placeholder="e.g. Less spicy, well cooked..."
                className="w-full min-h-[80px] rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                value={cookingInstructions}
                onChange={(e) => setCookingInstructions(e.target.value)}
              />
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                Special Instructions
              </Label>
              <textarea
                placeholder="e.g. Don't ring the bell, leave at gate..."
                className="w-full min-h-[80px] rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label className="flex items-center gap-2 font-bold">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Delivery Address
                </Label>
                <textarea
                  placeholder="Enter your complete address..."
                  className="w-full min-h-[100px] rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
                <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2 text-amber-800 animate-in fade-in zoom-in-95 duration-200">
                  <div className="shrink-0 text-sm">⚠️</div>
                  <p className="text-[11px] leading-tight font-medium">
                    Note: A small delivery charge may apply based on your distance. This will be negotiated during order confirmation.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            variant="secondary"
            className="h-16 text-lg font-bold border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl"
            onClick={handleCallOrder}
            disabled={!settings?.acceptingOrders || !settings?.businessOpen}
          >
            <Phone className="mr-2 h-6 w-6" />
            Call to Order
          </Button>
          <Button 
            className="h-16 text-lg font-bold shadow-xl shadow-primary/20 rounded-2xl"
            onClick={handleWhatsAppOrder}
            disabled={!settings?.acceptingOrders || !settings?.businessOpen}
          >
            <MessageSquare className="mr-2 h-6 w-6" />
            Order on WhatsApp
          </Button>
        </div>

        {(!settings?.acceptingOrders || !settings?.businessOpen) && (
          <p className="text-center text-sm text-red-500 font-bold mt-6 bg-red-50 py-3 rounded-xl border border-red-100 italic">
            Note: The restaurant is currently {!settings?.businessOpen ? "closed" : "not accepting new orders"}.
          </p>
        )}
      </main>
    </div>
  );
}
