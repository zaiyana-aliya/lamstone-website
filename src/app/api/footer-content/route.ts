import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 60; // Cache for 60 seconds

const DEFAULT_FOOTER_CONTENT = {
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
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("footer_content")
      .select("*")
      .eq("section_key", "main")
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      if (error) console.warn("[api/footer-content] DB query issue (using fallback):", error.message);
      return NextResponse.json({ footer: DEFAULT_FOOTER_CONTENT });
    }

    return NextResponse.json({
      footer: {
        ...DEFAULT_FOOTER_CONTENT,
        ...data,
        social_links: {
          ...DEFAULT_FOOTER_CONTENT.social_links,
          ...(data.social_links || {}),
        },
        quick_links: Array.isArray(data.quick_links) && data.quick_links.length > 0
          ? data.quick_links
          : DEFAULT_FOOTER_CONTENT.quick_links,
      },
    });
  } catch (err) {
    console.error("[api/footer-content] unexpected error:", err);
    return NextResponse.json({ footer: DEFAULT_FOOTER_CONTENT });
  }
}
