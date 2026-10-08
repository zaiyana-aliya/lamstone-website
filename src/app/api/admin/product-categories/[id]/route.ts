import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PUT /api/admin/product-categories/[id]
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/product-categories/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("product_categories")
    .update({
      page_name: body.page_name,
      title: body.title,
      subtitle: body.subtitle || null,
      description: body.description || null,
      image_url: body.image_url || null,
      features_json: body.features_json ?? [],
      cta_label: body.cta_label || null,
      cta_link: body.cta_link || null,
      display_order: body.display_order,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data });
}

// DELETE /api/admin/product-categories/[id]
export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/product-categories/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("product_categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
