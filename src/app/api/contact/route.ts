import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (message.length > 1000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Send notification email to TrueMart
    await resend.emails.send({
      from: "TrueMart Contact Form <noreply@truemart.co.uk>",
      to: SITE.contact.email,
      replyTo: email,
      subject: `New message from ${name} — ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #FB923C; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Name</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">
                  <a href="mailto:${email}" style="color: #FB923C;">${email}</a>
                </td>
              </tr>
              ${phone ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">
                  <a href="tel:${phone}" style="color: #FB923C;">${phone}</a>
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subject</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${subject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 16px 0;" />
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">Message:</p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: "TrueMart <noreply@truemart.co.uk>",
      to: email,
      subject: "We've received your message — TrueMart",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #FB923C; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Thanks for getting in touch, ${name}!</h1>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 14px; line-height: 1.6;">
              We've received your message and will get back to you within <strong>24 hours</strong> during business hours.
            </p>
            <div style="background: #fff7ed; border-left: 4px solid #FB923C; border-radius: 4px; padding: 12px 16px; margin: 16px 0;">
              <p style="color: #9a3412; font-size: 13px; margin: 0;"><strong>Your subject:</strong> ${subject}</p>
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
