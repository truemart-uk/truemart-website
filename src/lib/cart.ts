import { SupabaseClient } from "@supabase/supabase-js";
import { CartItem } from "@/context/CartContext";

export function dbRowToCartItem(row: Record<string, unknown>): CartItem {
  return {
    productId:        row.product_id as string,
    variantId:        (row.variant_id as string) ?? undefined,
    name:             (row.snapshot_name as string) ?? "Unknown",
    variantLabel:     (row.snapshot_variant_label as string) ?? undefined,
    price:            Number(row.snapshot_price ?? 0),
    image:            (row.snapshot_image as string) ?? undefined,
    slug:             (row.snapshot_slug as string) ?? "",
    deliveryIncluded: (row.snapshot_delivery_included as boolean) ?? false,
    quantity:         row.quantity as number,
  };
}

export function cartItemToDbRow(item: CartItem, userId: string) {
  return {
    user_id:                    userId,
    product_id:                 item.productId,
    variant_id:                 item.variantId ?? null,
    quantity:                   item.quantity,
    snapshot_name:              item.name,
    snapshot_price:             item.price,
    snapshot_image:             item.image ?? null,
    snapshot_variant_label:     item.variantLabel ?? null,
    snapshot_slug:              item.slug,
    snapshot_delivery_included: item.deliveryIncluded,
  };
}

export async function loadCartFromDB(
  supabase: SupabaseClient,
  userId: string
): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("saved_for_later", false)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(dbRowToCartItem);
}

export async function upsertCartItemInDB(
  supabase: SupabaseClient,
  userId: string,
  item: CartItem
): Promise<void> {
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", item.productId)
    .is("variant_id", item.variantId ?? null)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ ...cartItemToDbRow(item, userId), quantity: existing.quantity + 1 })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("cart_items")
      .insert({ ...cartItemToDbRow(item, userId), quantity: 1 });
  }
}

export async function updateCartQuantityInDB(
  supabase: SupabaseClient,
  userId: string,
  productId: string,
  variantId: string | undefined,
  quantity: number
): Promise<void> {
  if (quantity <= 0) {
    await removeCartItemFromDB(supabase, userId, productId, variantId);
    return;
  }
  await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId)
    .is("variant_id", variantId ?? null);
}

export async function removeCartItemFromDB(
  supabase: SupabaseClient,
  userId: string,
  productId: string,
  variantId: string | undefined
): Promise<void> {
  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId)
    .is("variant_id", variantId ?? null);
}

export async function clearCartInDB(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);
}

export async function mergeGuestCartIntoDB(
  supabase: SupabaseClient,
  userId: string,
  guestItems: CartItem[]
): Promise<CartItem[]> {
  if (!guestItems.length) return loadCartFromDB(supabase, userId);

  for (const item of guestItems) {
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", item.productId)
      .is("variant_id", item.variantId ?? null)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + item.quantity })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("cart_items")
        .insert({ ...cartItemToDbRow(item, userId), quantity: item.quantity });
    }
  }

  return loadCartFromDB(supabase, userId);
}