import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import PageHero from "@/components/PageHero";

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
    name: "TruePrints",
    tagline: "Print With Purpose",
    href: "/shop/trueprints",
    bg: "#F5F0FF",
    accent: "#6B21A8",
    emoji: "🖼️",
  },
];

const featuredProducts = [
  { id: 1, name: "Diwali Pooja Thali Set", price: "£24.99", category: "Pooja", badge: "Bestseller" },
  { id: 2, name: "Ayurvedic Face Cream", price: "£14.99", category: "Cosmetics", badge: "New" },
  { id: 3, name: "Bhagavad Gita (English)", price: "£12.99", category: "Books", badge: null },
  { id: 4, name: "Holi Colour Set", price: "£9.99", category: "Festivals", badge: "Trending" },
];

const recentlySold = [
  { id: 1, name: "Panchmasi Rakhi Set", price: "£8.99", category: "Festivals", time: "2 hours ago" },
  { id: 2, name: "Sandalwood Agarbatti", price: "£4.99", category: "Pooja", time: "3 hours ago" },
  { id: 3, name: "Kumkum & Haldi Set", price: "£6.99", category: "Pooja", time: "5 hours ago" },
  { id: 4, name: "Ramayana (Illustrated)", price: "£16.99", category: "Books", time: "6 hours ago" },
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

const blogs = [
  {
    title: "How to Set Up a Pooja Space at Home in the UK",
    excerpt: "Creating a sacred corner in your home doesn't require a lot of space. Here's how to do it beautifully.",
    date: "March 5, 2025",
    category: "Traditions",
    emoji: "🪔",
  },
  {
    title: "Top 10 Holi Gifts to Send Your Loved Ones This Year",
    excerpt: "From colour sets to sweets, we've curated the best Holi gifts you can order online in the UK.",
    date: "February 28, 2025",
    category: "Festivals",
    emoji: "🎨",
  },
  {
    title: "5 Ayurvedic Beauty Products Every Woman Should Try",
    excerpt: "Natural, time-tested beauty secrets from India that are taking the UK wellness market by storm.",
    date: "February 20, 2025",
    category: "Cosmetics",
    emoji: "✨",
  },
];

export default function Home() {
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
                  src="https://www.truemart.co.uk/web/image/2504-6650acb9/Image%201.webp"
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
                <p className="text-xs text-brand-orange font-semibold">Rakhi 2025</p>
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

      {/* Recently Sold */}
      <section className="bg-white py-12 border-y border-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🛍️ Just Sold at TrueMart</h2>
              <p className="text-gray-500 text-sm mt-1">Curious what others are buying? Your next favourite might be here.</p>
            </div>
            <Link href="/shop" className="text-brand-orange text-sm font-semibold hover:underline">See all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlySold.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="h-32 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-4xl">🛍️</span>
                </div>
                <p className="text-xs text-brand-orange font-semibold mb-1">{item.category}</p>
                <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{item.price}</span>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
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

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-500">Handpicked favourites from our collection</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center relative">
                <span className="text-5xl">🛍️</span>
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-brand-orange font-semibold mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  <button className="bg-brand-orange text-white text-xs px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
            <p className="text-gray-500">Real reviews from the TrueMart community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-brand-orange text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-brand-orange font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">Purchased: {t.product}</p>
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
          <Link href="/blog" className="text-brand-orange text-sm font-semibold hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog.title} href="/blog"
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                <span className="text-6xl">{blog.emoji}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-orange-100 text-brand-orange px-2 py-0.5 rounded-full font-semibold">{blog.category}</span>
                  <span className="text-xs text-gray-400">{blog.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug group-hover:text-brand-orange transition-colors">{blog.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{blog.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-brand-orange text-sm font-semibold tracking-widest uppercase mb-2">Stay Connected</p>
          <h2 className="text-3xl font-bold text-white mb-3">Get Festival Updates & Offers</h2>
          <p className="text-gray-400 mb-2">Subscribe and get <span className="text-brand-orange font-semibold">10% off</span> your first order.</p>
          <p className="text-gray-500 text-xs mb-6">New arrivals, festive inspiration and exclusive deals — straight to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <button className="bg-brand-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-3">No spam, unsubscribe anytime. See our Privacy Policy.</p>
        </div>
      </section>

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
