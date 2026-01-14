"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { MenuItem } from "@/lib/db";

export type CartItem = MenuItem & {
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  // Order metadata
  orderType: 'pickup' | 'delivery';
  setOrderType: (type: 'pickup' | 'delivery') => void;
  specialInstructions: string;
  setSpecialInstructions: (val: string) => void;
  cookingInstructions: string;
  setCookingInstructions: (val: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (val: string) => void;
  customerName: string;
  setCustomerName: (val: string) => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  count: 0,
  orderType: 'pickup',
  setOrderType: () => {},
  specialInstructions: "",
  setSpecialInstructions: () => {},
  cookingInstructions: "",
  setCookingInstructions: () => {},
  deliveryAddress: "",
  setDeliveryAddress: () => {},
  customerName: "",
  setCustomerName: () => {},
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [cookingInstructions, setCookingInstructions] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Load state from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (parsed.items) setItems(parsed.items);
        if (parsed.orderType) setOrderType(parsed.orderType);
        if (parsed.specialInstructions) setSpecialInstructions(parsed.specialInstructions);
        if (parsed.cookingInstructions) setCookingInstructions(parsed.cookingInstructions);
        if (parsed.deliveryAddress) setDeliveryAddress(parsed.deliveryAddress);
        if (parsed.customerName) setCustomerName(parsed.customerName);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const stateToSave = {
      items,
      orderType,
      specialInstructions,
      cookingInstructions,
      deliveryAddress,
      customerName
    };
    localStorage.setItem("cart", JSON.stringify(stateToSave));
  }, [items, orderType, specialInstructions, cookingInstructions, deliveryAddress]);

  const addItem = (item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setSpecialInstructions("");
    setCookingInstructions("");
  };

  // Clear instructions if cart becomes empty
  useEffect(() => {
    if (items.length === 0) {
      setSpecialInstructions("");
      setCookingInstructions("");
    }
  }, [items.length]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, addItem, removeItem, updateQuantity, clearCart, total, count,
        orderType, setOrderType,
        specialInstructions, setSpecialInstructions,
        cookingInstructions, setCookingInstructions,
        deliveryAddress, setDeliveryAddress,
        customerName, setCustomerName
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
