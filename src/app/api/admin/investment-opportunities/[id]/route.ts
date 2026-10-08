import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

  if (body.icon !== undefined) updatePayload.icon = body.icon;
  if (body.category_tag !== undefined) updatePayload.category_tag = body.category_tag;
  if (body.title !== undefined) updatePayload.title = body.title;
  if (body.location !== undefined) updatePayload.location = body.location;
  if (body.description !== undefined) updatePayload.description = body.description;
  if (body.cta_url !== undefined) updatePayload.cta_url = body.cta_url;
  if (body.display_order !== undefined) updatePayload.display_order = body.display_order;
  if (body.is_active !== undefined) updatePayload.is_active = body.is_active;

  const { data, error } = await supabase
    .from("investment_opportunities")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/investment-opportunities/[id] PUT] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ opportunity: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("investment_opportunities")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin/investment-opportunities/[id] DELETE] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
