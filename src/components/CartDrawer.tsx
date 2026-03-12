"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { cloudinaryUrl } from "@/lib/cloudinary";

export default function CartDrawer() {
  const { items, totalItems, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  const freeDeliveryThreshold = 25;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100dvh",
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#fff",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Your Cart</span>
            {totalItems > 0 && (
              <span style={{ background: "#FB923C", color: "#fff", fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "1px 8px" }}>
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#666", display: "flex", alignItems: "center" }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free delivery progress */}
        {totalItems > 0 && (
          <div style={{ padding: "12px 20px", background: "#FFF7ED", borderBottom: "1px solid #FED7AA" }}>
            {remainingForFree > 0 ? (
              <p style={{ fontSize: 13, color: "#9A3412", marginBottom: 6 }}>
                Add <strong>£{remainingForFree.toFixed(2)}</strong> more for free UK delivery 🚚
              </p>
            ) : (
              <p style={{ fontSize: 13, color: "#166534", marginBottom: 6, fontWeight: 600 }}>
                🎉 You've unlocked free UK delivery!
              </p>
            )}
            <div style={{ height: 4, background: "#FED7AA", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${freeDeliveryProgress}%`, background: "#FB923C", borderRadius: 999, transition: "width 0.3s ease" }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, color: "#999" }}>
              <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24" opacity={0.3}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#555" }}>Your cart is empty</p>
              <p style={{ fontSize: 13 }}>Add some products to get started</p>
              <button
                onClick={closeCart}
                style={{ marginTop: 8, background: "#FB923C", color: "#fff", border: "none", borderRadius: 999, padding: "10px 24px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map(item => {
                const imgUrl = item.image ? cloudinaryUrl(item.image, "thumb") : null;
                return (
                  <li key={`${item.productId}-${item.variantId}`} style={{ display: "flex", gap: 12, paddingBottom: 16, borderBottom: "1px solid #f5f5f5" }}>
                    {/* Image */}
                    <div style={{ width: 72, height: 72, borderRadius: 8, overflow: "hidden", background: "#f9f9f9", flexShrink: 0, border: "1px solid #eee" }}>
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>📦</div>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/products/${item.slug}`} onClick={closeCart} style={{ fontSize: 14, fontWeight: 600, color: "#111", textDecoration: "none", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </Link>
                      {item.variantLabel && (
                        <span style={{ fontSize: 12, color: "#888", display: "block", marginTop: 2 }}>{item.variantLabel}</span>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                        {/* Quantity controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", fontSize: 16, color: "#555", display: "flex", alignItems: "center", justifyContent: "center" }}
                            aria-label="Decrease quantity"
                          >−</button>
                          <span style={{ width: 28, textAlign: "center", fontSize: 14, fontWeight: 600, color: "#111" }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", fontSize: 16, color: "#555", display: "flex", alignItems: "center", justifyContent: "center" }}
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`Remove ${item.name}`}
                      style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "#ccc", alignSelf: "flex-start", flexShrink: 0 }}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15, color: "#555" }}>Subtotal</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>£{subtotal.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              style={{ display: "block", background: "#FB923C", color: "#fff", textAlign: "center", padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
            >
              Checkout · £{subtotal.toFixed(2)}
            </Link>
            <button
              onClick={closeCart}
              style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px", fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#555" }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
