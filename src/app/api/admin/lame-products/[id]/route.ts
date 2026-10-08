import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PUT /api/admin/lame-products/[id]
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/lame-products/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("lame_products")
    .update({
      name: body.name,
      category_label: body.category_label,
      descriptor: body.descriptor || null,
      description: body.description,
      image_url: body.image_url,
      features_json: body.features_json ?? [],
      status: body.status,
      store_url: body.store_url || null,
      display_order: body.display_order,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

// DELETE /api/admin/lame-products/[id]
export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/lame-products/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("lame_products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
