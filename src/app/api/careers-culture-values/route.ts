import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("careers_culture_values")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("[api/careers-culture-values] DB query issue:", error.message);
      return NextResponse.json({ values: [] });
    }

    return NextResponse.json({ values: data ?? [] });
  } catch (err) {
    console.error("[api/careers-culture-values] unexpected error:", err);
    return NextResponse.json({ values: [] });
  }
}
