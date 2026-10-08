import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/blog/[id]
export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/blog/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post: data });
}

// PUT /api/admin/blog/[id]
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/blog/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt ?? null,
      cover_image_url: body.cover_image_url ?? null,
      published: body.published ?? false,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}

// DELETE /api/admin/blog/[id]
export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/admin/blog/[id]">
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ success: true });
}
