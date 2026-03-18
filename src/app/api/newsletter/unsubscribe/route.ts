import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const supabase = adminSupabase();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ is_active: false })
    .eq("email", email.toLowerCase().trim());

  if (error) {
    return NextResponse.json({ error: "Failed to unsubscribe." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// Also support GET for email client one-click unsubscribe links
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.redirect(new URL("/unsubscribe", request.url));
  }

  const supabase = adminSupabase();

  await supabase
    .from("newsletter_subscribers")
    .update({ is_active: false })
    .eq("email", email.toLowerCase().trim());

  // Redirect to the unsubscribe confirmation page
  return NextResponse.redirect(
    new URL(`/unsubscribe?email=${encodeURIComponent(email)}&done=1`, request.url)
  );
}
