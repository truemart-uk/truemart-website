import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import NewsletterSection from "@/components/NewsletterSection";

const categories = [
  {
    name: "Books",
    tagline: "Read. Reflect. Connect",
    href: "/shop/books",
    bg: "#FFF7ED",
    accent: "var(--color-primary)",
    emoji: "📚",
  },
  {
    name: "Pooja Essentials",
    tagline: "Sacred & Pure",
    href: "/shop/pooja",
    bg: "#FFF0F0",
    accent: "var(--color-secondary)",
    emoji: "🪔",
  },
  {
    name: "Cosmetics",
    tagline: "Natural. Pure. Beautiful",
    href: "/shop/cosmetics",
    bg: "#F0FFF4",
    accent: "var(--color-accent)",
    emoji: "✨",
  },
  {
    name: "Festivals",
    tagline: "Celebrate Every Moment",
    href: "/shop/festivals",
    bg: "#FFFBEB",
    accent: "var(--color-primary)",
    emoji: "🎉",
  },
  {
    name: "Panchmasi Rakhi",
    tagline: "Five Months, One Bond",
    href: "/shop/panchmasi",
    bg: "#F5F0FF",
    accent: "#6B21A8",
    emoji: "🧵",
  },
];

const testimonials = [
  {
    name: "Anuj Pattni",
    review: "Very well made Panchmasi Rakhi. Delivery was excellent and packaged very carefully. I will buy again from TrueMart!",
    rating: 5,
    product: "Panchmasi Rakhi",
  },
  {
    name: "Rahul Chitkara",
    review: "I recently purchased Rakhis and the product is really awesome. Price is really good. TrueMart provided kumkum and rice with Rakhi — that's a really nice touch!",
    rating: 5,
    product: "Rakhi Set",
  },
  {
    name: "Priya Sharma",
    review: "Love the range of pooja essentials. Everything arrived well packaged and exactly as described. Will definitely be a regular customer!",
    rating: 5,
    product: "Pooja Thali Set",
  },
];

export default async function Home() {
  const supabase = await createClient();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select(`
      id, name, slug, short_description, price, compare_at_price,
      images, badge, stock_qty, rating, review_count,
      is_featured, delivery_included, tags,
      product_variants(id, type, value, label, price, compare_at_price, stock_qty, is_default, display_order, images)
    `)
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("name");

  // Fetch most recently ordered items for "Just Sold" section
  const { data: recentOrderItems } = await supabase
    .from("order_items")
    .select("name, variant_label, unit_price, image, slug, created_at")
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch latest 3 approved product reviews with reviewer name and product
  const { data: latestReviews } = await supabase.rpc("get_homepage_reviews");

  function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 3600)  return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  const recentlySold = (recentOrderItems ?? []).map(item => ({
    name:     item.name,
    category: item.variant_label ?? "",
    price:    `£${Number(item.unit_price).toFixed(2)}`,
    image:    item.image ?? null,
    slug:     item.slug,
    time:     timeAgo(new Date(item.created_at)),
  }));

  // Fetch latest 3 published blog posts for homepage
  const { data: latestBlogs } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, category, published_at, reading_time_minutes")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-background">

            {/* Hero Section */}
      <PageHero className="min-h-[560px] flex items-center">

        <div className="relative max-w-6xl mx-auto px-6 py-16 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* Left — Text Content */}
            <div className="text-left order-2 md:order-1">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-600 tracking-wide">🎀 Raksha Bandhan Collection</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.15] mb-4">
                Celebrate the
                <span className="relative inline-block mx-2">
                  <span className="relative z-10 text-brand-orange">Bond</span>
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-orange-100 -z-0 rounded"></span>
                </span>
                of
                <br />
                a Lifetime
              </h1>

              {/* Subtext */}
              <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
                Beautifully crafted Rakhis, thoughtful gifts and festive essentials — delivered across the UK in time for the celebrations.
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-6 mb-8">
                {[
                  { value: "500+", label: "Happy Customers" },
                  { value: "4.9★", label: "Avg. Rating" },
                  { value: "UK", label: "Wide Delivery" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <a href="/shop/rakhi" className="inline-flex items-center gap-2 bg-brand-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-500 transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5">
                  Shop Raksha Bandhan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a href="/shop" className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-7 py-3.5 rounded-full font-bold text-sm hover:border-brand-orange hover:text-brand-orange transition-all">
                  View All Products
                </a>
              </div>

              {/* Trust strip */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-orange-100">
                {[
                  { icon: "🚚", text: `Free delivery over ${SITE.delivery.freeThresholdDisplay}` },
                  { icon: "✅", text: "100% Authentic" },
                  { icon: "🔒", text: "Secure checkout" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-1.5">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs text-gray-500 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Image */}
            <div className="relative order-1 md:order-2 flex justify-center overflow-hidden">

              {/* Decorative ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full border-2 border-dashed border-orange-200 animate-spin" style={{ animationDuration: "20s" }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-orange-100 to-red-50" />
              </div>

              {/* Main image */}
              <div className="relative z-10 w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden shadow-2xl shadow-orange-200 border-4 border-white">
                <Image
                  src=""
                  alt="Raksha Bandhan collection at TrueMart"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 288px, 320px"
                />
              </div>

              {/* Floating badge — top right */}
              <div className="absolute top-4 right-4 z-20 bg-white rounded-2xl shadow-lg px-3 py-2 border border-orange-100">
                <p className="text-xs font-bold text-gray-900">🎀 New Arrivals</p>
                <p className="text-xs text-brand-orange font-semibold">Rakhi 2026</p>
              </div>

              {/* Floating badge — bottom left */}
              <div className="absolute bottom-6 left-2 z-20 bg-brand-orange rounded-2xl shadow-lg px-3 py-2">
                <p className="text-xs font-bold text-white">⭐ 4.9/5 Rating</p>
                <p className="text-xs text-orange-100">From 500+ reviews</p>
              </div>

            </div>
          </div>
        </div>
      </PageHero>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-500">Everything you need for home, faith and celebration</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href}
              className="group rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-orange-100"
              style={{ backgroundColor: cat.bg }}>
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-500">{cat.tagline}</p>
              <div className="mt-3 text-xs font-semibold transition-colors" style={{ color: cat.accent }}>Shop →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-500">Handpicked favourites from our collection</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(featuredProducts ?? []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Festival Banner */}
      <section className="mx-6 md:mx-auto max-w-7xl my-16">
        <div className="bg-gradient-to-r from-brand-orange to-brand-red rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
          <div className="relative">
            <p className="text-orange-200 text-sm font-semibold tracking-widest uppercase mb-2">🎨 Coming Soon</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-3">Holi is Around the Corner!</h2>
            <p className="text-orange-100 text-lg mb-6 max-w-xl mx-auto">
              Get your colours, sweets and celebration essentials delivered across the UK in time for the festival.
            </p>
            <Link href="/shop/festivals" className="inline-block bg-white text-brand-orange px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg">
              Shop Holi Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Sold */}
      {recentlySold.length > 0 && (
      <section className="bg-white py-12 border-y border-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🛍️ Just Sold at TrueMart</h2>
              <p className="text-gray-500 text-sm mt-1">Curious what others are buying? Your next favourite might be here.</p>
            </div>
            <Link href="/shop" className="text-brand-orange text-sm font-semibold hover:underline">Explore the shop →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlySold.map((item, i) => (
              <Link key={i} href={`/products/${item.slug}`} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5 block">
                <div className="h-32 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                  {item.image ? (
                    <img
                      src={`https://res.cloudinary.com/truemart/image/upload/w_200,h_200,c_pad,b_white,f_auto,q_80/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-4xl">🛍️</span>
                  )}
                </div>
                {item.category && <p className="text-xs text-brand-orange font-semibold mb-1">{item.category}</p>}
                <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{item.price}</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Testimonials */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
            <p className="text-gray-500">Real reviews from the TrueMart community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(latestReviews && latestReviews.length > 0 ? latestReviews : testimonials.map(t => ({
              full_name: t.name,
              rating: t.rating,
              content: t.review,
              product_name: t.product,
              product_slug: null,
              title: null,
            }))).map((r: {
              full_name: string;
              rating: number;
              content: string;
              product_name: string;
              product_slug: string | null;
              title: string | null;
            }, i: number) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50">
                <div className="flex mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <span key={j} style={{ color: j < r.rating ? "#FB923C" : "#D1D5DB", fontSize: "18px" }}>★</span>
                  ))}
                </div>
                {r.title && <p className="font-semibold text-gray-900 text-sm mb-1">{r.title}</p>}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4" style={{wordBreak:"break-word"}}>"{r.content}"</p>

                <div className="flex items-center gap-1 mb-3">
  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
  <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
</div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-brand-orange font-bold text-sm">
                    {r.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{r.full_name}</p>
                    {r.product_slug ? (
                      <Link href={`/products/${r.product_slug}`} className="text-xs text-brand-orange hover:underline">
                        {r.product_name}
                      </Link>
                    ) : (
                      <p className="text-xs text-gray-400">{r.product_name}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">📝 TrueBlogs</h2>
            <p className="text-gray-500 text-sm mt-1">Festivals, traditions, lifestyle and more</p>
          </div>
          <Link href="/blog" className="text-brand-orange text-sm font-semibold hover:underline">Explore the Stories →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(latestBlogs ?? []).map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center overflow-hidden">
                {blog.cover_image ? (
                  <img
                    src={`https://res.cloudinary.com/truemart/image/upload/w_400,h_200,c_fill,f_auto,q_80/${blog.cover_image}`}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl opacity-20">📖</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-orange-100 text-brand-orange px-2 py-0.5 rounded-full font-semibold">{blog.category}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(blog.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{blog.excerpt}</p>
                <p className="text-xs text-brand-orange font-semibold mt-3">{blog.reading_time_minutes} min read →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />

      {/* Trust Badges */}
      <section className="bg-white border-t border-orange-50 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🚚", title: "Free UK Delivery", desc: `On orders over ${SITE.delivery.freeThresholdDisplay}` },
            { icon: "✅", title: "100% Authentic", desc: "Genuine Indian products" },
            { icon: "🔒", title: "Secure Payments", desc: "Powered by Stripe" },
            { icon: "💬", title: "UK Based Support", desc: SITE.contact.email },
          ].map((badge) => (
            <div key={badge.title} className="flex flex-col items-center">
              <span className="text-3xl mb-2">{badge.icon}</span>
              <h4 className="font-bold text-gray-900 text-sm">{badge.title}</h4>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
