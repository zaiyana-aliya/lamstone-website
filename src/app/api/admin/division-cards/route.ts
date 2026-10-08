import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// GET /api/admin/division-cards
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("division_cards")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/division-cards] DB error:", error);
    return NextResponse.json({ error: error.message, cards: [] }, { status: 500 });
  }

  return NextResponse.json({ cards: data ?? [] });
}

// POST /api/admin/division-cards
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("division_cards")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.display_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("division_cards")
    .insert({
      title: body.title,
      subtitle: body.subtitle,
      icon: body.icon,
      link_url: body.link_url || "/about",
      is_active: body.is_active ?? true,
      display_order: body.display_order ?? nextOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("[admin/division-cards] Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ card: data }, { status: 201 });
}
