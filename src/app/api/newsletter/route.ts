import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting — max 3 attempts per IP per minute
const attempts = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (record.count >= 3) return true;
  record.count++;
  return false;
}

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  const { email, name, source } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const supabase = adminSupabase();

  // Check if already subscribed
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, is_active")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (existing) {
    if (existing.is_active) {
      return NextResponse.json({ status: "already_subscribed" });
    }
    // Re-activate if previously unsubscribed
    await supabase
      .from("newsletter_subscribers")
      .update({ is_active: true, consented: true, consent_at: new Date().toISOString() })
      .eq("id", existing.id);
    await sendWelcomeEmail(email, name);
    return NextResponse.json({ status: "resubscribed" });
  }

  // Insert new subscriber
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email:      email.toLowerCase(),
      name:       name || null,
      consented:  true,
      consent_at: new Date().toISOString(),
      source:     source ?? "homepage",
      is_active:  true,
    });

  if (error) {
    console.error("Newsletter insert error:", error);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }

  await sendWelcomeEmail(email, name);
  return NextResponse.json({ status: "subscribed" });
}

async function sendWelcomeEmail(email: string, name?: string) {
  const firstName = name?.split(" ")[0] ?? "there";

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

        <!-- Header -->
        <div style="text-align:center;margin-bottom:28px;">
          <div style="font-size:48px;margin-bottom:12px;">🎉</div>
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#111;">Welcome, ${firstName}!</h1>
          <p style="margin:8px 0 0;font-size:14px;color:#6B7280;line-height:1.6;">
            You're now part of the TrueMart community. Thank you for joining us!
          </p>
        </div>

        <!-- Discount code box -->
        <div style="background:#FFF7ED;border:2px dashed #FB923C;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
          <p style="margin:0 0 6px;font-size:12px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Your welcome discount</p>
          <p style="margin:0 0 4px;font-size:28px;font-weight:900;color:#FB923C;letter-spacing:2px;">WELCOME10</p>
          <p style="margin:0;font-size:13px;color:#6B7280;">10% off your first order — use at checkout</p>
        </div>

        <!-- What to expect -->
        <div style="margin-bottom:28px;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#111;">Here's what you can expect from us:</p>
          <table cellpadding="0" cellspacing="0" width="100%">
            ${[
              ["🎉", "Festival alerts — never miss Diwali, Holi, Janmashtami deals"],
              ["📦", "New arrivals — books, pooja essentials, cosmetics and more"],
              ["✨", "Exclusive offers — subscriber-only discounts"],
              ["📖", "TrueBlogs — stories, traditions and culture"],
            ].map(([emoji, text]) => `
            <tr>
              <td style="padding:6px 0;width:28px;vertical-align:top;font-size:16px;">${emoji}</td>
              <td style="padding:6px 0;font-size:13px;color:#374151;">${text}</td>
            </tr>`).join("")}
          </table>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-bottom:24px;">
          <a href="https://www.truemart.co.uk/shop/books"
             style="display:inline-block;background:#FB923C;color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">
            Start Shopping →
          </a>
        </div>

        <!-- Unsubscribe -->
        <div style="border-top:1px solid #F3F4F6;padding-top:16px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9CA3AF;line-height:1.6;">
            You're receiving this because you subscribed at TrueMart.<br>
            <a href="https://www.truemart.co.uk/unsubscribe?email=${encodeURIComponent(email)}" style="color:#9CA3AF;">Unsubscribe</a>
            &nbsp;·&nbsp;
            <a href="https://www.truemart.co.uk/privacy" style="color:#9CA3AF;">Privacy Policy</a>
          </p>
        </div>

      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding-top:24px;">
        <p style="margin:0 0 4px;font-size:12px;color:#9CA3AF;">TrueMart — Authentic Indian Products, Delivered to Your Door</p>
        <p style="margin:0;font-size:12px;color:#C4C4C4;">&copy; 2026 TrueMart UK</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  await resend.emails.send({
    from:    "TrueMart <noreply@truemart.co.uk>",
    to:      email,
    subject: `Welcome to TrueMart 🎉 Here's your 10% off, ${firstName}!`,
    html,
  });
}
