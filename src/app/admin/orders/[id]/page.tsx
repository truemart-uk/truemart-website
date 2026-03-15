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
  user_id: string;
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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",    color: "#92400E", bg: "#FEF3C7" },
  paid:       { label: "Paid",       color: "#065F46", bg: "#D1FAE5" },
  processing: { label: "Processing", color: "#1E40AF", bg: "#DBEAFE" },
  shipped:    { label: "Shipped",    color: "#5B21B6", bg: "#EDE9FE" },
  delivered:  { label: "Delivered",  color: "#065F46", bg: "#D1FAE5" },
  cancelled:  { label: "Cancelled",  color: "#991B1B", bg: "#FEE2E2" },
  refunded:   { label: "Refunded",   color: "#6B7280", bg: "#F3F4F6" },
};

// Status transitions — what can each status move to
const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending:    ["paid", "cancelled"],
  paid:       ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped:    ["delivered"],
  delivered:  [],
  cancelled:  ["refunded"],
  refunded:   [],
};

export default function AdminOrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router   = useRouter();
  const params   = useParams();
  const id       = params.id as string;
  const supabase = createClient();

  const [order, setOrder]       = useState<Order | null>(null);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/account/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (!data) { router.push("/admin/orders"); return; }
        setOrder(data as Order);
        setLoading(false);
      });
  }, [user, id]);

  async function handleStatusUpdate(newStatus: string) {
    if (!order) return;
    setUpdating(true);
    setError("");
    setSuccess("");

    const res = await fetch(`/api/admin/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to update status");
      setUpdating(false);
      return;
    }

    setOrder(data.order);
    setSuccess(
      newStatus === "shipped"
        ? "Order marked as shipped — customer notified by email ✅"
        : `Order status updated to ${newStatus}`
    );
    setUpdating(false);
    setTimeout(() => setSuccess(""), 4000);
  }

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

  const shortId     = order.id.slice(0, 8).toUpperCase();
  const date        = new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const cfg         = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const transitions = STATUS_TRANSITIONS[order.status] ?? [];

  return (
    <div className="bg-background min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin?tab=orders" className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Admin</p>
              <span className="text-gray-300">·</span>
              <p className="text-xs text-gray-400">Order #{shortId}</p>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">{order.shipping_name}</h1>
          </div>
          <span
            className="text-sm font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
            style={{ color: cfg.color, background: cfg.bg }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Feedback messages */}
        {success && (
          <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {/* ── Status update ──────────────────────────────────────────────────── */}
        {transitions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Update status</h2>
            <div className="flex flex-wrap gap-3">
              {transitions.map(status => {
                const btnCfg = STATUS_CONFIG[status];
                const isShipped = status === "shipped";
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition disabled:opacity-50 ${
                      isShipped
                        ? "border-brand-orange bg-brand-orange text-white hover:bg-orange-600"
                        : status === "cancelled"
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-gray-200 text-gray-700 hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50"
                    }`}
                  >
                    {updating ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : null}
                    Mark as {btnCfg?.label ?? status}
                    {isShipped && <span className="text-xs opacity-75">— sends email</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Order info ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Reference</p>
              <p className="text-sm font-bold text-gray-900">#{shortId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date</p>
              <p className="text-sm font-medium text-gray-700">{date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Delivery</p>
              <p className="text-sm font-medium text-gray-700">
                {order.delivery_method === "express" ? "⚡ Express" : "📦 Standard"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Stripe PI</p>
              <p className="text-xs font-mono text-gray-400 truncate">{order.stripe_payment_intent_id}</p>
            </div>
          </div>
        </div>

        {/* ── Items ─────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Items ({order.order_items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {order.order_items.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                  {item.image ? (
                    <img src={cloudinaryUrl(item.image, "card")} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  {item.variant_label && <p className="text-xs text-gray-400">{item.variant_label}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">{item.quantity}× £{item.unit_price.toFixed(2)}</p>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">£{item.line_total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Totals + address ──────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-5">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Shipping address</h2>
            <p className="text-sm font-semibold text-gray-900">{order.shipping_name}</p>
            <p className="text-sm text-gray-500 leading-relaxed mt-1">
              {order.shipping_line1}{order.shipping_line2 && <><br />{order.shipping_line2}</>}
              <br />{order.shipping_city}{order.shipping_county && `, ${order.shipping_county}`}
              <br />{order.shipping_postcode} · {order.shipping_country}
            </p>
            {order.shipping_phone && (
              <p className="text-xs text-gray-400 mt-2">{order.shipping_phone}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>£{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span>{order.delivery_cost === 0 ? <span className="text-green-600 font-medium">FREE</span> : `£${order.delivery_cost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span><span className="text-brand-orange">£{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Analytics placeholder */}
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6 text-center opacity-50">
          <p className="text-sm font-semibold text-gray-400">📊 Analytics coming soon</p>
          <p className="text-xs text-gray-400 mt-1">Visitor data, traffic sources, and conversion tracking will appear here</p>
        </div>

      </div>
    </div>
  );
}
