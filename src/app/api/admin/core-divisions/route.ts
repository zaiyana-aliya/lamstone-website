import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/core-divisions
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("core_divisions")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/core-divisions] DB error:", error);
    return NextResponse.json({ error: error.message, divisions: [] }, { status: 500 });
  }

  return NextResponse.json({ divisions: data ?? [] });
}

// POST /api/admin/core-divisions
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("core_divisions")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.display_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("core_divisions")
    .insert({
      badge_label: body.badge_label || "DIVISION",
      title: body.title,
      description: body.description,
      image_url: body.image_url,
      link_url: body.link_url || "/about",
      cta_label: body.cta_label || "Learn More",
      is_active: body.is_active ?? true,
      display_order: body.display_order ?? nextOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("[admin/core-divisions] Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ division: data }, { status: 201 });
}
