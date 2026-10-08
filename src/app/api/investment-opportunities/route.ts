import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("investment_opportunities")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("[api/investment-opportunities] DB notice:", error.message);
      return NextResponse.json({ opportunities: [] });
    }

    return NextResponse.json({ opportunities: data ?? [] });
  } catch (err: any) {
    console.warn("[api/investment-opportunities] Exception:", err?.message);
    return NextResponse.json({ opportunities: [] });
  }
}
