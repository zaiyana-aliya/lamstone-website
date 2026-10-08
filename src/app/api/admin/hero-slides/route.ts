import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/hero-slides
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "home";

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("page_name", page)
    .order("display_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Also fetch slide features from page_content
  const { data: featureRows } = await supabase
    .from("page_content")
    .select("section_key, content_json")
    .eq("page_name", page);

  const featureMap: Record<string, any[]> = {};
  if (featureRows) {
    for (const row of featureRows) {
      if (row.content_json) {
        featureMap[row.section_key] = row.content_json;
      }
    }
  }

  const slidesWithFeatures = (data ?? []).map((slide, idx) => {
    const features =
      featureMap[`hero_slide_${slide.id}_features`] ||
      featureMap[`hero_slide_${idx + 1}_features`] ||
      null;
    return {
      ...slide,
      features,
    };
  });

  return NextResponse.json({ slides: slidesWithFeatures });
}

// POST /api/admin/hero-slides
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("hero_slides")
    .select("display_order")
    .eq("page_name", body.page_name ?? "home")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.display_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("hero_slides")
    .insert({
      page_name: body.page_name ?? "home",
      eyebrow_label: body.eyebrow_label,
      heading: body.heading,
      subtext: body.subtext,
      image_url: body.image_url,
      primary_cta_label: body.primary_cta_label || null,
      primary_cta_link: body.primary_cta_link || null,
      secondary_cta_label: body.secondary_cta_label || null,
      secondary_cta_link: body.secondary_cta_link || null,
      display_order: body.display_order ?? nextOrder,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.features && data?.id) {
    await supabase.from("page_content").upsert(
      {
        page_name: body.page_name ?? "home",
        section_key: `hero_slide_${data.id}_features`,
        content_json: body.features,
      },
      { onConflict: "page_name,section_key" }
    );
  }

  return NextResponse.json({ slide: data }, { status: 201 });
}
