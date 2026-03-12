"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  variantLabel?: string;   // e.g. "Hindi", "English"
  price: number;
  image?: string;          // Cloudinary public ID or full URL
  slug: string;
  deliveryIncluded: boolean;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

// ── CONTEXT ───────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "truemart_cart";

function itemKey(productId: string, variantId?: string) {
  return `${productId}__${variantId ?? "default"}`;
}

// ── PROVIDER ──────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems(prev => {
      const key = itemKey(newItem.productId, newItem.variantId);
      const exists = prev.find(i => itemKey(i.productId, i.variantId) === key);
      if (exists) {
        return prev.map(i =>
          itemKey(i.productId, i.variantId) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    const key = itemKey(productId, variantId);
    setItems(prev => prev.filter(i => itemKey(i.productId, i.variantId) !== key));
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string | undefined, quantity: number) => {
    const key = itemKey(productId, variantId);
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => itemKey(i.productId, i.variantId) !== key));
    } else {
      setItems(prev =>
        prev.map(i =>
          itemKey(i.productId, i.variantId) === key ? { ...i, quantity } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart  = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, totalItems, subtotal,
      addItem, removeItem, updateQuantity, clearCart,
      isOpen, openCart, closeCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// ── HOOK ──────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
