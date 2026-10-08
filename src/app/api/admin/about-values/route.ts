import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/about-values - list all ordered by display_order
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("about_values")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/about-values] DB error:", error);
    return NextResponse.json({ error: error.message, values: [] }, { status: 500 });
  }

  return NextResponse.json({ values: data ?? [] });
}

// POST /api/admin/about-values - create a new value item
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  // Find max display_order
  const { data: maxRow } = await supabase
    .from("about_values")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.display_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("about_values")
    .insert({
      icon: body.icon || "ShieldCheck",
      title: body.title,
      description: body.description,
      display_order: body.display_order ?? nextOrder,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("[admin/about-values] Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ value: data });
}
