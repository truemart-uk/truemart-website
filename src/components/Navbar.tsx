"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { SITE } from "@/lib/site";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { user, loading, signOut, isRecoverySession, role } = useAuth();
  const { totalWishlisted } = useWishlist();

  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    setAccountOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  }

  // First letter of name or email for avatar
  const avatarLetter = user
    ? (user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()
    : "";

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

              {/* Account — Guest (also shown during password recovery) */}
              {!loading && (!user || isRecoverySession) && (
                <Link
                  href="/account/login"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign In
                </Link>
              )}

              {/* Account — Logged In (hidden during password recovery) */}
              {!loading && user && !isRecoverySession && (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setAccountOpen(prev => !prev)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors"
                    aria-expanded={accountOpen}
                    aria-haspopup="true"
                  >
                    <span className="w-7 h-7 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {avatarLetter}
                    </span>
                    <span className="max-w-[100px] truncate">
                      {user.user_metadata?.full_name?.split(" ")[0] || "Account"}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${accountOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.user_metadata?.full_name || "My Account"}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      <Link href="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Account
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                      </Link>
                      <Link href="/account/addresses" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Addresses
                      </Link>

                      <div className="border-t border-gray-50 mt-1">
                        {/* Role-specific account link */}
                        {role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-orange hover:bg-orange-50 font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin Account
                          </Link>
                        )}
                        {role === 'staff' && (
                          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-orange hover:bg-orange-50 font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Staff Account
                          </Link>
                        )}
                        {role === 'vendor' && (
                          <Link href="/vendor" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-orange hover:bg-orange-50 font-semibold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Vendor Account
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-50 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist */}
              <Link href="/account/wishlist" aria-label="Wishlist" className="relative p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {totalWishlisted > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalWishlisted}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={openCart} aria-label="View cart" className="relative flex items-center gap-2 bg-brand-orange text-white pl-3 pr-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors ml-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Cart</span>
                <span className="bg-white text-brand-orange text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>
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
              { label: "Panchmasi Rakhi", href: "/shop/panchmasi", icon: "🧵" },
              { label: "About Us", href: "/about", icon: null },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 px-2 h-full text-sm font-semibold transition-colors whitespace-nowrap border-b-2 
                  ${pathname === item.href
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
