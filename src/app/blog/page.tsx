import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  category: string;
  tags: string[];
  author_name: string;
  published_at: string;
  reading_time_minutes: number;
  is_featured: boolean;
};

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "Festivals":  { bg: "#FFF7ED", color: "#EA580C" },
  "Traditions": { bg: "#FEF3C7", color: "#B45309" },
  "Our Story":  { bg: "#F0FDF4", color: "#15803D" },
  "Lifestyle":  { bg: "#EFF6FF", color: "#1D4ED8" },
  "Wellness":   { bg: "#FDF4FF", color: "#7E22CE" },
  "General":    { bg: "#F9FAFB", color: "#374151" },
};

function categoryStyle(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS["General"];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, category, tags, author_name, published_at, reading_time_minutes, is_featured")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data: blogs } = await query;
  const allPosts = (blogs as Blog[]) ?? [];

  // Get all unique categories for filter tabs
  const { data: catData } = await supabase
    .from("blogs")
    .select("category")
    .eq("is_published", true);
  const categories = [...new Set((catData ?? []).map(r => r.category))].sort();

  // Featured post = most recent featured, or just most recent
  const featured = allPosts.find(b => b.is_featured) ?? allPosts[0];
  const rest      = allPosts.filter(b => b.id !== featured?.id);

  return (
    <div className="bg-background min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <p className="text-xs text-brand-orange font-bold uppercase tracking-widest mb-2">TrueBlogs</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Stories, Traditions & Culture</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Festivals, rituals, recipes and the rich tapestry of our life.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Category filter tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-10">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                !category
                  ? "bg-brand-orange text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange"
              }`}
            >
              All
            </Link>
            {categories.map(cat => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  category === cat
                    ? "bg-brand-orange text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {allPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-gray-500">No posts found in this category.</p>
            <Link href="/blog" className="text-brand-orange font-semibold mt-3 inline-block hover:underline">
              View all posts →
            </Link>
          </div>
        )}

        {/* Featured post */}
        {featured && !category && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-12">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Cover image */}
                <div className="h-64 md:h-auto bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
                  {featured.cover_image ? (
                    <img
                      src={`https://res.cloudinary.com/truemart/image/upload/w_600,h_400,c_fill,f_auto,q_80/${featured.cover_image}`}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-8xl opacity-30">📖</span>
                  )}
                </div>
                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: categoryStyle(featured.category).bg, color: categoryStyle(featured.category).color }}
                    >
                      {featured.category}
                    </span>
                    <span className="text-xs bg-brand-orange text-white font-bold px-3 py-1 rounded-full">Featured</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-brand-orange transition leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{featured.author_name}</span>
                    <span>·</span>
                    <span>{formatDate(featured.published_at)}</span>
                    <span>·</span>
                    <span>{featured.reading_time_minutes} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Posts grid */}
        {(category ? allPosts : rest).length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(category ? allPosts : rest).map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition h-full flex flex-col">
                  {/* Cover */}
                  <div className="h-44 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center flex-shrink-0">
                    {post.cover_image ? (
                      <img
                        src={`https://res.cloudinary.com/truemart/image/upload/w_400,h_250,c_fill,f_auto,q_80/${post.cover_image}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl opacity-20">📖</span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full w-fit mb-3"
                      style={{ background: categoryStyle(post.category).bg, color: categoryStyle(post.category).color }}
                    >
                      {post.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-brand-orange transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                      <span>{formatDate(post.published_at)}</span>
                      <span>·</span>
                      <span>{post.reading_time_minutes} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
