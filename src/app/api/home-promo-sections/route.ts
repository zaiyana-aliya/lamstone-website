import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("home_promo_sections")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.warn(
        "[api/home-promo-sections] Notice (table pending migration or DB unavailable):",
        error.message
      );
      return NextResponse.json({ sections: [] });
    }

    return NextResponse.json({ sections: data ?? [] });
  } catch (err) {
    console.warn("[api/home-promo-sections] Exception fetching promo sections:", err);
    return NextResponse.json({ sections: [] });
  }
}
