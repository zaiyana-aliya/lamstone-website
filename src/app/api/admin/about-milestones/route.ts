import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/about-milestones
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("about_milestones")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/about-milestones] DB error:", error);
    return NextResponse.json({ error: error.message, milestones: [] }, { status: 500 });
  }

  return NextResponse.json({ milestones: data ?? [] });
}

// POST /api/admin/about-milestones
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("about_milestones")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.display_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("about_milestones")
    .insert({
      year: body.year,
      milestone_label: body.milestone_label || "MILESTONE 01",
      title: body.title,
      description: body.description,
      display_order: body.display_order ?? nextOrder,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("[admin/about-milestones] Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ milestone: data });
}
