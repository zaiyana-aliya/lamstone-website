import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/blog/[slug]">
) {
  const { slug } = await ctx.params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, content, cover_image_url, excerpt, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("[blog/slug] DB error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post: data });
}
