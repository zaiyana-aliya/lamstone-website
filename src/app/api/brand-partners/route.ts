import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'pharmacy' | 'cosmetics'

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("brand_partners")
    .select("id, name, logo_url, category_label, partner_type, display_order")
    .order("display_order", { ascending: true });

  if (type) {
    query = query.eq("partner_type", type);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[api/brand-partners] error:", error);
    return NextResponse.json({ error: "Failed to fetch brand partners" }, { status: 500 });
  }

  return NextResponse.json({ partners: data ?? [] });
}
