"use client";

import React, { useState } from "react";
import { MenuItem, BusinessSettings } from "@/lib/db";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Search, ImageOff, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { toast } from "sonner";

interface MenuItemCardProps {
  item: MenuItem;
  settings: BusinessSettings | null;
  cartItem: { id: string; quantity: number } | undefined;
  addItem: (item: MenuItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  onImageClick: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  settings,
  cartItem,
  addItem,
  updateQuantity,
  onImageClick,
}: MenuItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = item.description || "";
  const isLong = description.length > 100;
  const displayText = isExpanded ? description : description.slice(0, 100);

  return (
    <div className="group relative flex items-start gap-4 p-4 transition-all hover:bg-white sm:p-5 border-b border-gray-100 last:border-none">
      <div className="flex-1 min-w-0">
        {/* Item Type (Veg/Non-Veg) */}
        <div className="flex items-center gap-2 mb-2">
          <div className={cn(
            "w-4 h-4 border-2 flex items-center justify-center p-0.5",
            item.type === "non-veg" ? "border-red-600" : "border-green-600"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              item.type === "non-veg" ? "bg-red-600" : "bg-green-600"
            )} />
          </div>
          <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
            {item.type === "non-veg" ? "Non-Veg" : "Veg"}
          </span>
        </div>

        {/* Name and Price */}
        <h3 className="text-lg font-extrabold text-gray-900 leading-tight mb-1">{item.name}</h3>
        <div className="text-md font-bold text-gray-600 mb-3">
          {formatCurrency(item.price)}
        </div>

        {/* Description */}
        {description && (
          <div 
            className="text-sm text-gray-500 leading-relaxed max-w-lg cursor-pointer select-none"
            onClick={() => isLong && setIsExpanded(!isExpanded)}
          >
            {displayText}
            {isLong && !isExpanded && (
              <span className="text-gray-900 font-bold ml-1 hover:underline">...more</span>
            )}
            {isLong && isExpanded && (
              <span className="text-gray-900 font-bold ml-1 hover:underline italic"> (less)</span>
            )}
          </div>
        )}

        {/* Action Button (Conditional based on viewport/image existence, but for now mt-4) */}
        <div className="mt-4">
          {!settings?.businessOpen ? (
            <Button disabled className="h-9 px-6 rounded-lg uppercase text-[11px] font-black tracking-widest bg-gray-100 text-gray-400">
              Closed
            </Button>
          ) : !settings?.acceptingOrders ? (
            <Button disabled className="h-9 px-6 rounded-lg uppercase text-[11px] font-black tracking-widest bg-gray-100 text-gray-400">
              Orders Off
            </Button>
          ) : !item.available ? (
            <Button disabled className="h-9 px-6 rounded-lg uppercase text-[11px] font-black tracking-widest bg-gray-100 text-gray-400">
              Out of Stock
            </Button>
          ) : cartItem ? (
            <div className="flex items-center justify-between w-28 bg-white border-2 border-primary text-primary rounded-xl h-10 overflow-hidden shadow-sm">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-full w-9 text-primary hover:bg-primary/10 rounded-none border-r border-primary/20"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(item.id, cartItem.quantity - 1);
                }}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="font-black text-sm">{cartItem.quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-full w-9 text-primary hover:bg-primary/10 rounded-none border-l border-primary/20"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(item.id, cartItem.quantity + 1);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button 
              className="w-28 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-tight shadow-md transition-all rounded-xl text-[12px] border-none active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                addItem(item);
                toast.success(`${item.name} added to cart`);
              }}
            >
              Add <Plus className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Image */}
      {item.imageUrls && item.imageUrls.length > 0 && (
        <div className="relative w-32 h-32 m-1 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.imageUrls[0]} 
            alt={item.name} 
            className="w-full h-full object-cover rounded-2xl shadow-sm border border-gray-100 cursor-zoom-in group-hover:shadow-md transition-shadow"
            onClick={() => onImageClick(item)}
          />
        </div>
      )}
    </div>
  );
}
