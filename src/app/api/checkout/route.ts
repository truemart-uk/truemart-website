import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, calcDeliveryCost, DELIVERY_OPTIONS, DeliveryMethod } from "@/lib/stripe";

type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
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
    const { items, deliveryMethod, addressId } = body as {
      items: CartItem[];
      deliveryMethod: DeliveryMethod;
      addressId: string;
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
        // Product with variant — check variant stock
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
        // Product without variant — check product stock
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

        // Skip stock check if track_stock is false (unlimited stock)
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

    // ── Create PaymentIntent ──────────────────────────────────────────────────
    const subtotalPence = Math.round(
      items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
    );
    const deliveryCostPence = calcDeliveryCost(deliveryMethod, subtotalPence);
    const totalPence = subtotalPence + deliveryCostPence;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPence,
      currency: "gbp",
      metadata: {
        user_id:      user.id,
        address_id:   addressId,
        delivery_method: deliveryMethod,
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret:        paymentIntent.client_secret,
      subtotal:            subtotalPence / 100,
      deliveryCost:        deliveryCostPence / 100,
      total:               totalPence / 100,
      deliveryLabel:       DELIVERY_OPTIONS[deliveryMethod].label,
      deliveryDescription: DELIVERY_OPTIONS[deliveryMethod].description,
    });

  } catch (err) {
    console.error("PaymentIntent error:", err);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
