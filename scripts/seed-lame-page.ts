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

interface LameSectionSeed {
  section_key: string;
  eyebrow_label: string | null;
  heading: string;
  description: string;
  image_url: string | null;
  primary_cta_label: string | null;
  primary_cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
  extra_data?: Record<string, any>;
  is_active: boolean;
}

const DEFAULT_LAME_SECTIONS: LameSectionSeed[] = [
  {
    section_key: "hero",
    eyebrow_label: "Haute Dermocosmetics",
    heading: "Lamé\nBorn from Expertise",
    description:
      "Lamé is not just another cosmetic brand; it is the culmination of years of pharmaceutical expertise and a deep understanding of dermatological science. Created by Lamstone, Lamé bridges the gap between clinical efficacy and luxurious self-care.\n\nEvery product in the Lamé lineup is rigorously formulated, tested, and refined to ensure it meets the highest standards of safety and visible results. We believe that true beauty is synonymous with health.",
    image_url: "/images/lame/lam3.jpeg",
    primary_cta_label: "Explore Signature Collection",
    primary_cta_url: "#collection",
    secondary_cta_label: "Shop Online",
    secondary_cta_url: "https://mylamstone.com/",
    extra_data: {
      badge_1: "Cruelty Free",
      badge_2: "Clinically Tested",
    },
    is_active: true,
  },
  {
    section_key: "notify_banner",
    eyebrow_label: "Launch Notification",
    heading: "Be Notified When Lamé Launches",
    description:
      "Our signature formulations are entering their release phase. Leave your email to receive early-access ordering invitations as soon as products go live on our store.",
    image_url: null,
    primary_cta_label: "Notify Me",
    primary_cta_url: null,
    secondary_cta_label: null,
    secondary_cta_url: null,
    extra_data: {
      privacy_note: "We respect your privacy. No spam — only launch updates and formulation releases.",
    },
    is_active: true,
  },
  {
    section_key: "quote_cta",
    eyebrow_label: null,
    heading: "Inquire About Lamé Retail Partnerships",
    description: "",
    image_url: null,
    primary_cta_label: "Inquire About Lamé Retail Partnerships",
    primary_cta_url: "/contact",
    secondary_cta_label: null,
    secondary_cta_url: null,
    extra_data: {
      quote: "True beauty is synonymous with health.",
    },
    is_active: true,
  },
];

async function seedLamePage() {
  console.log("Seeding lame_page_content table...");

  const { error: checkErr } = await supabase
    .from("lame_page_content")
    .select("count", { count: "exact", head: true });

  if (checkErr) {
    console.error(
      "✕ Error accessing lame_page_content table. Please make sure migration 011_lame_page.sql has run in Supabase SQL editor:\n",
      checkErr.message
    );
    process.exit(1);
  }

  for (const item of DEFAULT_LAME_SECTIONS) {
    const { data: existing } = await supabase
      .from("lame_page_content")
      .select("id")
      .eq("section_key", item.section_key)
      .maybeSingle();

    if (existing) {
      console.log(`  - ${item.section_key} already exists (skipping overwrite to preserve edits)`);
    } else {
      const { error: insertErr } = await supabase
        .from("lame_page_content")
        .insert(item);

      if (insertErr) {
        console.error(`  ✕ Error inserting ${item.section_key}:`, insertErr.message);
      } else {
        console.log(`  ✓ Seeded ${item.section_key}`);
      }
    }
  }

  console.log("Finished seeding lame_page_content.");
}

seedLamePage().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
