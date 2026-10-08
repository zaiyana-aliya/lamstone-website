import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PUT /api/admin/brand-partners/[id]
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/brand-partners/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("brand_partners")
    .update({
      name: body.name,
      logo_url: body.logo_url || null,
      category_label: body.category_label,
      partner_type: body.partner_type,
      display_order: body.display_order,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ partner: data });
}

// DELETE /api/admin/brand-partners/[id]
export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/brand-partners/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("brand_partners").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
