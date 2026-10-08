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

interface CosmeticsSectionSeed {
  section_key: string;
  eyebrow_label: string | null;
  heading: string;
  description: string;
  image_url: string | null;
  primary_cta_label: string | null;
  primary_cta_url: string | null;
  extra_data?: Record<string, any>;
  is_active: boolean;
}

const DEFAULT_COSMETICS_SECTIONS: CosmeticsSectionSeed[] = [
  {
    section_key: "hero",
    eyebrow_label: "Distribution & Retail",
    heading: "Cosmetics\nDivision",
    description:
      "Pioneering access to world-class beauty, dermatological, and personal care solutions across Kerala.\n\nLamstone Cosmetic Division is dedicated to bringing premium skincare, beauty, and personal care solutions to consumers through a robust and expanding distribution network.",
    image_url: "/images/home/cosmetics-division-staging.png",
    primary_cta_label: "Contact Distribution",
    primary_cta_url: "/contact",
    extra_data: {
      subheading:
        "Pioneering access to world-class beauty, dermatological, and personal care solutions across Kerala.",
      secondary_description:
        "Lamstone Cosmetic Division is dedicated to bringing premium skincare, beauty, and personal care solutions to consumers through a robust and expanding distribution network.",
      stat_trusted_year: "2019",
      stat_partners_count: "9+",
      stat_authentic_badge: "100% Authentic",
      stat_authentic_sub: "Dermatologist Approved",
    },
    is_active: true,
  },
  {
    section_key: "cta_banner",
    eyebrow_label: null,
    heading: "Partner With Lamstone as a Retailer or Brand Supplier",
    description:
      "Gain access to a statewide retail footprint and professional logistics infrastructure.",
    image_url: null,
    primary_cta_label: "Contact Distribution Team",
    primary_cta_url: "/contact",
    extra_data: {},
    is_active: true,
  },
];

async function seedCosmeticsPage() {
  console.log("Seeding cosmetics_page_content table...");

  const { error: checkErr } = await supabase
    .from("cosmetics_page_content")
    .select("count", { count: "exact", head: true });

  if (checkErr) {
    console.error(
      "✕ Error accessing cosmetics_page_content table. Please make sure migration 010_cosmetics_page.sql has run in Supabase SQL editor:\n",
      checkErr.message
    );
    process.exit(1);
  }

  for (const item of DEFAULT_COSMETICS_SECTIONS) {
    const { data: existing } = await supabase
      .from("cosmetics_page_content")
      .select("id")
      .eq("section_key", item.section_key)
      .maybeSingle();

    if (existing) {
      console.log(`  - ${item.section_key} already exists (skipping overwrite to preserve edits)`);
    } else {
      const { error: insertErr } = await supabase
        .from("cosmetics_page_content")
        .insert(item);

      if (insertErr) {
        console.error(`  ✕ Error inserting ${item.section_key}:`, insertErr.message);
      } else {
        console.log(`  ✓ Seeded ${item.section_key}`);
      }
    }
  }

  console.log("Finished seeding cosmetics_page_content.");
}

seedCosmeticsPage().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
