import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Public endpoint — no auth needed; RLS allows public reads
export async function GET() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("pharmacy_locations")
    .select("id, name, area, district, status, phone, map_url, display_order")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[pharmacy-locations] DB error:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }

  return NextResponse.json({ locations: data ?? [] });
}
