"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";

type Order = {
  id: string;
  total: number;
  subtotal: number;
  delivery_cost: number;
  coupon_code?: string;
  coupon_discount?: number;
  delivery_method: string;
  delivery_estimate: string;
  shipping_name: string;
  shipping_line1: string;
  shipping_line2?: string;
  shipping_city: string;
  shipping_county?: string;
  shipping_postcode: string;
  stripe_payment_intent_id: string;
  status: string;
  created_at: string;
  order_items: Array<{
    name: string;
    variant_label?: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    image?: string;
  }>;
};

function OrderConfirmationContent() {
  const params   = useSearchParams();
  // Stripe appends ?payment_intent=pi_xxx when redirecting after payment
  // We also support ?pi=xxx for manual redirects
  const pi       = params.get("payment_intent") ?? params.get("pi");
  const { clearCart } = useCart();
  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const supabase = createClient();

  // Clear cart as soon as confirmation page loads
  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    if (!pi) { setError("No order reference found."); setLoading(false); return; }

    async function fetchOrder() {
      // Poll for up to 10s — webhook may take a moment to process
      let attempts = 0;
      while (attempts < 10) {
        const { data } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("stripe_payment_intent_id", pi)
          .maybeSingle();

        if (data) { setOrder(data); setLoading(false); return; }
        await new Promise(r => setTimeout(r, 1000));
        attempts++;
      }
      setError("We're processing your order. Check your email for confirmation, or visit My Orders.");
      setLoading(false);
    }

    fetchOrder();
  }, [pi]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 text-brand-orange mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-gray-500 text-sm">Confirming your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Order received!</h1>
          <p className="text-gray-500 text-sm mb-6">{error || "Check your email for confirmation."}</p>
          <Link href="/account/orders" className="bg-brand-orange text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-500 transition">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <div className="bg-background min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">

        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Order confirmed!</h1>
          <p className="text-gray-500 text-sm">A confirmation email is on its way to you.</p>
        </div>

        {/* Order card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Order ref */}
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Order reference</p>
              <p className="font-bold text-brand-orange text-lg">#{shortId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-4 border-b border-gray-50 space-y-3">
            {order.order_items.map((item, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}{item.variant_label ? ` — ${item.variant_label}` : ""}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">£{item.line_total.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-6 py-4 border-b border-gray-50 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>£{order.subtotal.toFixed(2)}</span>
            </div>
            {order.coupon_code && Number(order.coupon_discount) > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Discount ({order.coupon_code})</span>
                <span>-£{Number(order.coupon_discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery ({order.delivery_method === "express" ? "Express" : "Standard"})</span>
              <span>{order.delivery_cost === 0 ? <span className="text-green-600 font-medium">FREE</span> : `£${order.delivery_cost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total paid</span>
              <span className="text-brand-orange">£{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery info */}
          <div className="px-6 py-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Delivering to</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {order.shipping_name}<br />
              {order.shipping_line1}{order.shipping_line2 ? `, ${order.shipping_line2}` : ""}<br />
              {order.shipping_city}{order.shipping_county ? `, ${order.shipping_county}` : ""}<br />
              {order.shipping_postcode}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-brand-orange">
              <span>{order.delivery_method === "express" ? "⚡" : "📦"}</span>
              <span>{order.delivery_method === "express" ? "Express: 1–2 working days" : "Standard: 3–5 working days"}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/account/orders"
            className="flex-1 text-center bg-brand-orange text-white font-semibold py-3 rounded-xl text-sm hover:bg-orange-500 transition"
          >
            View my orders
          </Link>
          <Link
            href="/shop"
            className="flex-1 text-center bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            Continue shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationContent />
    </Suspense>
  );
}
