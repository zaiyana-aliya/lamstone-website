import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "home";

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, page_name, eyebrow_label, heading, subtext, image_url, primary_cta_label, primary_cta_link, secondary_cta_label, secondary_cta_link, display_order")
    .eq("page_name", page)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[api/hero-slides] error:", error);
    return NextResponse.json({ error: "Failed to fetch hero slides" }, { status: 500 });
  }

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
