// src/lib/theme.ts
// ============================================================
// SINGLE SOURCE OF TRUTH for all TrueMart visual configuration.
// Change anything here and it updates across the entire site.
// ============================================================

export const THEME = {

  // ── Images ─────────────────────────────────────────────────
  images: {
    logo: "/truemart_logo.png",
    heroProduct: "https://www.truemart.co.uk/web/image/2504-6650acb9/Image%201.webp",
    // When migrating to Cloudinary, update these paths once here
  },

  // ── Hero Section (used on all pages via <PageHero>) ─────────
  hero: {
    backgroundColor: "#FFFAF5",         // warm ivory — change once, updates all heroes
    patternColor: "%23FB923C",          // URL-encoded brand orange for SVG
    patternOpacity: 0.15,               // 0 to disable pattern entirely
    glowOpacity: "0.07",
    // Pattern options: "mandala" | "dots" | "stars" | "none"
    pattern: "mandala" as "mandala" | "dots" | "stars" | "none",
  },

  // ── Gradients ───────────────────────────────────────────────
  gradients: {
    // CTA banners (contact, FAQs, return policy etc.)
    cta: "linear-gradient(135deg, #FB923C 0%, #C41E3A 100%)",
    // Festival/Holi banner on homepage
    festivalBanner: "linear-gradient(135deg, #f97316 0%, #ec4899 35%, #a855f7 65%, #3b82f6 100%)",
    // Free delivery banner on delivery page
    freeDelivery: "linear-gradient(135deg, #2D7A3A 0%, #16a34a 100%)",
  },

  // ── Footer ──────────────────────────────────────────────────
  footer: {
    backgroundColor: "#fff7ed",        // orange-50
    patternOpacity: 0.03,
  },

} as const;

// ── Pattern SVGs ─────────────────────────────────────────────
// Used by PageHero component — edit patterns here
export const PATTERNS = {
  mandala: (color: string) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='${color}' stroke-width='0.5' opacity='0.15'%3E%3Ccircle cx='40' cy='40' r='30'/%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3Ccircle cx='40' cy='40' r='10'/%3E%3Cline x1='40' y1='10' x2='40' y2='70'/%3E%3Cline x1='10' y1='40' x2='70' y2='40'/%3E%3Cline x1='18' y1='18' x2='62' y2='62'/%3E%3Cline x1='62' y1='18' x2='18' y2='62'/%3E%3Cellipse cx='40' cy='25' rx='5' ry='8'/%3E%3Cellipse cx='40' cy='55' rx='5' ry='8'/%3E%3Cellipse cx='25' cy='40' rx='8' ry='5'/%3E%3Cellipse cx='55' cy='40' rx='8' ry='5'/%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E")`,

  dots: (color: string) =>
    `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${color}' fill-opacity='0.15'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,

  stars: (color: string) =>
    `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${color}' fill-opacity='0.12'%3E%3Cpath d='M30 0 L35 20 L55 20 L40 32 L45 52 L30 42 L15 52 L20 32 L5 20 L25 20 Z'/%3E%3C/g%3E%3C/svg%3E")`,

  none: (_color: string) => "none",
};
