"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { cloudinaryUrl } from "@/lib/cloudinary";

type OrderItem = {
  id: string;
  name: string;
  variant_label?: string;
  image?: string;
  slug: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type Order = {
  id: string;
  status: string;
  subtotal: number;
  delivery_cost: number;
  total: number;
  delivery_method: string;
  delivery_estimate: string;
  shipping_name: string;
  shipping_line1: string;
  shipping_line2?: string;
  shipping_city: string;
  shipping_county?: string;
  shipping_postcode: string;
  shipping_country: string;
  shipping_phone?: string;
  stripe_payment_intent_id: string;
  created_at: string;
  order_items: OrderItem[];
};

// ── STATUS TRACKER ─────────────────────────────────────────────────────────────

const STEPS = ["paid", "processing", "shipped", "delivered"] as const;

const STEP_LABELS: Record<string, string> = {
  paid:       "Order placed",
  processing: "Processing",
  shipped:    "Shipped",
  delivered:  "Delivered",
};

const STEP_ICONS: Record<string, string> = {
  paid:       "✅",
  processing: "⚙️",
  shipped:    "🚚",
  delivered:  "🎉",
};

function StatusTracker({ status }: { status: string }) {
  // cancelled/refunded shown differently
  if (status === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
        <span className="text-lg">❌</span>
        <p className="text-sm font-semibold text-red-600">This order has been cancelled</p>
      </div>
    );
  }
  if (status === "refunded") {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
        <span className="text-lg">↩️</span>
        <p className="text-sm font-semibold text-gray-600">This order has been refunded</p>
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(status as typeof STEPS[number]);

  return (
    <div className="relative">
      {/* Connector line */}
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 hidden sm:block" />
      <div className="flex justify-between relative gap-2">
        {STEPS.map((step, idx) => {
          const isDone    = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 border-2 transition-all ${
                  isDone
                    ? "bg-brand-orange border-brand-orange"
                    : "bg-white border-gray-200"
                } ${isCurrent ? "ring-4 ring-orange-100" : ""}`}
              >
                {isDone ? (
                  <span className="text-sm">{STEP_ICONS[step]}</span>
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200 block" />
                )}
              </div>
              <p className={`text-xs font-semibold text-center leading-tight ${isDone ? "text-gray-900" : "text-gray-400"}`}>
                {STEP_LABELS[step]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router   = useRouter();
  const params   = useParams();
  const id       = params.id as string;
  const supabase = createClient();

  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/account/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) { router.push("/account/orders"); return; }
        setOrder(data as Order);
        setLoading(false);
      });
  }, [user, id]);

  if (authLoading || loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <svg className="animate-spin w-6 h-6 text-brand-orange" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  if (!order) return null;

  const shortId = order.id.slice(0, 8).toUpperCase();
  const date    = new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-background min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/account/orders" className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order #{shortId}</h1>
            <p className="text-sm text-gray-400 mt-0.5">Placed on {date}</p>
          </div>
        </div>

        {/* Status tracker */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">Order status</h2>
          <StatusTracker status={order.status} />
          {order.status === "shipped" && (
            <p className="text-xs text-gray-400 text-center mt-4">
              Your order is on its way — check your email for tracking details
            </p>
          )}
          {order.status === "delivered" && (
            <p className="text-xs text-green-600 text-center mt-4 font-medium">
              🎉 Your order has been delivered. Enjoy!
            </p>
          )}
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Items ({order.order_items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                  {item.image ? (
                    <img
                      src={cloudinaryUrl(item.image, "card")}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  {item.variant_label && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.variant_label}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.quantity}× £{item.unit_price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                  £{item.line_total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals + delivery info */}
        <div className="grid sm:grid-cols-2 gap-5">

          {/* Delivery address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Delivery address</h2>
            <p className="text-sm text-gray-900 font-semibold">{order.shipping_name}</p>
            <p className="text-sm text-gray-500 leading-relaxed mt-1">
              {order.shipping_line1}
              {order.shipping_line2 && <><br />{order.shipping_line2}</>}
              <br />{order.shipping_city}
              {order.shipping_county && `, ${order.shipping_county}`}
              <br />{order.shipping_postcode}
            </p>
            {order.shipping_phone && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {order.shipping_phone}
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-sm font-medium text-brand-orange flex items-center gap-1.5">
                {order.delivery_method === "express" ? "⚡ Express" : "📦 Standard"} — {order.delivery_estimate}
              </p>
            </div>
          </div>

          {/* Order total */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>£{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span>
                  {order.delivery_cost === 0
                    ? <span className="text-green-600 font-medium">FREE</span>
                    : `£${order.delivery_cost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total paid</span>
                <span className="text-brand-orange">£{order.total.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Paid securely via Stripe
            </p>
          </div>

        </div>

        {/* Help */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Need help with this order?</p>
            <p className="text-xs text-gray-400 mt-0.5">Contact us and quote your order reference #{shortId}</p>
          </div>
          <a
            href={`mailto:contact@truemart.co.uk?subject=Order %23${shortId}`}
            className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            Contact us
          </a>
        </div>

      </div>
    </div>
  );
}
