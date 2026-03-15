import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BlogPostClient from "@/components/BlogPostClient";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category: string;
  tags: string[];
  author_name: string;
  published_at: string;
  reading_time_minutes: number;
  meta_title?: string;
  meta_description?: string;
  view_count: number;
  blog_related_products: {
    display_order: number;
    products: {
      id: string;
      name: string;
      slug: string;
      price: number;
      images: string[];
      badge?: string;
      stock_qty: number;
      delivery_included: boolean;
    };
  }[];
};

type BlogComment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { full_name: string } | null;
};

// ── SEO metadata ──────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase  = await createClient();
  const { data }  = await supabase
    .from("blogs")
    .select("title, excerpt, meta_title, meta_description")
    .eq("slug", slug)
    .single();

  if (!data) return {};

  return {
    title:       data.meta_title ?? data.title,
    description: data.meta_description ?? data.excerpt,
  };
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase  = await createClient();

  const { data: blog } = await supabase
    .from("blogs")
    .select(`
      *,
      blog_related_products(
        display_order,
        products(id, name, slug, price, images, badge, stock_qty, delivery_included)
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!blog) notFound();

  // Fetch approved comments with author name
  const { data: comments } = await supabase
    .from("blog_comments")
    .select("id, content, created_at, user_id, profiles(full_name)")
    .eq("blog_id", blog.id)
    .order("created_at", { ascending: true });

  // Related posts — same category, exclude current
  const { data: relatedPosts } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, category, published_at, reading_time_minutes")
    .eq("is_published", true)
    .eq("category", blog.category)
    .neq("slug", slug)
    .limit(3);

  // Sort related products by display_order
  const relatedProducts = (blog.blog_related_products ?? [])
    .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
    .map((r: { products: unknown }) => r.products);

  return (
    <BlogPostClient
      blog={blog as Blog}
      comments={(comments as BlogComment[]) ?? []}
      relatedPosts={relatedPosts ?? []}
      relatedProducts={relatedProducts}
    />
  );
}
