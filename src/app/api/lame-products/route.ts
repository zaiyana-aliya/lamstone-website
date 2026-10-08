import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lame_products")
    .select("id, name, category_label, descriptor, description, image_url, features_json, status, store_url, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[api/lame-products] error:", error);
    return NextResponse.json({ error: "Failed to fetch Lamé products" }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}
