import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/pharmacy — list all locations
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pharmacy_locations")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ locations: data });
}

// POST /api/admin/pharmacy — create new location
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  // Get max display_order to append at end
  const { data: maxRow } = await supabase
    .from("pharmacy_locations")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.display_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("pharmacy_locations")
    .insert({
      name: body.name,
      area: body.area,
      district: body.district,
      status: body.status ?? "open_dispensing",
      phone: body.phone ?? null,
      map_url: body.map_url ?? null,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ location: data }, { status: 201 });
}
