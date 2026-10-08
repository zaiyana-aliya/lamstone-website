import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("about_values")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("[api/about-values] Notice (table pending migration or DB unavailable):", error.message);
      return NextResponse.json({ values: [] });
    }

    return NextResponse.json({ values: data ?? [] });
  } catch (err: any) {
    console.warn("[api/about-values] Exception:", err?.message);
    return NextResponse.json({ values: [] });
  }
}
