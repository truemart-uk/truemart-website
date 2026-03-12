import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Simple in-memory rate limiter (3 requests per minute per IP) ──────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

// ── Escape user input before injecting into HTML ──────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  try {
    const { name, email, phone, subject, message } = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Length limits
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Phone format (optional)
    if (phone && !/^[\d\s\+\-\(\)]{7,20}$/.test(phone.trim())) {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }

    // Escape all user values before use in HTML
    const safeName    = escapeHtml(String(name).trim());
    const safeEmail   = escapeHtml(String(email).trim());
    const safeSubject = escapeHtml(String(subject).trim());
    const safeMessage = escapeHtml(String(message).trim()).replace(/\n/g, "<br>");
    const safePhone   = phone ? escapeHtml(String(phone).trim()) : null;

    // Send notification email to TrueMart
    await resend.emails.send({
      from: "TrueMart Contact Form <noreply@truemart.co.uk>",
      to: SITE.contact.email,
      replyTo: safeEmail,
      subject: `New message from ${safeName} — ${safeSubject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #FB923C; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Name</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">
                  <a href="mailto:${safeEmail}" style="color: #FB923C;">${safeEmail}</a>
                </td>
              </tr>
              ${safePhone ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">
                  <a href="tel:${safePhone}" style="color: #FB923C;">${safePhone}</a>
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subject</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${safeSubject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 16px 0;" />
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">Message:</p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; color: #374151; font-size: 14px; line-height: 1.6;">${safeMessage}</div>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              Reply directly to this email to respond to ${safeName}.
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: "TrueMart <noreply@truemart.co.uk>",
      to: safeEmail,
      subject: `We've received your message — TrueMart`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #FB923C; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Thanks for getting in touch, ${safeName}!</h1>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 14px; line-height: 1.6;">
              We've received your message and will get back to you within <strong>24 hours</strong> during business hours.
            </p>
            <div style="background: #fff7ed; border-left: 4px solid #FB923C; border-radius: 4px; padding: 12px 16px; margin: 16px 0;">
              <p style="color: #9a3412; font-size: 13px; margin: 0;"><strong>Your subject:</strong> ${safeSubject}</p>
            </div>
            <p style="color: #6b7280; font-size: 13px;">
              If your query is urgent, you can also reach us directly at
              <a href="mailto:${SITE.contact.email}" style="color: #FB923C;">${SITE.contact.email}</a>
              or call us on ${SITE.contact.phone}.
            </p>
            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} TrueMart. Bringing Traditions Closer To You.<br />
              <a href="${SITE.url}" style="color: #FB923C;">truemart.co.uk</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
