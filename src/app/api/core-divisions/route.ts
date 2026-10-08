import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("core_divisions")
      .select("id, badge_label, title, description, image_url, link_url, cta_label, display_order, is_active")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("[api/core-divisions] Notice (table pending migration or DB unavailable):", error.message);
      return NextResponse.json({ divisions: [] });
    }

    return NextResponse.json({ divisions: data ?? [] });
  } catch (err) {
    console.warn("[api/core-divisions] Exception fetching core divisions:", err);
    return NextResponse.json({ divisions: [] });
  }
}
