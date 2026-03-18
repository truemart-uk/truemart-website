import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";

function adminSupabase() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { code, subtotal } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
  }

  const admin = adminSupabase();

  // Fetch coupon
  const { data: coupon } = await admin
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .single();

  if (!coupon) {
    return NextResponse.json({ error: "Invalid coupon code." }, { status: 404 });
  }

  // Check active
  if (!coupon.is_active) {
    return NextResponse.json({ error: "This coupon is no longer active." }, { status: 400 });
  }

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
  }

  // Check start date
  if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
    return NextResponse.json({ error: "This coupon is not yet active." }, { status: 400 });
  }

  // Check minimum order amount
  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    return NextResponse.json({
      error: `Minimum order of £${coupon.min_order_amount.toFixed(2)} required for this coupon.`
    }, { status: 400 });
  }

  // Check global max uses
  if (coupon.max_uses !== null) {
    const { count } = await admin
      .from("coupon_redemptions")
      .select("id", { count: "exact", head: true })
      .eq("coupon_id", coupon.id);

    if ((count ?? 0) >= coupon.max_uses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
    }
  }

  // Check first order only
  if (coupon.first_order_only) {
    const { count } = await admin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("status", ["paid", "processing", "shipped", "delivered"]);

    if ((count ?? 0) > 0) {
      return NextResponse.json({
        error: "This coupon is for first orders only."
      }, { status: 400 });
    }
  }

  // Check per-customer usage limit
  if (coupon.uses_per_customer !== null) {
    const { count } = await admin
      .from("coupon_redemptions")
      .select("id", { count: "exact", head: true })
      .eq("coupon_id", coupon.id)
      .eq("user_id", user.id);

    if ((count ?? 0) >= coupon.uses_per_customer) {
      return NextResponse.json({
        error: "You have already used this coupon."
      }, { status: 400 });
    }
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discount_type === "percent") {
    discountAmount = Math.round((subtotal * coupon.discount_value) / 100 * 100) / 100;
  } else {
    discountAmount = Math.min(coupon.discount_value, subtotal);
  }

  return NextResponse.json({
    valid:          true,
    code:           coupon.code,
    discountType:   coupon.discount_type,
    discountValue:  coupon.discount_value,
    discountAmount,
    description:    coupon.description,
  });
}
