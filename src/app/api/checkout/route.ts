import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, calcDeliveryCost, DELIVERY_OPTIONS, DeliveryMethod } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();
    const { items, deliveryMethod, addressId } = body as {
      items: Array<{ name: string; price: number; quantity: number }>;
      deliveryMethod: DeliveryMethod;
      addressId: string;
    };

    if (!items?.length || !deliveryMethod || !addressId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify address belongs to user
    const { data: address } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", addressId)
      .eq("user_id", user.id)
      .single();

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const subtotalPence = Math.round(
      items.reduce((sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0) * 100
    );
    const deliveryCostPence = calcDeliveryCost(deliveryMethod, subtotalPence);
    const totalPence = subtotalPence + deliveryCostPence;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPence,
      currency: "gbp",
      metadata: {
        user_id: user.id,
        address_id: addressId,
        delivery_method: deliveryMethod,
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subtotal: subtotalPence / 100,
      deliveryCost: deliveryCostPence / 100,
      total: totalPence / 100,
      deliveryLabel: DELIVERY_OPTIONS[deliveryMethod].label,
      deliveryDescription: DELIVERY_OPTIONS[deliveryMethod].description,
    });
  } catch (err) {
    console.error("PaymentIntent error:", err);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
