"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  delivery_cost: number;
  delivery_method: string;
  created_at: string;
  shipping_name: string;
  shipping_postcode: string;
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

const FILTER_TABS = ["all", "paid", "processing", "shipped", "delivered", "cancelled"] as const;
type FilterTab = typeof FILTER_TABS[number];

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router   = useRouter();
  const supabase = createClient();

  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<FilterTab>("all");
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) router.push("/account/login");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("id, status, total, subtotal, delivery_cost, delivery_method, created_at, shipping_name, shipping_postcode, order_items(name, quantity)")
      .order("created_at", { ascending: false });

    const all = (data as Order[]) ?? [];
    setOrders(all);
    setTotalRevenue(all.filter(o => !["cancelled", "refunded"].includes(o.status)).reduce((s, o) => s + o.total, 0));
    setLoading(false);
  }

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const counts = FILTER_TABS.reduce((acc, tab) => {
    acc[tab] = tab === "all" ? orders.length : orders.filter(o => o.status === tab).length;
    return acc;
  }, {} as Record<string, number>);

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
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total revenue</p>
            <p className="text-xl font-bold text-brand-orange">£{totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total orders",   value: orders.length,                                                              color: "text-gray-900" },
            { label: "Paid",           value: orders.filter(o => o.status === "paid").length,                             color: "text-green-600" },
            { label: "Processing",     value: orders.filter(o => o.status === "processing").length,                       color: "text-blue-600" },
            { label: "Shipped",        value: orders.filter(o => o.status === "shipped").length,                          color: "text-purple-600" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-6 overflow-x-auto">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition capitalize ${
                filter === tab
                  ? "bg-brand-orange text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const cfg     = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const date    = new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
              const shortId = order.id.slice(0, 8).toUpperCase();
              const itemsSummary = order.order_items.map(i => `${i.quantity}× ${i.name}`).join(", ");

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
                  <div className="flex items-center gap-4 px-5 py-4">

                    {/* Order info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-bold text-gray-900">#{shortId}</p>
                        <span
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-400">{date}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium truncate">{order.shipping_name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{itemsSummary}</p>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">£{order.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">
                          {order.delivery_method === "express" ? "⚡ Express" : "📦 Standard"}
                        </p>
                      </div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center gap-1 bg-gray-50 hover:bg-orange-50 hover:text-brand-orange text-gray-600 text-sm font-semibold px-3 py-2 rounded-xl transition"
                      >
                        View
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

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
