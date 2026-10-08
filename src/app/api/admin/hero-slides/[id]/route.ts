import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// PUT /api/admin/hero-slides/[id]
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/hero-slides/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("hero_slides")
    .update({
      page_name: body.page_name ?? "home",
      eyebrow_label: body.eyebrow_label,
      heading: body.heading,
      subtext: body.subtext,
      image_url: body.image_url,
      primary_cta_label: body.primary_cta_label || null,
      primary_cta_link: body.primary_cta_link || null,
      secondary_cta_label: body.secondary_cta_label || null,
      secondary_cta_link: body.secondary_cta_link || null,
      display_order: body.display_order,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.features) {
    await supabase.from("page_content").upsert(
      {
        page_name: body.page_name ?? "home",
        section_key: `hero_slide_${id}_features`,
        content_json: body.features,
      },
      { onConflict: "page_name,section_key" }
    );
    if (typeof body.display_order === "number") {
      await supabase.from("page_content").upsert(
        {
          page_name: body.page_name ?? "home",
          section_key: `hero_slide_${body.display_order}_features`,
          content_json: body.features,
        },
        { onConflict: "page_name,section_key" }
      );
    }
  }

  return NextResponse.json({ slide: data });
}

// DELETE /api/admin/hero-slides/[id]
export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/hero-slides/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
