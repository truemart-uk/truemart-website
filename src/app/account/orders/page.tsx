"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { cloudinaryUrl } from "@/lib/cloudinary";

type OrderItem = {
  id: string;
  name: string;
  variant_label?: string;
  image?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type Order = {
  id: string;
  status: string;
  total: number;
  delivery_method: string;
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

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "#6B7280", bg: "#F3F4F6" };
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router   = useRouter();
  const supabase = createClient();

  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/account/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, status, total, delivery_method, created_at, order_items(id, name, variant_label, image, quantity, unit_price, line_total)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setLoading(false);
      });
  }, [user]);

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

  return (
    <div className="bg-background min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My orders</h1>
        </div>

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 text-sm mb-6">When you place an order, it will appear here.</p>
            <Link
              href="/shop/books"
              className="bg-brand-orange hover:bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Start shopping
            </Link>
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((order) => {
            const date       = new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
            const shortId    = order.id.slice(0, 8).toUpperCase();
            const visibleItems = order.order_items.slice(0, 3);
            const extraCount   = order.order_items.length - visibleItems.length;

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">

                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">#{shortId}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-base font-bold text-brand-orange">£{order.total.toFixed(2)}</p>
                </div>

                {/* Item thumbnails */}
                <div className="px-5 py-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    {visibleItems.map((item) => (
                      <div
                        key={item.id}
                        className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0"
                      >
                        {item.image ? (
                          <img
                            src={cloudinaryUrl(item.image, "card")}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                        )}
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-400">+{extraCount}</span>
                      </div>
                    )}
                    <div className="ml-2 flex-1 min-w-0">
                      <p className="text-sm text-gray-600 truncate">
                        {order.order_items.map(i => `${i.quantity}× ${i.name}`).join(", ")}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.delivery_method === "express" ? "⚡ Express" : "📦 Standard"} delivery
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-1 text-sm font-semibold text-brand-orange hover:text-orange-600 transition flex-shrink-0"
                  >
                    View
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
