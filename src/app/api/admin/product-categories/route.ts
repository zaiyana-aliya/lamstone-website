import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/product-categories
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("product_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (page) {
    query = query.eq("page_name", page);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data ?? [] });
}

// POST /api/admin/product-categories
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("product_categories")
    .select("display_order")
    .eq("page_name", body.page_name)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.display_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("product_categories")
    .insert({
      page_name: body.page_name,
      title: body.title,
      subtitle: body.subtitle || null,
      description: body.description || null,
      image_url: body.image_url || null,
      features_json: body.features_json ?? [],
      cta_label: body.cta_label || null,
      cta_link: body.cta_link || null,
      display_order: body.display_order ?? nextOrder,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data }, { status: 201 });
}
