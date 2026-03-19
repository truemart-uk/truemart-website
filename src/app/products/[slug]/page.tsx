import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductPageClient from "@/components/ProductPageClient";
import Link from "next/link";

type Variant = {
  id: string; type: string; value: string; label: string | null;
  price: number | null; compare_at_price: number | null;
  stock_qty: number; is_default: boolean; display_order: number; images: string[] | null;
};

type Product = {
  id: string; name: string; slug: string; short_description: string | null;
  description: string | null; price: number; compare_at_price: number | null;
  images: string[]; badge: string | null; tags: string[];
  stock_qty: number; track_stock: boolean; low_stock_threshold: number;
  rating: number | null; review_count: number | null; delivery_included: boolean;
  category_name: string; category_slug: string; variants: Variant[];
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("name, short_description").eq("slug", slug).single();
  if (!data) return {};
  return { title: `${data.name} | TrueMart`, description: data.short_description ?? "" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(`
      id, name, slug, short_description, description,
      price, compare_at_price, images, badge, tags,
      stock_qty, track_stock, low_stock_threshold,
      rating, review_count, delivery_included,
      category_id,
      categories!inner(name, slug),
      product_variants(id, type, value, label, price, compare_at_price, stock_qty, is_default, display_order, images)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!product) notFound();

  // Related products
  const { data: related } = await supabase
    .from("products")
    .select(`id, name, slug, price, compare_at_price, images, badge, stock_qty, delivery_included, rating, product_variants(id, price, is_default, stock_qty)`)
    .eq("category_id", (product as unknown as { category_id: string }).category_id)
    .eq("is_published", true)
    .neq("slug", slug)
    .limit(4);

  // Reviews
  // Reviews — SECURITY DEFINER function bypasses RLS to get real customer names
  const { data: reviews } = await supabase.rpc('get_product_reviews', { p_product_id: product.id });

  const category = (product as unknown as { categories: { name: string; slug: string } }).categories;
  const variants = ((product as unknown as { product_variants: Variant[] }).product_variants ?? [])
    .sort((a, b) => a.display_order - b.display_order);

  const enrichedProduct: Product = {
    ...product,
    price: Number(product.price),
    compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
    category_name: category.name,
    category_slug: category.slug,
    variants,
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand-orange transition">Home</Link>
          <span>/</span>
          <Link href={`/shop/${enrichedProduct.category_slug}`} className="hover:text-brand-orange transition capitalize">
            {enrichedProduct.category_name}
          </Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{enrichedProduct.name}</span>
        </nav>
      </div>
      <ProductPageClient
        product={enrichedProduct}
        relatedProducts={related ?? []}
        initialReviews={(reviews as unknown as Parameters<typeof ProductPageClient>[0]["initialReviews"]) ?? []}
      />
    </div>
  );
}
