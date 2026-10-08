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

interface PromoSectionSeed {
  section_key: string;
  eyebrow_label: string;
  heading: string;
  description: string;
  image_url: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
  is_active: boolean;
}

const DEFAULT_SECTIONS: PromoSectionSeed[] = [
  {
    section_key: "lame_banner",
    eyebrow_label: "SIGNATURE LAMÉ",
    heading: "Bridging Clinical Science & Luxury Beauty",
    description:
      "Developed with pharmaceutical precision, Lamé delivers clinically proven skincare and luxury fragrances that elevate your daily wellness routine.",
    image_url: "/images/lame/lame-hero-bg.jpg",
    primary_cta_label: "Explore Lamé Brand",
    primary_cta_url: "/lame",
    secondary_cta_label: "Shop Online",
    secondary_cta_url: "https://mylamstone.com/",
    is_active: true,
  },
  {
    section_key: "invest_banner",
    eyebrow_label: "STRATEGIC INVESTMENT",
    heading: "Invest in Growth with Lamstone",
    description:
      "Join our rapidly expanding pharmacy chain and beauty ecosystem. We offer transparent, secure, and lucrative partnership models for forward-thinking investors.",
    image_url:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    primary_cta_label: "Talk to Us",
    primary_cta_url: "/contact",
    secondary_cta_label: null,
    secondary_cta_url: null,
    is_active: true,
  },
];

async function seedHomePromoSections() {
  console.log("Checking home_promo_sections table...");

  const { data: existing, error: checkError } = await supabase
    .from("home_promo_sections")
    .select("id, section_key");

  if (checkError) {
    console.error(
      "Error checking table (run migration 006_home_promo_sections.sql first):",
      checkError.message
    );
    return;
  }

  if (existing && existing.length > 0) {
    console.log(`Table already has ${existing.length} promo sections. Upserting defaults...`);
  } else {
    console.log("Seeding initial 2 home promo sections...");
  }

  for (const item of DEFAULT_SECTIONS) {
    const { error: upsertError } = await supabase
      .from("home_promo_sections")
      .upsert(item, { onConflict: "section_key" });

    if (upsertError) {
      console.error(`Error inserting/updating section "${item.section_key}":`, upsertError.message);
    } else {
      console.log(`Successfully seeded/updated section: ${item.section_key}`);
    }
  }

  console.log("Seeding finished!");
}

seedHomePromoSections();
