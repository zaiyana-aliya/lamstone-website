import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/home-promo-sections
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("home_promo_sections")
    .select("*")
    .order("section_key", { ascending: false });

  if (error) {
    console.error("[admin/home-promo-sections] DB error:", error);
    return NextResponse.json({ error: error.message, sections: [] }, { status: 500 });
  }

  return NextResponse.json({ sections: data ?? [] });
}
