import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/brand-partners
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("brand_partners")
    .select("*")
    .order("display_order", { ascending: true });

  if (type) {
    query = query.eq("partner_type", type);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ partners: data ?? [] });
}

// POST /api/admin/brand-partners — Create brand partner
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  // Get next display order for this partner_type
  const { data: maxRow } = await supabase
    .from("brand_partners")
    .select("display_order")
    .eq("partner_type", body.partner_type)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.display_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("brand_partners")
    .insert({
      name: body.name,
      logo_url: body.logo_url || null,
      category_label: body.category_label,
      partner_type: body.partner_type,
      display_order: body.display_order ?? nextOrder,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ partner: data }, { status: 201 });
}
