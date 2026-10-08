import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DEFAULT_FOOTER = {
  section_key: "main",
  company_description:
    "A trusted healthcare and beauty ecosystem dedicated to enhancing wellness and confidence through premium pharmacy chains and cosmetic brands.",
  phone: "+91 9746397686",
  email: "mail@lamstonehealthcare.com",
  office_address:
    "Lamstone HealthCare Pvt Ltd\nZ Avenue, 10/20/E-10/20/G, NH 66, Mangalapuram, Kerala, India - 695317",
  corporate_office_address:
    "Alverstone Healthcare Pvt Ltd\nBio 360 Kerala Life Sciences Industries Park, Trivandrum, Kerala, India - 695317",
  social_links: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  copyright_text: "© 2026 Lamstone HealthCare Pvt Ltd. All rights reserved.",
  quick_links: [
    { href: "/about", label: "About Us" },
    { href: "/pharmacy-chain", label: "Our Pharmacies" },
    { href: "/cosmetics", label: "Cosmetics Division" },
    { href: "/lame", label: "Lamé Brand" },
    { href: "/invest", label: "Invest With Us" },
  ],
  newsletter_heading: "Newsletter",
  newsletter_description:
    "Subscribe for the latest healthcare insights and product updates.",
  is_active: true,
};

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("footer_content")
    .select("*")
    .eq("section_key", "main")
    .maybeSingle();

  if (error) {
    console.error("[admin/footer-content GET] DB error:", error);
    return NextResponse.json({ error: error.message, footer: DEFAULT_FOOTER }, { status: 500 });
  }

  return NextResponse.json({ footer: data || DEFAULT_FOOTER });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const payload: Record<string, any> = {
    section_key: "main",
    updated_at: new Date().toISOString(),
  };

  const allowedFields = [
    "company_description",
    "phone",
    "email",
    "office_address",
    "corporate_office_address",
    "social_links",
    "copyright_text",
    "quick_links",
    "newsletter_heading",
    "newsletter_description",
    "is_active",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  }

  // Check if main row exists
  const { data: existing } = await supabase
    .from("footer_content")
    .select("id")
    .eq("section_key", "main")
    .maybeSingle();

  let res;
  if (existing) {
    res = await supabase
      .from("footer_content")
      .update(payload)
      .eq("section_key", "main")
      .select()
      .single();
  } else {
    res = await supabase
      .from("footer_content")
      .insert(payload)
      .select()
      .single();
  }

  if (res.error) {
    console.error("[admin/footer-content PUT] DB error:", res.error);
    return NextResponse.json({ error: res.error.message }, { status: 500 });
  }

  return NextResponse.json({ footer: res.data });
}
