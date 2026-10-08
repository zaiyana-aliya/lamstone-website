import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PUT /api/admin/about-page/[id]
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

  if (body.eyebrow_label !== undefined) updatePayload.eyebrow_label = body.eyebrow_label;
  if (body.heading !== undefined) updatePayload.heading = body.heading;
  if (body.description !== undefined) updatePayload.description = body.description;
  if (body.image_url !== undefined) updatePayload.image_url = body.image_url;
  if (body.cta_label !== undefined) updatePayload.cta_label = body.cta_label;
  if (body.cta_url !== undefined) updatePayload.cta_url = body.cta_url;
  if (body.extra_data !== undefined) updatePayload.extra_data = body.extra_data;
  if (body.is_active !== undefined) updatePayload.is_active = body.is_active;

  const { data, error } = await supabase
    .from("about_page_content")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/about-page/[id]] Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ section: data });
}
