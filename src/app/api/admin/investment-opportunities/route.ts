import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("investment_opportunities")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/investment-opportunities] DB error:", error);
    return NextResponse.json({ error: error.message, opportunities: [] }, { status: 500 });
  }

  return NextResponse.json({ opportunities: data ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const insertPayload = {
    icon: body.icon || "Building2",
    category_tag: body.category_tag || "",
    title: body.title || "",
    location: body.location || "",
    description: body.description || "",
    cta_url: body.cta_url || "modal:inquiry",
    display_order: typeof body.display_order === "number" ? body.display_order : 0,
    is_active: body.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("investment_opportunities")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("[admin/investment-opportunities POST] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ opportunity: data }, { status: 201 });
}
