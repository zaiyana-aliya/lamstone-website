import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PUT /api/admin/pharmacy/[id] — update location
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/pharmacy/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("pharmacy_locations")
    .update({
      name: body.name,
      area: body.area,
      district: body.district,
      status: body.status,
      phone: body.phone ?? null,
      map_url: body.map_url ?? null,
      display_order: body.display_order,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ location: data });
}

// DELETE /api/admin/pharmacy/[id]
export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/pharmacy/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("pharmacy_locations")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ success: true });
}
