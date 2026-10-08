import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("division_cards")
      .select("id, title, subtitle, icon, link_url, display_order, is_active")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("[api/division-cards] Notice (table pending migration or DB unavailable):", error.message);
      return NextResponse.json({ cards: [] });
    }

    return NextResponse.json({ cards: data ?? [] });
  } catch (err) {
    console.warn("[api/division-cards] Exception fetching division cards:", err);
    return NextResponse.json({ cards: [] });
  }
}
