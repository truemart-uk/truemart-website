import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, calcDeliveryCost, DELIVERY_OPTIONS, DeliveryMethod } from "@/lib/stripe";

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
    const subtotalPence      = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100);
    const deliveryCostPence  = calcDeliveryCost(deliveryMethod, subtotalPence);
    const totalPence         = subtotalPence + deliveryCostPence;

    // ── Create PaymentIntent — embed items in metadata ────────────────────────
    // Stripe metadata values must be strings and total metadata must be < 8KB
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   totalPence,
      currency: "gbp",
      metadata: {
        user_id:          user.id,
        address_id:       addressId,
        delivery_method:  deliveryMethod,
        delivery_cost_pence: String(deliveryCostPence),
        // Store serialised cart items so webhook never depends on DB cart state
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
