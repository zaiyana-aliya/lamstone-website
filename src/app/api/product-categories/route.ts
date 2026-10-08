import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page"); // 'pharmacy' | 'cosmetics'

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("product_categories")
    .select("id, page_name, title, subtitle, description, image_url, features_json, cta_label, cta_link, display_order")
    .order("display_order", { ascending: true });

  if (page) {
    query = query.eq("page_name", page);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[api/product-categories] error:", error);
    return NextResponse.json({ error: "Failed to fetch product categories" }, { status: 500 });
  }

  return NextResponse.json({ categories: data ?? [] });
}
