"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-orange text-white text-center py-2 text-sm font-medium tracking-wide">
        🇬🇧 Free UK delivery on orders over {SITE.delivery.freeThresholdDisplay} &nbsp;|&nbsp; Authentic Indian products delivered to your door
      </div>

      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50">
        {/* Main Nav Row */}
        <div className="border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 bg-brand-orange px-4 py-2 rounded-lg">
              <Image src="/truemart_logo.png" alt="TrueMart" width={35} height={35} className="object-contain h-8 w-8" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold tracking-tight text-black">TRUEMART</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 hover:border-brand-orange transition-colors focus-within:border-brand-orange focus-within:ring-1 focus-within:ring-orange-200">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products, festivals, books..."
                aria-label="Search products"
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Sign In */}
              <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In
              </button>

              {/* Wishlist */}
              <button aria-label="Wishlist" className="relative p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Cart */}
              <button aria-label="View cart" className="relative flex items-center gap-2 bg-brand-orange text-white pl-3 pr-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors ml-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Cart</span>
                <span className="bg-white text-brand-orange text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Nav Row */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 h-10 flex items-center gap-0">
            {[
              { label: "Home", href: "/", icon: "🏠" },
              { label: "All Products", href: "/shop", icon: "✦" },
              { label: "Books", href: "/shop/books", icon: "📚" },
              { label: "Pooja Essentials", href: "/shop/pooja", icon: "🪔" },
              { label: "Cosmetics", href: "/shop/cosmetics", icon: "✨" },
              { label: "Festivals", href: "/shop/festivals", icon: "🎉", highlight: true },
              { label: "Panchmasi Rakhi", href: "/shop/rakhi", icon: "🧵" },
              { label: "About Us", href: "/about", icon: null },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 px-2 h-full text-sm font-semibold transition-colors whitespace-nowrap border-b-2 
                  ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-brand-orange border-brand-orange"
                    : "text-gray-600 border-transparent hover:text-brand-orange hover:border-orange-200"
                  }`}
              >
                {item.icon && <span className="text-xs">{item.icon}</span>}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
