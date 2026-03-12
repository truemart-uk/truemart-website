import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  // ── Auth: require Bearer token ────────────────────────────────────────────
  const authHeader = req.headers.get("authorization");
  if (!process.env.UPLOAD_SECRET || authHeader !== `Bearer ${process.env.UPLOAD_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file         = formData.get("file") as File | null;
  const categorySlug = formData.get("categorySlug") as string | null;
  const productSlug  = formData.get("productSlug") as string | null;
  const imageName    = formData.get("imageName") as string | null;

  if (!file || !categorySlug || !productSlug || !imageName) {
    return NextResponse.json({ error: "Missing required fields: file, categorySlug, productSlug, imageName" }, { status: 400 });
  }

  // Validate imageName
  if (!/^(main|gallery-\d+)(\.[a-z]+)?$/.test(imageName)) {
    return NextResponse.json({ error: "imageName must be 'main' or 'gallery-N'" }, { status: 400 });
  }

  // Prevent path traversal
  if (!/^[a-z0-9-]+$/.test(categorySlug) || !/^[a-z0-9-]+$/.test(productSlug)) {
    return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
  }

  // 10MB limit
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
  }

  const bytes    = await file.arrayBuffer();
  const buffer   = Buffer.from(bytes);
  const publicId = `truemart/${categorySlug}/${productSlug}/${imageName}`;

  try {
    const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { public_id: publicId, overwrite: true, resource_type: "image" },
        (error, result) => { if (error || !result) reject(error); else resolve(result as Record<string, unknown>); }
      ).end(buffer);
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
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
