import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe, DELIVERY_OPTIONS, DeliveryMethod } from "@/lib/stripe";
import { Resend } from "resend";
import Stripe from "stripe";

const resend = new Resend(process.env.RESEND_API_KEY);

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig  = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = adminSupabase();

  const { data: existing } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true });
  }

  await supabase.from("stripe_events").insert({ id: event.id, type: event.type });

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    await handlePaymentSuccess(supabase, pi);
  }

  await supabase.from("stripe_events").update({ processed: true }).eq("id", event.id);

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(
  supabase: ReturnType<typeof adminSupabase>,
  pi: Stripe.PaymentIntent
) {
  const {
    user_id, address_id, delivery_method,
    delivery_cost_pence, items_json,
    coupon_code, coupon_discount_pence,
  } = pi.metadata as {
    user_id: string;
    address_id: string;
    delivery_method: DeliveryMethod;
    delivery_cost_pence: string;
    items_json: string;
    coupon_code?: string;
    coupon_discount_pence?: string;
  };

  // ── Parse items from metadata ─────────────────────────────────────────────
  let items: Array<{
    productId: string;
    variantId: string | null;
    name: string;
    variantLabel: string | null;
    price: number;
    image: string | null;
    slug: string;
    quantity: number;
  }>;

  try {
    items = JSON.parse(items_json);
  } catch {
    console.error("Failed to parse items_json from PaymentIntent metadata:", pi.id);
    return;
  }

  if (!items?.length) { console.error("No items in metadata for PI:", pi.id); return; }

  // Fetch address
  const { data: address } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", address_id)
    .single();

  if (!address) { console.error("Address not found:", address_id); return; }

  const deliveryCostGbp   = parseInt(delivery_cost_pence ?? "0") / 100;
  const couponDiscountGbp = parseInt(coupon_discount_pence ?? "0") / 100;
  const totalGbp          = pi.amount / 100;
  const subtotalGbp       = totalGbp - deliveryCostGbp + couponDiscountGbp;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id,
      status:            "paid",
      subtotal:          subtotalGbp,
      delivery_cost:     deliveryCostGbp,
      total:             totalGbp,
      delivery_method,
      delivery_estimate: DELIVERY_OPTIONS[delivery_method].description,
      shipping_name:     address.full_name,
      shipping_line1:    address.line1,
      shipping_line2:    address.line2 ?? null,
      shipping_city:     address.city,
      shipping_county:   address.county ?? null,
      shipping_postcode: address.postcode,
      shipping_country:  address.country,
      shipping_phone:    address.phone ?? null,
      stripe_payment_intent_id: pi.id,
      stripe_payment_status:    pi.status,
      coupon_code:       coupon_code || null,
      coupon_discount:   couponDiscountGbp,
    })
    .select()
    .single();

  if (orderError || !order) { console.error("Order creation failed:", orderError); return; }

  // Create order items
  const orderItems = items.map(item => ({
    order_id:      order.id,
    product_id:    item.productId,
    variant_id:    item.variantId ?? null,
    name:          item.name,
    variant_label: item.variantLabel ?? null,
    slug:          item.slug,
    image:         item.image ?? null,
    unit_price:    item.price,
    quantity:      item.quantity,
    line_total:    item.price * item.quantity,
  }));

  await supabase.from("order_items").insert(orderItems);

  // ── Record coupon redemption ───────────────────────────────────────────────
  if (coupon_code) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("id")
      .eq("code", coupon_code)
      .single();

    if (coupon) {
      const { data: { user: authUser } } = await supabase.auth.admin.getUserById(user_id);
      await supabase.from("coupon_redemptions").insert({
        coupon_id:       coupon.id,
        order_id:        order.id,
        user_id,
        email:           authUser?.email ?? "",
        discount_amount: couponDiscountGbp,
      });
    }
  }

  // ── Decrement stock atomically ────────────────────────────────────────────
  for (const item of items) {
    if (item.variantId) {
      await supabase.rpc("decrement_variant_stock", {
        p_variant_id: item.variantId,
        p_qty:        item.quantity,
      });
    } else {
      await supabase.rpc("decrement_product_stock", {
        p_product_id: item.productId,
        p_qty:        item.quantity,
      });
    }
  }

  // ── Clear DB cart ─────────────────────────────────────────────────────────
  await supabase.from("cart_items").delete().eq("user_id", user_id);

  // Fetch user email
  const { data: { user } } = await supabase.auth.admin.getUserById(user_id);
  if (!user?.email) return;

  // Send confirmation email
  await sendConfirmationEmail(user.email, order, orderItems, address);

  // Mark email sent
  await supabase.from("orders").update({ confirmation_email_sent: true }).eq("id", order.id);
}

async function sendConfirmationEmail(
  email: string,
  order: Record<string, unknown>,
  items: Record<string, unknown>[],
  address: Record<string, unknown>
) {
  const itemsHtml = items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #F3F4F6;">
        <p style="margin:0;font-size:14px;font-weight:600;color:#111;">${item.name}${item.variant_label ? ` — ${item.variant_label}` : ""}</p>
        <p style="margin:2px 0 0;font-size:12px;color:#9CA3AF;">Qty: ${item.quantity}</p>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #F3F4F6;text-align:right;font-size:14px;font-weight:600;color:#111;">
        £${Number(item.line_total).toFixed(2)}
      </td>
    </tr>
  `).join("");

  const couponRow = order.coupon_code && Number(order.coupon_discount) > 0 ? `
    <tr>
      <td style="font-size:13px;color:#16A34A;padding:4px 0;">Discount (${order.coupon_code})</td>
      <td style="font-size:13px;color:#16A34A;text-align:right;">-£${Number(order.coupon_discount).toFixed(2)}</td>
    </tr>` : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FAFAF8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF8;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

      <!-- Card -->
      <tr><td style="background:#fff;border-radius:16px;border:1px solid #f0f0ee;padding:40px;">

        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:40px;margin-bottom:12px;">🎉</div>
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#111;">Order confirmed!</h1>
          <p style="margin:8px 0 0;font-size:14px;color:#6B7280;">Thank you for your order. We'll have it with you soon.</p>
        </div>

        <div style="background:#FFF7ED;border-radius:10px;padding:14px 16px;margin-bottom:24px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.05em;">Order reference</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#FB923C;">#${String(order.id).slice(0,8).toUpperCase()}</p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          ${itemsHtml}
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="font-size:13px;color:#6B7280;padding:4px 0;">Subtotal</td>
            <td style="font-size:13px;color:#6B7280;text-align:right;">£${Number(order.subtotal).toFixed(2)}</td>
          </tr>
          ${couponRow}
          <tr>
            <td style="font-size:13px;color:#6B7280;padding:4px 0;">Delivery (${order.delivery_method === 'express' ? 'Express' : 'Standard'})</td>
            <td style="font-size:13px;color:#6B7280;text-align:right;">${Number(order.delivery_cost) === 0 ? 'FREE' : '£' + Number(order.delivery_cost).toFixed(2)}</td>
          </tr>
          <tr>
            <td style="font-size:15px;font-weight:700;color:#111;padding:10px 0 4px;border-top:2px solid #F3F4F6;">Total</td>
            <td style="font-size:15px;font-weight:700;color:#FB923C;text-align:right;padding:10px 0 4px;border-top:2px solid #F3F4F6;">£${Number(order.total).toFixed(2)}</td>
          </tr>
        </table>

        <div style="background:#F9FAFB;border-radius:10px;padding:16px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.05em;">Delivering to</p>
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
            ${address.full_name}<br>
            ${address.line1}${address.line2 ? '<br>' + address.line2 : ''}<br>
            ${address.city}${address.county ? ', ' + address.county : ''}<br>
            ${address.postcode}
          </p>
          <p style="margin:8px 0 0;font-size:13px;color:#FB923C;font-weight:600;">
            ${order.delivery_method === 'express' ? '⚡ Express: 1–2 working days' : '📦 Standard: 3–5 working days'}
          </p>
        </div>

        <div style="text-align:center;">
          <a href="https://www.truemart.co.uk/account/orders" style="display:inline-block;background:#FB923C;color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">
            View My Orders
          </a>
        </div>

      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding-top:24px;">
        <p style="margin:0 0 4px;font-size:12px;color:#9CA3AF;">TrueMart — Authentic Indian Products, Delivered to Your Door</p>
        <p style="margin:0;font-size:12px;color:#C4C4C4;">
          &copy; 2026 TrueMart UK &nbsp;·&nbsp;
          <a href="https://www.truemart.co.uk/privacy" style="color:#C4C4C4;">Privacy</a> &nbsp;·&nbsp;
          <a href="mailto:contact@truemart.co.uk" style="color:#C4C4C4;">Contact us</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  await resend.emails.send({
    from: "TrueMart <noreply@truemart.co.uk>",
    to: email,
    subject: `Your TrueMart order #${String(order.id).slice(0,8).toUpperCase()} is confirmed 🎉`,
    html,
  });
}
