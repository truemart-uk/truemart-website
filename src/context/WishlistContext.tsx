"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

type WishlistContextType = {
  wishlistIds: Set<string>;
  totalWishlisted: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    if (!user) { setWishlistIds(new Set()); return; }
    setLoading(true);
    supabaseRef.current
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setWishlistIds(new Set((data ?? []).map((w: { product_id: string }) => w.product_id)));
        setLoading(false);
      });
  }, [user]);

  const isWishlisted = useCallback((productId: string) => {
    return wishlistIds.has(productId);
  }, [wishlistIds]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (!user) { window.location.href = "/account/login"; return; }

    const already = wishlistIds.has(productId);

    // Optimistic update
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (already) next.delete(productId);
      else next.add(productId);
      return next;
    });

    if (already) {
      await supabaseRef.current.from("wishlists").delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
    } else {
      await supabaseRef.current.from("wishlists").insert({
        user_id: user.id,
        product_id: productId,
      });
    }
  }, [user, wishlistIds]);

  return (
    <WishlistContext.Provider value={{
      wishlistIds,
      totalWishlisted: wishlistIds.size,
      isWishlisted,
      toggleWishlist,
      loading,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}