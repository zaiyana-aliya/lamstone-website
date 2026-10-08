import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 60; // Cache for 60 seconds, revalidate in background

// GET /api/about-page - Public endpoint for frontend About page sections
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("about_page_content")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.warn(
        "[api/about-page] Notice (table pending migration or DB unavailable):",
        error.message
      );
      return NextResponse.json({ sections: [] });
    }

    return NextResponse.json({ sections: data ?? [] });
  } catch (err: any) {
    console.warn("[api/about-page] Exception fetching about content:", err?.message);
    return NextResponse.json({ sections: [] });
  }
}
