"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { useCart } from "@/context/CartContext";

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type ProductVariant = {
  id: string;
  type: string;
  value: string;
  label?: string | null;
  color_hex?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  stock_qty?: number | null;
  is_default: boolean;
  display_order: number;
  images?: string[] | null; 
};

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  price: number;
  compare_at_price?: number | null;
  images: string[];
  badge?: string | null;
  stock_qty?: number;
  rating?: number | null;
  review_count?: number;
  is_featured?: boolean;
  delivery_included?: boolean;
  tags?: string[];
};

type ProductCardProps = {
  product: ProductCardData;
  wishlisted?: boolean;
  onWishlist?: (id: string) => void;
};

// ── BADGE CONFIG ──────────────────────────────────────────────────────────────

const BADGE_CONFIG: Record<string, { bg: string; color: string }> = {
  Bestseller:     { bg: "#FB923C", color: "#fff" },   // orange
  Popular:        { bg: "#F43F5E", color: "#fff" },   // red
  New:            { bg: "#10B981", color: "#fff" },   // green
  Sale:           { bg: "#EAB308", color: "#1a1a1a" },// yellow
  Limited:        { bg: "#8B5CF6", color: "#fff" },   // purple
  "Back in Stock":{ bg: "#3B82F6", color: "#fff" },   // blue
  "Gift Pick":    { bg: "#EC4899", color: "#fff" },   // pink
  // any other text → dark grey fallback (handled in badgeConfig below)
};

// ── STAR RATING ───────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <div style={{ display: "flex", gap: "1px" }}>
        {[...Array(full)].map((_, i) => (
          <svg key={`f${i}`} width="12" height="12" viewBox="0 0 20 20" fill="#FB923C">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
        {half && (
          <svg width="12" height="12" viewBox="0 0 20 20">
            <defs><linearGradient id="hg"><stop offset="50%" stopColor="#FB923C"/><stop offset="50%" stopColor="#E5E7EB"/></linearGradient></defs>
            <path fill="url(#hg)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        )}
        {[...Array(empty)].map((_, i) => (
          <svg key={`e${i}`} width="12" height="12" viewBox="0 0 20 20" fill="#E5E7EB">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151" }}>{rating.toFixed(1)}</span>
      <span style={{ fontSize: "11px", color: "#9CA3AF" }}>({count})</span>
    </div>
  );
}

// ── VARIANT SELECTOR ──────────────────────────────────────────────────────────

function VariantGroup({
  type,
  variants,
  selectedId,
  onSelect,
}: {
  type: string;
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (v: ProductVariant) => void;
}) {
  const isColor = type === "color";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center" }}>
      {variants.map((v) => {
        const isSelected  = v.id === selectedId;
        const outOfStock  = typeof v.stock_qty === "number" && v.stock_qty === 0;

        if (isColor && v.color_hex) {
          return (
            <button
              key={v.id}
              title={v.label ?? v.value}
              onClick={(e) => { e.preventDefault(); if (!outOfStock) onSelect(v); }}
              style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: v.color_hex,
                border: isSelected ? "2px solid #111827" : "2px solid transparent",
                outline: isSelected ? "2px solid #fff" : "none",
                outlineOffset: "-3px",
                cursor: outOfStock ? "not-allowed" : "pointer",
                opacity: outOfStock ? 0.35 : 1,
                padding: 0, flexShrink: 0,
              }}
            />
          );
        }

        return (
          <button
            key={v.id}
            onClick={(e) => { e.preventDefault(); if (!outOfStock) onSelect(v); }}
            style={{
              fontSize: "11px",
              fontWeight: isSelected ? 700 : 500,
              padding: "2px 9px",
              borderRadius: "999px",
              border: isSelected ? "1.5px solid #111827" : "1.5px solid #E5E7EB",
              background: isSelected ? "#111827" : "#fff",
              color: isSelected ? "#fff" : outOfStock ? "#D1D5DB" : "#374151",
              cursor: outOfStock ? "not-allowed" : "pointer",
              textDecoration: outOfStock ? "line-through" : "none",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {v.label ?? v.value}
          </button>
        );
      })}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function ProductCard({
  product,
  wishlisted = false,
  onWishlist,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);

  const [variantsByType, setVariantsByType]     = useState<Record<string, ProductVariant[]>>({});
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});

  // Fetch variants once on mount
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("product_variants")
        .select("id, type, value, label, color_hex, price, compare_at_price, stock_qty, images, is_default, display_order")
        .eq("product_id", product.id)
        .eq("is_active", true)
        .order("display_order");

      if (!data || data.length === 0) return;

      const grouped: Record<string, ProductVariant[]> = {};
      for (const v of data as ProductVariant[]) {
        if (!grouped[v.type]) grouped[v.type] = [];
        grouped[v.type].push(v);
      }
      setVariantsByType(grouped);

      // Pre-select defaults
      const defaults: Record<string, ProductVariant> = {};
      for (const [type, variants] of Object.entries(grouped)) {
        defaults[type] = variants.find((v) => v.is_default) ?? variants[0];
      }
      setSelectedVariants(defaults);
    }
    load();
  }, [product.id]);

  // Active values — first variant type drives price/stock
  const { addItem, items, updateQuantity } = useCart();
  const primaryVariant = Object.values(selectedVariants)[0] ?? null;

  // Reset image error when variant changes
  useEffect(() => { setImgError(false); }, [primaryVariant?.id]);

  // Current qty in cart for this product+variant
  const cartItem = items.find(i =>
    i.productId === product.id &&
    (i.variantId ?? "default") === (primaryVariant?.id ?? "default")
  );
  const cartQty = cartItem?.quantity ?? 0;

  // Reset image error when variant changes
  const activePrice    = primaryVariant?.price        ?? product.price;
  const activeCompare  = primaryVariant?.compare_at_price ?? product.compare_at_price;
  const activeStock    = primaryVariant?.stock_qty    ?? product.stock_qty;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: primaryVariant?.id,
      name: product.name,
      variantLabel: primaryVariant?.value,
      price: activePrice,
      image: !imgError ? (primaryVariant?.images?.[0] || product.images?.[0]) ?? undefined : undefined,
      slug: product.slug,
      deliveryIncluded: product.delivery_included ?? false,
    });
  };

  // Variant image takes priority, falls back to product image
  const activeSrc = !imgError ? (primaryVariant?.images?.[0] || product.images?.[0]) ?? null : null;
  const imageUrl = activeSrc ? cloudinaryUrl(activeSrc, "card") : null;
  const discount     = activeCompare && activeCompare > activePrice
    ? Math.round(((activeCompare - activePrice) / activeCompare) * 100)
    : null;
  const badgeConfig  = product.badge ? (BADGE_CONFIG[product.badge] ?? { bg: "#374151", color: "#fff" }) : null;
  const isLowStock   = typeof activeStock === "number" && activeStock > 0 && activeStock <= 5;
  const isOutOfStock = typeof activeStock === "number" && activeStock === 0;
  const freeDelivery = product.delivery_included !== true && activePrice >= 25;
  const hasVariants  = Object.keys(variantsByType).length > 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", background: "#fff", borderRadius: "16px",
        overflow: "hidden", border: "1px solid #F3F4F6",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s ease", display: "flex", flexDirection: "column",
      }}
    >
      {/* ── IMAGE AREA ── */}
      <div style={{ position: "relative", height: "240px", background: "#fff", flexShrink: 0 }}>
        <Link href={`/products/${product.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
          {imageUrl ? (
            <img
              src={imageUrl} alt={product.name} onError={() => setImgError(true)}
              style={{
                width: "100%", height: "100%", objectFit: "contain", padding: "20px",
                transform: hovered ? "scale(1.04)" : "scale(1)",
                transition: "transform 0.4s ease",
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px", opacity: 0.1 }}>
              🛒
            </div>
          )}
        </Link>

        {isOutOfStock && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280", background: "#fff", border: "1px solid #E5E7EB", padding: "6px 14px", borderRadius: "999px" }}>
              Out of Stock
            </span>
          </div>
        )}

        {/* TOP LEFT — badge + discount */}
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", flexDirection: "column", gap: "4px", zIndex: 2 }}>
          {badgeConfig && product.badge && (
            <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 10px", borderRadius: "999px", background: badgeConfig.bg, color: badgeConfig.color, boxShadow: "0 2px 6px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 10px", borderRadius: "999px", background: "#FEF08A", color: "#713F12", boxShadow: "0 2px 6px rgba(0,0,0,0.10)", whiteSpace: "nowrap" }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* TOP RIGHT — wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlist?.(product.id); }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          style={{
            position: "absolute", top: "10px", right: "10px", zIndex: 3,
            width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: wishlisted ? "#F43F5E" : "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            opacity: 1,
            transform: wishlisted ? "scale(1.1)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={wishlisted ? "#fff" : "none"}
            stroke={wishlisted ? "none" : "#F43F5E"}
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>

      {/* ── CARD BODY ── */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "14px 16px 16px", gap: "8px" }}>

        {product.rating && product.review_count ? (
          <StarRating rating={product.rating} count={product.review_count} />
        ) : null}

        <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#111827", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p style={{ margin: 0, fontSize: "12px", color: "#9CA3AF", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.short_description}
          </p>
        )}

        {/* ── VARIANT SELECTORS ── */}
        {hasVariants && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "2px" }}>
            {Object.entries(variantsByType).map(([type, variants]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#6B7280", textTransform: "capitalize", minWidth: "48px", flexShrink: 0 }}>
                  {type}:
                </span>
                <VariantGroup
                  type={type}
                  variants={variants}
                  selectedId={selectedVariants[type]?.id ?? null}
                  onSelect={(v) => setSelectedVariants((prev) => ({ ...prev, [type]: v }))}
                />
              </div>
            ))}
          </div>
        )}

        {/* Price — live updates on variant change */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "auto", paddingTop: "4px" }}>
          <span style={{ fontSize: "18px", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
            £{activePrice.toFixed(2)}
          </span>
          {activeCompare && activeCompare > activePrice && (
            <span style={{ fontSize: "13px", color: "#9CA3AF", textDecoration: "line-through", fontWeight: 500 }}>
              £{activeCompare.toFixed(2)}
            </span>
          )}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", minHeight: "20px" }}>
          {freeDelivery && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11px", fontWeight: 600, color: "#065F46", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "2px 8px", borderRadius: "999px" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              Free delivery
            </span>
          )}
          {isLowStock && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11px", fontWeight: 600, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", padding: "2px 8px", borderRadius: "999px" }}>
              🔥 Only {activeStock} left
            </span>
          )}
        </div>

        {/* Add to Cart / Qty Controls */}
        {isOutOfStock ? (
          <button disabled style={{ width: "100%", marginTop: "4px", padding: "10px 0", borderRadius: "12px", border: "none", cursor: "not-allowed", background: "#F3F4F6", color: "#9CA3AF", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
            Out of Stock
          </button>
        ) : cartQty === 0 ? (
          <button
            onClick={handleAddToCart}
            style={{ width: "100%", marginTop: "4px", padding: "10px 0", borderRadius: "12px", border: "none", cursor: "pointer", background: "#F97316", color: "#fff", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", transition: "background 0.15s ease" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#EA6D0E"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F97316"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Add to Cart
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", border: "2px solid #F97316", borderRadius: "12px", overflow: "hidden", height: "42px", marginTop: "4px" }}>
            <button
              onClick={() => updateQuantity(product.id, primaryVariant?.id, cartQty - 1)}
              style={{ flex: 1, height: "100%", border: "none", background: "none", fontSize: "20px", fontWeight: 700, color: "#F97316", cursor: "pointer" }}
              aria-label="Remove one"
            >−</button>
            <span style={{ width: "36px", textAlign: "center", fontWeight: 700, fontSize: "15px", color: "#111" }}>{cartQty}</span>
            <button
              onClick={() => updateQuantity(product.id, primaryVariant?.id, cartQty + 1)}
              style={{ flex: 1, height: "100%", border: "none", background: "#F97316", fontSize: "20px", fontWeight: 700, color: "#fff", cursor: "pointer" }}
              aria-label="Add one more"
            >+</button>
          </div>
        )}
      </div>
    </div>
  );
}
