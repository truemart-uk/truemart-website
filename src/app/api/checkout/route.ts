import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { stripe, calcDeliveryCost, DELIVERY_OPTIONS, DeliveryMethod } from "@/lib/stripe";

function adminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  price: number;
  image?: string;
  slug: string;
  deliveryIncluded: boolean;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();
    const { items, deliveryMethod, addressId, couponCode, existingPaymentIntentId } = body as {
      items: CartItem[];
      deliveryMethod: DeliveryMethod;
      addressId: string;
      couponCode?: string;
      existingPaymentIntentId?: string;
    };

    if (!items?.length || !deliveryMethod || !addressId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Verify address belongs to user ────────────────────────────────────────
    const { data: address } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", addressId)
      .eq("user_id", user.id)
      .single();

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // ── Stock validation ──────────────────────────────────────────────────────
    for (const item of items) {
      if (item.variantId) {
        const { data: variant } = await supabase
          .from("product_variants")
          .select("stock_qty, label")
          .eq("id", item.variantId)
          .single();

        if (!variant) {
          return NextResponse.json(
            { error: `"${item.name}" is no longer available.` },
            { status: 400 }
          );
        }
        if (variant.stock_qty < item.quantity) {
          return NextResponse.json(
            {
              error: variant.stock_qty === 0
                ? `"${item.name}" is out of stock.`
                : `Only ${variant.stock_qty} of "${item.name}" left in stock.`,
            },
            { status: 400 }
          );
        }
      } else {
        const { data: product } = await supabase
          .from("products")
          .select("stock_qty, track_stock")
          .eq("id", item.productId)
          .single();

        if (!product) {
          return NextResponse.json(
            { error: `"${item.name}" is no longer available.` },
            { status: 400 }
          );
        }
        if (product.track_stock && product.stock_qty < item.quantity) {
          return NextResponse.json(
            {
              error: product.stock_qty === 0
                ? `"${item.name}" is out of stock.`
                : `Only ${product.stock_qty} of "${item.name}" left in stock.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // ── Calculate totals ──────────────────────────────────────────────────────
    const subtotalPence     = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100);
    const deliveryCostPence = calcDeliveryCost(deliveryMethod, subtotalPence);

    // ── Apply coupon if provided ──────────────────────────────────────────────
    let couponDiscountPence  = 0;
    let validatedCouponCode: string | null = null;

    if (couponCode) {
      const admin = adminSupabase();
      const { data: coupon } = await admin
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase().trim())
        .single();

      if (coupon && coupon.is_active) {
        let valid = true;

        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) valid = false;

        if (valid && coupon.first_order_only) {
          const { count } = await admin
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .in("status", ["paid", "processing", "shipped", "delivered"]);
          if ((count ?? 0) > 0) valid = false;
        }

        if (valid && coupon.uses_per_customer !== null) {
          const { count } = await admin
            .from("coupon_redemptions")
            .select("id", { count: "exact", head: true })
            .eq("coupon_id", coupon.id)
            .eq("user_id", user.id);
          if ((count ?? 0) >= coupon.uses_per_customer) valid = false;
        }

        if (valid) {
          if (coupon.discount_type === "percent") {
            couponDiscountPence = Math.round((subtotalPence * coupon.discount_value) / 100);
          } else {
            couponDiscountPence = Math.min(Math.round(coupon.discount_value * 100), subtotalPence);
          }
          validatedCouponCode = coupon.code;
        }
      }
    }

    const totalPence = Math.max(subtotalPence + deliveryCostPence - couponDiscountPence, 50);

    // ── Cancel existing PaymentIntent if provided ─────────────────────────────
    // This prevents ghost PaymentIntents from triggering the webhook
    if (existingPaymentIntentId) {
      try {
        await stripe.paymentIntents.cancel(existingPaymentIntentId);
      } catch {
        // Ignore — it may already be cancelled or succeeded
      }
    }

    // ── Create PaymentIntent — embed items in metadata ────────────────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   totalPence,
      currency: "gbp",
      metadata: {
        user_id:               user.id,
        address_id:            addressId,
        delivery_method:       deliveryMethod,
        delivery_cost_pence:   String(deliveryCostPence),
        coupon_code:           validatedCouponCode ?? "",
        coupon_discount_pence: String(couponDiscountPence),
        items_json: JSON.stringify(items.map(i => ({
          productId:    i.productId,
          variantId:    i.variantId ?? null,
          name:         i.name,
          variantLabel: i.variantLabel ?? null,
          price:        i.price,
          image:        i.image ?? null,
          slug:         i.slug,
          quantity:     i.quantity,
        }))),
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret:        paymentIntent.client_secret,
      paymentIntentId:     paymentIntent.id,
      subtotal:            subtotalPence / 100,
      deliveryCost:        deliveryCostPence / 100,
      couponDiscount:      couponDiscountPence / 100,
      total:               totalPence / 100,
      deliveryLabel:       DELIVERY_OPTIONS[deliveryMethod].label,
      deliveryDescription: DELIVERY_OPTIONS[deliveryMethod].description,
      appliedCoupon:       validatedCouponCode,
    });

  } catch (err) {
    console.error("PaymentIntent error:", err);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
