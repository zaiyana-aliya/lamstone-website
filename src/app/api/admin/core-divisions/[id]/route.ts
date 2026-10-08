import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PUT /api/admin/core-divisions/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };
  if (body.badge_label !== undefined) updatePayload.badge_label = body.badge_label;
  if (body.title !== undefined) updatePayload.title = body.title;
  if (body.description !== undefined) updatePayload.description = body.description;
  if (body.image_url !== undefined) updatePayload.image_url = body.image_url;
  if (body.link_url !== undefined) updatePayload.link_url = body.link_url;
  if (body.cta_label !== undefined) updatePayload.cta_label = body.cta_label;
  if (body.is_active !== undefined) updatePayload.is_active = body.is_active;
  if (body.display_order !== undefined) updatePayload.display_order = body.display_order;

  const { data, error } = await supabase
    .from("core_divisions")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/core-divisions/[id]] Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ division: data });
}

// DELETE /api/admin/core-divisions/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("core_divisions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin/core-divisions/[id]] Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
