import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("contact_page_content")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.warn("[api/contact-page] DB query issue:", error.message);
      return NextResponse.json({ sections: [] });
    }

    return NextResponse.json({ sections: data ?? [] });
  } catch (err) {
    console.error("[api/contact-page] unexpected error:", err);
    return NextResponse.json({ sections: [] });
  }
}
