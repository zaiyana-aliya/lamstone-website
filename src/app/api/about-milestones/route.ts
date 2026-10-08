import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("about_milestones")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("[api/about-milestones] Notice (table pending migration or DB unavailable):", error.message);
      return NextResponse.json({ milestones: [] });
    }

    return NextResponse.json({ milestones: data ?? [] });
  } catch (err: any) {
    console.warn("[api/about-milestones] Exception:", err?.message);
    return NextResponse.json({ milestones: [] });
  }
}
