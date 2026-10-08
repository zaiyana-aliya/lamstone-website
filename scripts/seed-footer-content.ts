import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const DEFAULT_FOOTER_CONTENT = {
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

async function seedFooterContent() {
  console.log("Seeding footer_content table...");

  const { error: checkErr } = await supabase
    .from("footer_content")
    .select("id")
    .limit(1);

  if (checkErr) {
    console.error(
      "✕ Error accessing footer_content table. Please make sure migration 016_footer_content.sql has run in Supabase SQL editor:\n",
      checkErr.message
    );
    process.exit(1);
  }

  const { data: existing } = await supabase
    .from("footer_content")
    .select("id")
    .eq("section_key", DEFAULT_FOOTER_CONTENT.section_key)
    .maybeSingle();

  if (existing) {
    console.log("  - footer_content row already exists (skipping overwrite to preserve existing edits)");
  } else {
    const { error: insertErr } = await supabase
      .from("footer_content")
      .insert(DEFAULT_FOOTER_CONTENT as any);

    if (insertErr) {
      console.error("  ✕ Error inserting footer_content:", insertErr.message);
    } else {
      console.log("  ✓ Seeded footer_content successfully");
    }
  }

  console.log("Finished seeding footer_content.");
}

seedFooterContent().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
