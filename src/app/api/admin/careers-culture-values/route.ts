import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("careers_culture_values")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/careers-culture-values GET] DB error:", error);
    return NextResponse.json({ error: error.message, values: [] }, { status: 500 });
  }

  return NextResponse.json({ values: data ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { icon, title, description, display_order, is_active } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required." },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();
  const insertPayload = {
    icon: icon || "Users",
    title: title.trim(),
    description: description.trim(),
    display_order: Number.isInteger(display_order) ? display_order : 0,
    is_active: is_active !== undefined ? Boolean(is_active) : true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("careers_culture_values")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("[admin/careers-culture-values POST] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ value: data }, { status: 201 });
}
