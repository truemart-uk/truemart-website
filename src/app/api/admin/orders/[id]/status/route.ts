import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole, isErrorResponse } from "@/lib/roles";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
import { createClient as createAdminClient } from "@supabase/supabase-js";

function adminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const VALID_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

// Staff can only set these statuses — admin can set any
const STAFF_ALLOWED = ["processing", "shipped", "delivered"];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const result = await requireRole(supabase, ["admin", "staff"]);
  if (isErrorResponse(result)) return result;

  const { status } = await request.json();

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Get current role to enforce staff restrictions
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", result.user.id)
    .single();

  if (profile?.role === "staff" && !STAFF_ALLOWED.includes(status)) {
    return NextResponse.json(
      { error: "Staff cannot set this status" },
      { status: 403 }
    );
  }

  // Update order status
  const { data: order, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", params.id)
    .select("*, order_items(*)")
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // ── Send "shipped" email ──────────────────────────────────────────────────
  if (status === "shipped") {
    const admin = adminSupabase();
    const { data: { user } } = await admin.auth.admin.getUserById(order.user_id);
    if (user?.email) {
      await sendShippedEmail(user.email, order);
    }
  }

  return NextResponse.json({ order });
}

async function sendShippedEmail(email: string, order: Record<string, unknown>) {
  const shortId = (order.id as string).slice(0, 8).toUpperCase();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FAFAF8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF8;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

      <!-- Logo -->
      <tr><td align="center" style="padding-bottom:24px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="background:#FB923C;border-radius:10px;padding:10px 20px;">
            <span style="font-size:20px;font-weight:900;color:#000;">TRUEMART</span>
          </td>
        </tr></table>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#fff;border-radius:16px;border:1px solid #f0f0ee;padding:40px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:48px;margin-bottom:12px;">🚚</div>
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#111;">Your order is on its way!</h1>
          <p style="margin:8px 0 0;font-size:14px;color:#6B7280;">
            Great news — your TrueMart order #${shortId} has been shipped.
          </p>
        </div>

        <!-- Order ref -->
        <div style="background:#FFF7ED;border-radius:10px;padding:14px 16px;margin-bottom:24px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.05em;">Order reference</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#FB923C;">#${shortId}</p>
        </div>

        <!-- Delivery estimate -->
        <div style="background:#F0FDF4;border-left:3px solid #22C55E;border-radius:4px;padding:14px 16px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#15803D;line-height:1.6;">
            📦 <strong>Estimated delivery:</strong> ${order.delivery_estimate ?? (order.delivery_method === "express" ? "1–2 working days" : "3–5 working days")}
          </p>
        </div>

        <!-- Delivery address -->
        <div style="margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.05em;">Delivering to</p>
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
            ${order.shipping_name}<br>
            ${order.shipping_line1}${order.shipping_line2 ? '<br>' + order.shipping_line2 : ''}<br>
            ${order.shipping_city}${order.shipping_county ? ', ' + order.shipping_county : ''}<br>
            ${order.shipping_postcode}
          </p>
        </div>

        <!-- CTA -->
        <div style="text-align:center;">
          <a href="https://www.truemart.co.uk/account/orders" 
             style="display:inline-block;background:#FB923C;color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">
            Track my order
          </a>
        </div>
      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding-top:24px;">
        <p style="margin:0 0 4px;font-size:12px;color:#9CA3AF;">TrueMart — Authentic Indian Products, Delivered to Your Door</p>
        <p style="margin:0;font-size:12px;color:#C4C4C4;">
          &copy; 2026 TrueMart UK &nbsp;·&nbsp;
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
    subject: `Your TrueMart order #${shortId} is on its way! 🚚`,
    html,
  });
}
