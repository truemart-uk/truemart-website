"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";

type WishlistItem = {
  id: string;
  product_id: string;
  created_at: string;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price: number | null;
    images: string[];
    badge: string | null;
    delivery_included: boolean;
    stock_qty: number;
    track_stock: boolean;
  };
};

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();
  const { toggleWishlist } = useWishlist();
  const supabaseRef = useRef(createClient());

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      const { data } = await supabaseRef.current
        .from("wishlists")
        .select(`
          id, product_id, created_at,
          products(id, name, slug, price, compare_at_price, images, badge, delivery_included, stock_qty, track_stock)
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      setItems((data as unknown as WishlistItem[]) ?? []);
      setLoading(false);
    }
    load();
  }, [user]);

  async function handleRemove(wishlistId: string, productId: string) {
    setRemoving(productId);
    await toggleWishlist(productId); // updates context + DB
    setItems(prev => prev.filter(i => i.id !== wishlistId));
    setRemoving(null);
  }

  function handleAddToCart(item: WishlistItem) {
    const p = item.products;
    addItem({
      productId: p.id, name: p.name,
      price: Number(p.price), image: p.images?.[0],
      slug: p.slug, deliveryIncluded: p.delivery_included,
    });
    setAddedIds(prev => new Set([...prev, p.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(p.id); return n; }), 2500);
  }

  if (authLoading || (!user && !authLoading)) {
    if (!authLoading && !user) {
      return (
        <div className="bg-background min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">🤍</p>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Sign in to view your wishlist</h1>
            <Link href="/account/login?redirect=/account/wishlist"
              className="bg-brand-orange text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-orange-500 transition">
              Sign in
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-brand-orange" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Wishlist</h1>
            {!loading && (
              <p className="text-sm text-gray-400 mt-0.5">
                {items.length === 0 ? "No items saved" : `${items.length} item${items.length !== 1 ? "s" : ""} saved`}
              </p>
            )}
          </div>
          <Link href="/shop" className="text-sm text-brand-orange font-semibold hover:underline">
            Continue shopping →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="bg-gray-100 aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <p className="text-5xl mb-4">🤍</p>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 mb-6">Save products you love and come back to them later.</p>
            <Link href="/shop"
              className="bg-brand-orange text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-orange-500 transition">
              Browse products
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map(item => {
              const p = item.products;
              const price = Number(p.price);
              const compare = p.compare_at_price ? Number(p.compare_at_price) : null;
              const outOfStock = p.track_stock && p.stock_qty === 0;
              const isAdded = addedIds.has(p.id);

              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">

                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    <Link href={`/products/${p.slug}`}>
                      {p.images?.[0] ? (
                        <img
                          src={`https://res.cloudinary.com/truemart/image/upload/w_300,h_300,c_pad,b_white,f_auto,q_85/${p.images[0]}`}
                          alt={p.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-5xl opacity-20">📦</span>
                      )}
                    </Link>

                    {/* Badge */}
                    {p.badge && (
                      <span className="absolute top-2 left-2 bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(item.id, p.id)}
                      disabled={removing === p.id}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-red-50 transition"
                    >
                      <svg style={{ width: "16px", height: "16px", color: "#EF4444" }}
                        fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight hover:text-brand-orange transition line-clamp-2 mb-1">
                        {p.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base font-extrabold text-gray-900">£{price.toFixed(2)}</span>
                      {compare && (
                        <span className="text-xs text-gray-400 line-through">£{compare.toFixed(2)}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={outOfStock}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                        isAdded ? "bg-green-500 text-white"
                        : outOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-brand-orange hover:bg-orange-500 text-white"
                      }`}
                    >
                      {isAdded ? "✓ Added!" : outOfStock ? "Out of stock" : "Add to cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
