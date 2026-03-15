import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export type UserRole = "customer" | "admin" | "staff" | "vendor";

// Get the role of the currently logged-in user
export async function getUserRole(supabase: SupabaseClient): Promise<UserRole | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (data?.role as UserRole) ?? "customer";
}

// Guard for API routes — returns error response if role not allowed
export async function requireRole(
  supabase: SupabaseClient,
  allowedRoles: UserRole[]
): Promise<{ user: { id: string; email?: string } } | NextResponse> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as UserRole ?? "customer";

  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { user };
}

// Check if a response is an error (for use after requireRole)
export function isErrorResponse(result: unknown): result is NextResponse {
  return result instanceof NextResponse;
}
