import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("contact_offices")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/contact-offices GET] DB error:", error);
    return NextResponse.json({ error: error.message, offices: [] }, { status: 500 });
  }

  return NextResponse.json({ offices: data ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { label, company_name, address, phone, email, display_order, is_active } = body;

  if (!label || !address || !phone || !email) {
    return NextResponse.json(
      { error: "Label, address, phone, and email are required." },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();
  const insertPayload = {
    label: label.trim(),
    company_name: company_name ? company_name.trim() : null,
    address: address.trim(),
    phone: phone.trim(),
    email: email.trim(),
    display_order: Number.isInteger(display_order) ? display_order : 0,
    is_active: is_active !== undefined ? Boolean(is_active) : true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("contact_offices")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error("[admin/contact-offices POST] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ office: data }, { status: 201 });
}
