"use client";

import {
  createContext, useContext, useEffect,
  useState, useCallback, useRef
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  loadCartFromDB,
  upsertCartItemInDB,
  updateCartQuantityInDB,
  removeCartItemFromDB,
  clearCartInDB,
  mergeGuestCartIntoDB,
} from "@/lib/cart";

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  price: number;
  image?: string;
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
  mergeGuestCart: () => Promise<void>;
};

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "truemart_cart";

function itemKey(productId: string, variantId?: string) {
  return `${productId}__${variantId ?? "default"}`;
}

function readLocalCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function writeLocalCart(items: CartItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

function clearLocalCart() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

// ── PROVIDER ──────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems]       = useState<CartItem[]>([]);
  const [isOpen, setIsOpen]     = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const userIdRef               = useRef<string | null>(null);
  const supabase                = createClient();

  // ── On mount: detect auth, load correct source ────────────────────────────
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        userIdRef.current = user.id;
        const dbItems = await loadCartFromDB(supabase, user.id);
        setItems(dbItems);
      } else {
        userIdRef.current = null;
        setItems(readLocalCart());
      }
      setHydrated(true);
    }

    init();

    // Listen for login / logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        userIdRef.current = session.user.id;
        const dbItems = await loadCartFromDB(supabase, session.user.id);
        setItems(dbItems);
      }
      if (event === "SIGNED_OUT") {
        userIdRef.current = null;
        clearLocalCart();
        setItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Persist guest cart to localStorage only (not for logged-in users) ─────
  useEffect(() => {
    if (!hydrated || userIdRef.current) return;
    writeLocalCart(items);
  }, [items, hydrated]);

  // ── Add item (optimistic) ─────────────────────────────────────────────────
  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    const userId = userIdRef.current;
    const key    = itemKey(newItem.productId, newItem.variantId);

    setItems(prev => {
      const exists = prev.find(i => itemKey(i.productId, i.variantId) === key);
      return exists
        ? prev.map(i => itemKey(i.productId, i.variantId) === key
            ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...newItem, quantity: 1 }];
    });

    // Background DB write for logged-in users
    if (userId) {
      upsertCartItemInDB(supabase, userId, { ...newItem, quantity: 1 })
        .catch(console.error);
    }

    setIsOpen(true);
  }, []);

  // ── Remove item (optimistic) ──────────────────────────────────────────────
  const removeItem = useCallback((productId: string, variantId?: string) => {
    const userId = userIdRef.current;
    const key    = itemKey(productId, variantId);

    setItems(prev => prev.filter(i => itemKey(i.productId, i.variantId) !== key));

    if (userId) {
      removeCartItemFromDB(supabase, userId, productId, variantId)
        .catch(console.error);
    }
  }, []);

  // ── Update quantity (optimistic) ──────────────────────────────────────────
  const updateQuantity = useCallback((
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => {
    const userId = userIdRef.current;
    const key    = itemKey(productId, variantId);

    setItems(prev =>
      quantity <= 0
        ? prev.filter(i => itemKey(i.productId, i.variantId) !== key)
        : prev.map(i => itemKey(i.productId, i.variantId) === key ? { ...i, quantity } : i)
    );

    if (userId) {
      updateCartQuantityInDB(supabase, userId, productId, variantId, quantity)
        .catch(console.error);
    }
  }, []);

  // ── Clear cart ────────────────────────────────────────────────────────────
  const clearCart = useCallback(() => {
    const userId = userIdRef.current;
    setItems([]);
    if (userId) {
      clearCartInDB(supabase, userId).catch(console.error);
    } else {
      clearLocalCart();
    }
  }, []);

  // ── Merge guest cart on login ─────────────────────────────────────────────
  // Call this right after signInWithPassword succeeds in login page
  const mergeGuestCart = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const guestItems = readLocalCart();
    userIdRef.current = user.id;

    const mergedItems = await mergeGuestCartIntoDB(supabase, user.id, guestItems);
    setItems(mergedItems);
    clearLocalCart();
  }, []);

  const openCart  = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, totalItems, subtotal,
      addItem, removeItem, updateQuantity, clearCart,
      isOpen, openCart, closeCart,
      mergeGuestCart,
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
