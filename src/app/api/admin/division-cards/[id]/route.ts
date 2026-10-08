import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PUT /api/admin/division-cards/[id]
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
  if (body.title !== undefined) updatePayload.title = body.title;
  if (body.subtitle !== undefined) updatePayload.subtitle = body.subtitle;
  if (body.icon !== undefined) updatePayload.icon = body.icon;
  if (body.link_url !== undefined) updatePayload.link_url = body.link_url;
  if (body.is_active !== undefined) updatePayload.is_active = body.is_active;
  if (body.display_order !== undefined) updatePayload.display_order = body.display_order;

  const { data, error } = await supabase
    .from("division_cards")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/division-cards/[id]] Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ card: data });
}

// DELETE /api/admin/division-cards/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("division_cards")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin/division-cards/[id]] Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
