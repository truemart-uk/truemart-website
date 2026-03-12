// src/app/api/upload/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary upload endpoint
//
// POST /api/upload
// Body (multipart/form-data):
//   file          — the image file
//   categorySlug  — e.g. "books"
//   productSlug   — e.g. "bhagavad-gita-as-it-is"
//   imageName     — "main" | "gallery-1" | "gallery-2" etc.
//
// Returns: { publicId, url }
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export async function POST(req: NextRequest) {
  try {
    const formData     = await req.formData();
    const file         = formData.get("file") as File | null;
    const categorySlug = formData.get("categorySlug") as string | null;
    const productSlug  = formData.get("productSlug")  as string | null;
    const imageName    = formData.get("imageName")    as string | null;

    // ── Validate ──────────────────────────────────────────────────────────────
    if (!file)         return NextResponse.json({ error: "No file provided" },         { status: 400 });
    if (!categorySlug) return NextResponse.json({ error: "categorySlug is required" }, { status: 400 });
    if (!productSlug)  return NextResponse.json({ error: "productSlug is required" },  { status: 400 });
    if (!imageName)    return NextResponse.json({ error: "imageName is required" },    { status: 400 });

    // Validate imageName format
    const validName = /^main$|^gallery-\d+$/.test(imageName);
    if (!validName) {
      return NextResponse.json(
        { error: 'imageName must be "main" or "gallery-N" (e.g. gallery-1)' },
        { status: 400 }
      );
    }

    // ── Convert File → base64 ─────────────────────────────────────────────────
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // ── Public ID: truemart/{category}/{product}/{imageName} ──────────────────
    const pid = `truemart/${categorySlug}/${productSlug}/${imageName}`;

    // ── Upload to Cloudinary ──────────────────────────────────────────────────
    const result = await cloudinary.uploader.upload(base64, {
      public_id:     pid,
      overwrite:     true,           // replacing main/gallery images is fine
      resource_type: "image",
      folder:        "",             // public_id already includes folder path
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return NextResponse.json({
      publicId: result.public_id,
      url:      result.secure_url,
      width:    result.width,
      height:   result.height,
      format:   result.format,
      bytes:    result.bytes,
    });

  } catch (err) {
    console.error("[upload] Cloudinary error:", err);
    return NextResponse.json(
      { error: "Upload failed", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

// Only POST allowed
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
