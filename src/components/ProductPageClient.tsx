"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { cloudinaryUrl } from "@/lib/cloudinary";
import ProductCard from "@/components/ProductCard";

type Variant = {
  id: string;
  type: string;
  value: string;
  label: string | null;
  price: number | null;
  compare_at_price: number | null;
  stock_qty: number;
  is_default: boolean;
  display_order: number;
  images: string[] | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  images: string[];
  badge: string | null;
  tags: string[];
  stock_qty: number;
  track_stock: boolean;
  low_stock_threshold: number;
  rating: number | null;
  review_count: number | null;
  delivery_included: boolean;
  category_name: string;
  category_slug: string;
  variants: Variant[];
};

type Review = {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  created_at: string;
  profiles: { full_name: string } | null;
};

// ── STARS ─────────────────────────────────────────────────────────────────────

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const px = size === "lg" ? 24 : size === "md" ? 20 : 16;
  return (
    <div style={{ display: "flex" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i}
          style={{ width: px, height: px, color: i <= Math.round(rating) ? "#FB923C" : "#D1D5DB" }}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── IMAGE GALLERY ─────────────────────────────────────────────────────────────

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const all = images.length > 0 ? images : [""];

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>

      {/* Vertical thumbnail strip — left */}
      {all.length >= 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                width: "64px", height: "64px", borderRadius: "10px",
                border: selected === i ? "2px solid #FB923C" : "2px solid #F3F4F6",
                overflow: "hidden", background: "white", cursor: "pointer",
                flexShrink: 0, padding: "4px",
                boxShadow: selected === i ? "0 2px 8px rgba(251,146,60,0.3)" : "none",
              }}
            >
              {img
                ? <img src={`https://res.cloudinary.com/truemart/image/upload/w_100,h_100,c_pad,b_white,f_auto,q_80/${img}`}
                    alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                : <span style={{ fontSize: "20px" }}>📦</span>
              }
            </button>
          ))}
        </div>
      )}

      {/* Main image — takes remaining width */}
      <div style={{
        flex: 1, height: "480px", background: "white",
        borderRadius: "16px", border: "1px solid #F3F4F6",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {all[selected] ? (
          <img
            src={`https://res.cloudinary.com/truemart/image/upload/w_600,h_600,c_pad,b_white,f_auto,q_85/${all[selected]}`}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "16px" }}
          />
        ) : (
          <span style={{ fontSize: "80px", opacity: 0.2 }}>📦</span>
        )}
      </div>

    </div>
  );
}

// ── STOCK BADGE ───────────────────────────────────────────────────────────────

function StockBadge({ stock, threshold, track }: { stock: number; threshold: number; track: boolean }) {
  if (!track) return <span className="text-sm text-green-600 font-semibold">✅ In stock</span>;
  if (stock === 0) return <span className="text-sm text-red-500 font-semibold">❌ Out of stock</span>;
  if (stock <= threshold) return <span className="text-sm text-amber-500 font-semibold">⚠️ Only {stock} left</span>;
  return <span className="text-sm text-green-600 font-semibold">✅ In stock</span>;
}

// ── REVIEW SECTION ────────────────────────────────────────────────────────────

function ReviewSection({ productId, initialReviews }: { productId: string; initialReviews: Review[] }) {
  const { user } = useAuth();
  const supabase = createClient();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5,4,3,2,1].map(n => ({
    star: n,
    count: reviews.filter(r => r.rating === n).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === n).length / reviews.length) * 100) : 0
  }));

  const alreadyReviewed = user && reviews.some(r => r.user_id === user.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError("");

    const { data, error: err } = await supabase
      .from("product_reviews")
      .insert({ product_id: productId, user_id: user.id, rating, title: title || null, content: content || null })
      .select("id, user_id, rating, title, content, created_at")
      .single();

    if (err) {
      setError(err.code === "23505" ? "You've already reviewed this product." : "Failed to submit review.");
      setSubmitting(false);
      return;
    }

    const reviewWithProfile = {
      ...data,
      profiles: { full_name: user.user_metadata?.full_name ?? user.email ?? "You" },
    };
    setReviews(prev => [reviewWithProfile as unknown as Review, ...prev]);
    setSubmitted(true);
    setShowForm(false);
    setSubmitting(false);
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Customer Reviews
          {reviews.length > 0 && <span className="text-gray-400 font-normal text-base ml-2">({reviews.length})</span>}
        </h2>
        {user && !alreadyReviewed && !submitted && (
          <button
            onClick={() => setShowForm(s => !s)}
            className="text-sm font-semibold text-brand-orange border border-brand-orange px-4 py-2 rounded-xl hover:bg-orange-50 transition"
          >
            {showForm ? "Cancel" : "Write a review"}
          </button>
        )}
        {!user && (
          <Link href="/account/login" className="text-sm text-brand-orange font-semibold hover:underline">
            Sign in to review
          </Link>
        )}
      </div>

      {/* Write review form */}
      {showForm && (
        <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Your Review</h3>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star rating picker */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <button key={i} type="button"
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                    className="focus:outline-none"
                  >
                    <svg style={{ width: "32px", height: "32px", color: i <= (hoverRating || rating) ? "#FB923C" : "#D1D5DB", transition: "color 0.15s" }}
                      fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Title (optional)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Summarise your review"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Review <span className="text-red-500">*</span></label>
              <textarea value={content} onChange={e => setContent(e.target.value)}
                required rows={4} placeholder="Share your experience with this product"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white resize-none" />
            </div>
            <button type="submit" disabled={submitting || !content.trim()}
              className="bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl text-sm transition">
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 rounded-2xl border border-green-100 p-4 mb-6 text-sm text-green-700 font-medium">
          ✅ Thank you for your review!
        </div>
      )}

      {/* Review list — two column: summary left, reviews right */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-4xl mb-3">⭐</p>
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

          {/* LEFT — rating summary card */}
          <div style={{ width: "460px", flexShrink: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="text-center mb-3">
              <p className="text-7xl font-extrabold text-gray-900 leading-none">{avgRating.toFixed(1)}</p>
              <div className="flex justify-center my-1.5">
                <Stars rating={avgRating} size="sm" />
              </div>
              <p className="text-sm text-gray-400">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="space-y-4">
              {ratingCounts.map(({ star, count, pct }) => (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="text-sm text-gray-400" style={{ width: "30px", textAlign: "right", flexShrink: 0 }}>{star}★</span>
                  <div className="bg-gray-100 rounded-full overflow-hidden" style={{ flex: 1, height: "9px" }}>
                    <div className="bg-brand-orange rounded-full h-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400" style={{ width: "12px", flexShrink: 0 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — individual reviews */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="rounded-full bg-brand-orange text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
                      style={{ width: "36px", height: "36px" }}>
                      {((review as any).full_name?.[0] ?? "U").toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{(review as any).full_name ?? "Customer"}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Stars rating={review.rating} size="sm" />
                </div>
                {review.title && <p className="text-sm font-semibold text-gray-900 mb-0.5">{review.title}</p>}
                {review.content && <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function ProductPageClient({
  product,
  relatedProducts,
  initialReviews,
}: {
  product: Product;
  relatedProducts: unknown[];
  initialReviews: Review[];
}) {
  const { addItem } = useCart();
  const { user } = useAuth();

  const defaultVariant = product.variants.find(v => v.is_default) ?? product.variants[0] ?? null;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const supabaseClient = createClient();

  const variantTypes = [...new Set(product.variants.map(v => v.type))];
  const activePrice   = Number(selectedVariant?.price ?? product.price);
  const activeCompare = selectedVariant?.compare_at_price ? Number(selectedVariant.compare_at_price)
    : product.compare_at_price ? Number(product.compare_at_price) : null;
  const activeStock  = selectedVariant?.stock_qty ?? product.stock_qty;
  const activeImages = (selectedVariant?.images?.length ? selectedVariant.images : null) ?? product.images;
  const isOutOfStock = product.track_stock && activeStock === 0;
  const discountPct  = activeCompare ? Math.round(((activeCompare - activePrice) / activeCompare) * 100) : null;

  const handleAddToCart = useCallback(() => {
    if (isOutOfStock) return;
    setAdding(true);
    addItem({
      productId: product.id, variantId: selectedVariant?.id,
      name: product.name, variantLabel: selectedVariant?.value,
      price: activePrice, image: activeImages?.[0] ?? undefined,
      slug: product.slug, deliveryIncluded: product.delivery_included,
      quantity
    });
    setAdding(false); setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }, [product, selectedVariant, quantity, activePrice, activeImages, isOutOfStock, addItem]);

  const handleBuyNow = useCallback(() => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id, variantId: selectedVariant?.id,
      name: product.name, variantLabel: selectedVariant?.value,
      price: activePrice, image: activeImages?.[0] ?? undefined,
      slug: product.slug, deliveryIncluded: product.delivery_included,
      quantity
    });
    window.location.href = "/checkout";
  }, [product, selectedVariant, quantity, activePrice, activeImages, isOutOfStock, addItem]);

  const handleWishlist = useCallback(async () => {
    if (!user) { window.location.href = "/account/login"; return; }
    setWishlistLoading(true);
    if (wishlisted) {
      await supabaseClient.from("wishlists").delete()
        .eq("user_id", user.id).eq("product_id", product.id);
      setWishlisted(false);
    } else {
      await supabaseClient.from("wishlists").insert({ user_id: user.id, product_id: product.id });
      setWishlisted(true);
    }
    setWishlistLoading(false);
  }, [user, wishlisted, product.id, supabaseClient]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pb-16">

        {/* ── SECTIONS 1 & 2: 30/70 grid ──────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-10 items-start mb-16">

          {/* SECTION 1 — Image gallery with vertical thumbnails (40%) */}
          <div className="md:sticky md:top-24 w-full flex-shrink-0" style={{ width: "420px" }}>
            <ImageGallery images={activeImages ?? []} name={product.name} />
          </div>

          {/* SECTION 2 — All product info (70%) */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Name */}
            <div>
              {product.badge && (
                <span className="inline-block bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {product.badge}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-1">
                {product.name}
              </h1>
              {/* Avg rating if available */}
              {initialReviews.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Stars rating={initialReviews.reduce((s,r) => s+r.rating,0)/initialReviews.length} size="sm" />
                  <span className="text-sm text-gray-500">({initialReviews.length} reviews)</span>
                </div>
              )}
            </div>

            {/* Description */}
            {(product.description || product.short_description) && (
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description ?? product.short_description}
              </p>
            )}

            <hr className="border-gray-100" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-gray-900">£{activePrice.toFixed(2)}</span>
              {activeCompare && (
                <>
                  <span className="text-base text-gray-400 line-through">£{activeCompare.toFixed(2)}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">-{discountPct}% OFF</span>
                </>
              )}
            </div>

            {/* Variants */}
            {variantTypes.map(type => (
              <div key={type}>
                <p className="text-sm font-semibold text-gray-700 mb-2 capitalize">{type}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.filter(v => v.type === type).map(v => {
                    const oos = product.track_stock && v.stock_qty === 0;
                    const sel = selectedVariant?.id === v.id;
                    const vp  = v.price ? Number(v.price) : null;
                    return (
                      <button key={v.id} onClick={() => !oos && setSelectedVariant(v)} disabled={oos}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition ${
                          sel ? "border-brand-orange bg-orange-50 text-brand-orange"
                          : oos ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                          : "border-gray-200 text-gray-700 hover:border-brand-orange hover:text-brand-orange"
                        }`}>
                        {v.value}
                        {vp && vp !== product.price && <span className="ml-1.5 text-xs opacity-70">£{vp.toFixed(2)}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity + stock */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-lg transition">−</button>
                  <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(activeStock||99, q+1))}
                    disabled={product.track_stock && quantity >= activeStock}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 font-bold text-lg transition">+</button>
                </div>
                <StockBadge stock={activeStock} threshold={product.low_stock_threshold} track={product.track_stock} />
              </div>
            </div>

            {/* Three action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              {/* Row 1: Add to Cart + Buy Now */}
              <div style={{ display: "flex", gap: "10px" }}>

                {/* Add to Cart */}
                <button onClick={handleAddToCart} disabled={isOutOfStock || adding}
                  style={{ flex: 1 }}
                  className={`py-3.5 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                    added ? "bg-green-500 text-white"
                    : isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-brand-orange hover:bg-orange-500 text-white shadow-lg shadow-orange-100 hover:-translate-y-0.5"
                  }`}>
                  {added ? (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Added!</>
                  ) : isOutOfStock ? "Out of stock" : adding ? "Adding..." : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>Add to cart</>
                  )}
                </button>

                {/* Buy Now */}
                <button onClick={handleBuyNow} disabled={isOutOfStock}
                  style={{ flex: 1 }}
                  className={`py-3.5 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 border-2 ${
                    isOutOfStock ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-brand-orange text-brand-orange hover:bg-orange-50"
                  }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Buy now
                </button>
              </div>

              {/* Row 2: Wishlist full width */}
              <button onClick={handleWishlist} disabled={wishlistLoading}
                className={`w-full py-3 rounded-2xl font-semibold text-sm transition flex items-center justify-center gap-2 border ${
                  wishlisted
                    ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange"
                }`}>
                <svg className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                {wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              </button>

            </div>

            {/* Delivery */}
            <div className="bg-orange-50 rounded-2xl p-4 space-y-2.5">
              {product.delivery_included ? (
                <p className="text-sm text-green-700 font-semibold">✅ Free delivery included</p>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">📦 Standard delivery (3–5 working days)</span>
                    <span className="font-semibold text-gray-900">£3.99</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">⚡ Express delivery (1–2 working days)</span>
                    <span className="font-semibold text-gray-900">£6.99</span>
                  </div>
                  <p className="text-xs text-brand-orange font-semibold">✨ FREE standard delivery on orders over £25</p>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[{icon:"🔒",text:"Secure payment"},{icon:"✅",text:"100% authentic"},{icon:"📦",text:"Easy returns"}].map(b => (
                <div key={b.text} className="text-center bg-white rounded-xl border border-gray-100 py-3 px-2">
                  <div className="text-xl mb-1">{b.icon}</div>
                  <p className="text-xs text-gray-500 font-medium">{b.text}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION 3: Full width — Reviews + Related ────────────────────── */}
        <div className="border-t border-gray-100 pt-12 space-y-14">

          {/* Reviews */}
          <ReviewSection productId={product.id} initialReviews={initialReviews} />

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #F3F4F6" }}>
              <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">You might also like</h2>
                <Link href={`/shop/${product.category_slug}`} className="text-sm text-brand-orange font-semibold hover:underline">
                  See all {product.category_name} →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard key={(p as {id:string}).id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky mobile bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-2xl px-4 py-3">
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ flexShrink: 0 }}>
            <p className="text-xs text-gray-400 leading-none">Total</p>
            <p className="font-extrabold text-gray-900">£{(activePrice * quantity).toFixed(2)}</p>
          </div>
          <button onClick={handleAddToCart} disabled={isOutOfStock || adding}
            style={{ flex: 1 }}
            className={`py-3 rounded-xl font-bold text-xs transition ${
              added ? "bg-green-500 text-white"
              : isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-brand-orange text-white"
            }`}>
            {added ? "✓ Added!" : isOutOfStock ? "Out of stock" : "Add to cart"}
          </button>
          <button onClick={handleBuyNow} disabled={isOutOfStock}
            style={{ flex: 1 }}
            className="py-3 rounded-xl font-bold text-xs border-2 border-brand-orange text-brand-orange transition hover:bg-orange-50">
            Buy now
          </button>
          <button onClick={handleWishlist}
            style={{ flexShrink: 0, width: "40px", height: "40px" }}
            className="rounded-xl border border-gray-200 flex items-center justify-center">
            <svg style={{ width: "18px", height: "18px", color: wishlisted ? "#EF4444" : "#9CA3AF" }}
              fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="h-20 md:hidden" />
    </>
  );
}
