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

  if (body.eyebrow_label !== undefined) updatePayload.eyebrow_label = body.eyebrow_label;
  if (body.heading !== undefined) updatePayload.heading = body.heading;
  if (body.description !== undefined) updatePayload.description = body.description;
  if (body.image_url !== undefined) updatePayload.image_url = body.image_url;
  if (body.primary_cta_label !== undefined) updatePayload.primary_cta_label = body.primary_cta_label;
  if (body.primary_cta_url !== undefined) updatePayload.primary_cta_url = body.primary_cta_url;
  if (body.extra_data !== undefined) updatePayload.extra_data = body.extra_data;
  if (body.is_active !== undefined) updatePayload.is_active = body.is_active;

  const { data, error } = await supabase
    .from("blog_page_content")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/blog-page/[id]] Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ section: data });
}
