import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("contact_offices")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("[api/contact-offices] DB query issue:", error.message);
      return NextResponse.json({ offices: [] });
    }

    return NextResponse.json({ offices: data ?? [] });
  } catch (err) {
    console.error("[api/contact-offices] unexpected error:", err);
    return NextResponse.json({ offices: [] });
  }
}
