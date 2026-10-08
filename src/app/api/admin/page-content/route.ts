import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/page-content
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("page_content")
    .select("*")
    .order("page_name", { ascending: true });

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ content: data });
}

// PUT /api/admin/page-content — upsert by page_name + section_key
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("page_content")
    .upsert(
      { page_name: body.page_name, section_key: body.section_key, content_json: body.content_json },
      { onConflict: "page_name,section_key" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ content: data });
}
