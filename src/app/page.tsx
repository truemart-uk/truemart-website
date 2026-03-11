import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Books",
    tagline: "Read. Reflect. Connect",
    href: "/shop/books",
    bg: "#FFF7ED",
    accent: "#FF6B00",
    emoji: "📚",
  },
  {
    name: "Pooja Essentials",
    tagline: "Sacred & Pure",
    href: "/shop/pooja",
    bg: "#FFF0F0",
    accent: "#C41E3A",
    emoji: "🪔",
  },
  {
    name: "Cosmetics",
    tagline: "Natural. Pure. Beautiful",
    href: "/shop/cosmetics",
    bg: "#F0FFF4",
    accent: "#2D7A3A",
    emoji: "✨",
  },
  {
    name: "Festivals",
    tagline: "Celebrate Every Moment",
    href: "/shop/festivals",
    bg: "#FFFBEB",
    accent: "#FF6B00",
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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Announcement Bar */}
      <div className="bg-[#FF6B00] text-white text-center py-2 text-sm font-medium tracking-wide">
        🇬🇧 Free UK delivery on orders over £40 &nbsp;|&nbsp; Authentic Indian products delivered to your door
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/">
            <Image src="/truemart_logo.png" alt="TrueMart" width={120} height={60} className="object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <Link href="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-[#FF6B00] transition-colors">Shop</Link>
            <Link href="/shop/festivals" className="hover:text-[#FF6B00] transition-colors">Festivals</Link>
            <Link href="/blog" className="hover:text-[#FF6B00] transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-[#FF6B00] transition-colors">About Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-[#FF6B00] transition-colors text-sm">Sign In</button>
            <button className="relative">
              <span className="text-2xl">🛒</span>
              <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FFF7ED] via-[#FFFBF5] to-[#FFF0F0] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B00' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-orange-100 text-[#FF6B00] text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
              🪔 Holi Festival Collection Now Live
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Bringing
              <span className="text-[#FF6B00]"> Traditions </span>
              Closer To You
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              Authentic Indian products — from sacred pooja essentials to festival gifts — delivered across the UK.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href="/shop" className="bg-[#FF6B00] text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors text-center shadow-lg shadow-orange-200">
                Shop Now
              </Link>
              <Link href="/shop/festivals" className="border-2 border-[#FF6B00] text-[#FF6B00] px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors text-center">
                Festival Collection
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-red-100 rounded-full opacity-40 blur-3xl" />
              <div className="relative w-full h-full flex items-center justify-center">
                <Image src="/truemart_logo.png" alt="TrueMart" width={320} height={320} className="object-contain drop-shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <div className="mt-3 text-xs font-semibold transition-colors" style={{ color: cat.accent }}>
                Shop →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Festival Banner */}
      <section className="mx-6 md:mx-auto max-w-7xl mb-16">
        <div className="bg-gradient-to-r from-[#FF6B00] to-[#C41E3A] rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
          <div className="relative">
            <p className="text-orange-200 text-sm font-semibold tracking-widest uppercase mb-2">🎨 Coming Soon</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-3">Holi is Around the Corner!</h2>
            <p className="text-orange-100 text-lg mb-6 max-w-xl mx-auto">
              Get your colours, sweets and celebration essentials delivered across the UK in time for the festival.
            </p>
            <Link href="/shop/festivals" className="inline-block bg-white text-[#FF6B00] px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg">
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
                  <span className="absolute top-3 left-3 bg-[#FF6B00] text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-[#FF6B00] font-semibold mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  <button className="bg-[#FF6B00] text-white text-xs px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-t border-orange-50 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🚚", title: "Free UK Delivery", desc: "On orders over £40" },
            { icon: "✅", title: "100% Authentic", desc: "Genuine Indian products" },
            { icon: "🔒", title: "Secure Payments", desc: "Powered by Stripe" },
            { icon: "💬", title: "UK Based Support", desc: "contact@truemart.co.uk" },
          ].map((badge) => (
            <div key={badge.title} className="flex flex-col items-center">
              <span className="text-3xl mb-2">{badge.icon}</span>
              <h4 className="font-bold text-gray-900 text-sm">{badge.title}</h4>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image src="/truemart_logo.png" alt="TrueMart" width={100} height={50} className="object-contain mb-3 brightness-0 invert" />
            <p className="text-sm text-gray-400 leading-relaxed">Bringing authentic Indian traditions closer to the South Asian community in the UK.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              {["Books", "Pooja Essentials", "Cosmetics", "Festivals", "TruePrints"].map(item => (
                <li key={item}><Link href="#" className="hover:text-[#FF6B00] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Help</h4>
            <ul className="space-y-2 text-sm">
              {["FAQs", "Return Policy", "Delivery Info", "Contact Us"].map(item => (
                <li key={item}><Link href="#" className="hover:text-[#FF6B00] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Contact</h4>
            <p className="text-sm text-gray-400 mb-1">📧 contact@truemart.co.uk</p>
            <p className="text-sm text-gray-400 mb-1">📞 +44 7442020454</p>
            <p className="text-sm text-gray-400">🇬🇧 United Kingdom</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2025 TrueMart. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="#" className="hover:text-[#FF6B00]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#FF6B00]">Terms of Service</Link>
            <Link href="#" className="hover:text-[#FF6B00]">Return Policy</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
