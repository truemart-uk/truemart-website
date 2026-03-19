"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name (A–Z)", value: "name_asc" },
];

export default function BooksPage() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "books")
        .single();

      if (!cat) { setLoading(false); return; }

      const { data } = await supabase
        .from("products")
        .select("id, name, slug, short_description, price, compare_at_price, images, badge, tags, is_featured, stock_qty, rating, review_count, delivery_included")
        .eq("is_published", true)
        .eq("category_id", cat.id);

      if (data) setProducts(data);
      setLoading(false);
    }
    fetchBooks();
  }, []);


  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = products
    .filter((p: ProductCardData) =>
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });

  return (

      <main className="min-h-screen bg-[#FAFAF8]">
      {/* ── CONTENT ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-10">

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
                <div className="h-64 bg-gradient-to-b from-orange-50 to-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-lg w-full" />
                  <div className="h-3 bg-gray-100 rounded-lg w-5/6" />
                  <div className="h-9 bg-gray-100 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600 text-lg font-medium">No books found{search && ` for "${search}"`}</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-5 px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Bottom trust strip */}
        {!loading && filtered.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400 border-t border-gray-100 pt-8">
            {["✅ Authentic Gita Press titles", "📦 Free delivery over £25", "🔄 Easy returns", "🇬🇧 UK-based store"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
      </div>
  </main>
  );
}
