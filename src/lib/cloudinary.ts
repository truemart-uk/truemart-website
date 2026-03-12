// src/lib/cloudinary.ts
// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary URL builder + helpers for TrueMart
//
// STORAGE CONVENTION:
//   Supabase images[] stores PUBLIC IDs only, e.g.:
//     "truemart/books/bhagavad-gita-as-it-is/main"
//     "truemart/books/bhagavad-gita-as-it-is/gallery-1"
//
//   Full URLs (starting with https://) are treated as legacy/external
//   and returned as-is (used for current Odoo product images).
// ─────────────────────────────────────────────────────────────────────────────

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const BASE_URL   = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// ── TRANSFORMATION PRESETS ───────────────────────────────────────────────────

export const TRANSFORMS = {
  // Product card thumbnail — 480×480, cropped to fit, auto WebP, quality 80
  card: "w_480,h_480,c_pad,b_white,f_auto,q_80",

  // Product detail page — main large image
  detail: "w_800,h_800,c_pad,b_white,f_auto,q_85",

  // Product detail gallery thumbnails
  thumb: "w_120,h_120,c_pad,b_white,f_auto,q_75",

  // Homepage featured / hero banners
  hero: "w_1200,h_600,c_fill,f_auto,q_85",

  // OG / social share image
  og: "w_1200,h_630,c_fill,f_auto,q_85",
} as const;

export type TransformKey = keyof typeof TRANSFORMS;

// ── CORE URL BUILDER ─────────────────────────────────────────────────────────

/**
 * Build an optimised Cloudinary URL from a public ID or legacy URL.
 *
 * @param src       - Cloudinary public ID or full external URL
 * @param transform - Preset name from TRANSFORMS (default: "card")
 * @returns         - Full optimised image URL
 */
export function cloudinaryUrl(
  src: string | null | undefined,
  transform: TransformKey = "card"
): string {
  if (!src) return "";

  // Legacy / external URL — return as-is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Cloudinary public ID
  return `${BASE_URL}/${TRANSFORMS[transform]}/${src}`;
}

/**
 * Returns the main (first) image URL for a product, optimised for cards.
 */
export function productCardImage(images: string[]): string {
  return cloudinaryUrl(images?.[0], "card");
}

/**
 * Returns all images for a product detail page.
 * First image uses "detail" transform, rest use "thumb".
 */
export function productDetailImages(images: string[]): {
  main: string;
  thumbs: string[];
} {
  if (!images?.length) return { main: "", thumbs: [] };
  return {
    main:   cloudinaryUrl(images[0], "detail"),
    thumbs: images.slice(1).map((src) => cloudinaryUrl(src, "thumb")),
  };
}

/**
 * Build a Cloudinary public ID from category slug + product slug + image name.
 * e.g. publicId("books", "bhagavad-gita-as-it-is", "main")
 *   → "truemart/books/bhagavad-gita-as-it-is/main"
 */
export function publicId(
  categorySlug: string,
  productSlug: string,
  imageName: "main" | `gallery-${number}`
): string {
  return `truemart/${categorySlug}/${productSlug}/${imageName}`;
}
