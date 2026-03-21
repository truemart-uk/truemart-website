"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { cloudinaryUrl } from "@/lib/cloudinary";
import AdminProductsTab from "@/components/AdminProductsTab";

// ── TYPES ─────────────────────────────────────────────────────────────────────

type Order = {
  id: string;
  status: string;
  total: number;
  delivery_method: string;
  created_at: string;
  shipping_name: string;
  order_items: { name: string; quantity: number; image?: string }[];
};

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
};

// ── STATUS CONFIG ─────────────────────────────────────────────────────────────

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

// ── DASHBOARD TAB ─────────────────────────────────────────────────────────────

function DashboardTab({ stats, recentOrders }: { stats: Stats; recentOrders: Order[] }) {
  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",  value: `£${stats.totalRevenue.toFixed(2)}`, color: "text-brand-orange", big: true },
          { label: "Total Orders",   value: stats.totalOrders,   color: "text-gray-900" },
          { label: "Processing",     value: stats.processingOrders, color: "text-blue-600" },
          { label: "Shipped",        value: stats.shippedOrders, color: "text-purple-600" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 mb-1.5">{stat.label}</p>
            <p className={`font-bold ${stat.color} ${stat.big ? "text-2xl" : "text-3xl"}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Second stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending",   value: stats.pendingOrders,   color: "text-yellow-600" },
          { label: "Delivered", value: stats.deliveredOrders, color: "text-green-600" },
          { label: "Active",    value: stats.processingOrders + stats.shippedOrders, color: "text-gray-900" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent orders</h2>
          <span className="text-xs text-gray-400">Last 5</span>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">No orders yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map(order => {
              const cfg     = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const shortId = order.id.slice(0, 8).toUpperCase();
              const date    = new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
              return (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">#{shortId}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: cfg.color, background: cfg.bg }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{order.shipping_name} · {date}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">£{order.total.toFixed(2)}</p>
                  <Link href={`/admin/orders/${order.id}`} className="text-xs text-brand-orange font-semibold hover:underline">
                    View →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ORDERS TAB ────────────────────────────────────────────────────────────────

function OrdersTab({ orders, role }: { orders: Order[]; role: string | null }) {
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts   = FILTER_TABS.reduce((acc, tab) => {
    acc[tab] = tab === "all" ? orders.length : orders.filter(o => o.status === tab).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 overflow-x-auto">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition capitalize ${
              filter === tab ? "bg-brand-orange text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
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
            const shortId = order.id.slice(0, 8).toUpperCase();
            const date    = new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
            const summary = order.order_items.map(i => `${i.quantity}× ${i.name}`).join(", ");

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-bold text-gray-900">#{shortId}</p>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ color: cfg.color, background: cfg.bg }}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-400">{date}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium truncate">{order.shipping_name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{summary}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">£{order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{order.delivery_method === "express" ? "⚡ Express" : "📦 Standard"}</p>
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
  );
}

// ── ANALYTICS TAB ─────────────────────────────────────────────────────────────

function AnalyticsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Analytics coming soon</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Google Analytics 4 will be integrated here — visitor counts, traffic sources, top pages, countries, and conversion data.
        </p>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

type Tab = "dashboard" | "orders" | "analytics" | "products";

function AdminContent() {
  const { user, loading: authLoading, role } = useAuth();
  const router      = useRouter();
  const searchParams = useSearchParams();
  const tabParam    = searchParams.get("tab") as Tab | null;

  const [activeTab, setActiveTab] = useState<Tab>(tabParam ?? (role === "staff" ? "orders" : "dashboard"));
  const [orders, setOrders]       = useState<Order[]>([]);
  const [stats, setStats]         = useState<Stats>({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, processingOrders: 0, shippedOrders: 0, deliveredOrders: 0 });
  const [loading, setLoading]     = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) router.push("/account/login");
    if (!authLoading && role && !["admin", "staff"].includes(role)) router.push("/");
  }, [user, authLoading, role]);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  // Staff only sees orders tab
  useEffect(() => {
    if (role === "staff") setActiveTab("orders");
  }, [role]);

  async function fetchData() {
    const { data } = await supabase
      .from("orders")
      .select("id, status, total, delivery_method, created_at, shipping_name, order_items(name, quantity, image)")
      .order("created_at", { ascending: false });

    const all = (data as Order[]) ?? [];
    setOrders(all);

    const active = all.filter(o => !["cancelled", "refunded"].includes(o.status));
    setStats({
      totalRevenue:     active.reduce((s, o) => s + o.total, 0),
      totalOrders:      all.length,
      pendingOrders:    all.filter(o => o.status === "pending").length,
      processingOrders: all.filter(o => o.status === "processing").length,
      shippedOrders:    all.filter(o => o.status === "shipped").length,
      deliveredOrders:  all.filter(o => o.status === "delivered").length,
    });
    setLoading(false);
  }

  function setTab(tab: Tab) {
    setActiveTab(tab);
    router.replace(`/admin?tab=${tab}`, { scroll: false });
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

  const isAdmin = role === "admin";
  const recentOrders = orders.slice(0, 5);

  // Tabs visible per role
  const tabs: { id: Tab; label: string; icon: string }[] = [
    ...(isAdmin ? [{ id: "dashboard" as Tab, label: "Dashboard", icon: "📊" }] : []),
    { id: "orders" as Tab, label: "Orders", icon: "📦" },
    ...(isAdmin ? [{ id: "analytics" as Tab, label: "Analytics", icon: "📈" }] : []),
    { id: "products" as Tab, label: "Products", icon: "🛍️" },
  ];

  return (
    <div className="bg-background min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-brand-orange uppercase tracking-widest font-bold mb-1">
              {role === "admin" ? "Admin Account" : "Staff Account"}
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              {role === "admin" ? "Admin Dashboard" : "Staff Dashboard"}
            </h1>
          </div>
          <Link
            href="/account"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Account
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-6 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-brand-orange text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.id === "orders" && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "orders" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "dashboard" && isAdmin && (
          <DashboardTab stats={stats} recentOrders={recentOrders} />
        )}
        {activeTab === "orders" && (
          <OrdersTab orders={orders} role={role} />
        )}
        {activeTab === "analytics" && isAdmin && (
          <AnalyticsTab />
        )}
        {activeTab === "products" && (
          <AdminProductsTab />
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense>
      <AdminContent />
    </Suspense>
  );
}
