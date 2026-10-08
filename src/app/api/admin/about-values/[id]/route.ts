import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PUT /api/admin/about-values/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const updatePayload: Record<string, any> = {};
  if (body.icon !== undefined) updatePayload.icon = body.icon;
  if (body.title !== undefined) updatePayload.title = body.title;
  if (body.description !== undefined) updatePayload.description = body.description;
  if (body.display_order !== undefined) updatePayload.display_order = body.display_order;
  if (body.is_active !== undefined) updatePayload.is_active = body.is_active;

  const { data, error } = await supabase
    .from("about_values")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/about-values/[id]] Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ value: data });
}

// DELETE /api/admin/about-values/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("about_values")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin/about-values/[id]] Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
