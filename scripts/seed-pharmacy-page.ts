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

interface PharmacySectionSeed {
  section_key: string;
  eyebrow_label: string;
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

const DEFAULT_PHARMACY_SECTIONS: PharmacySectionSeed[] = [
  {
    section_key: "hero",
    eyebrow_label: "Pharmacy Network",
    heading: "Trusted Medicines.\nEvery Neighborhood.",
    description:
      "Expanding access to authentic, high-quality pharmaceuticals across Kerala.\n\nDelivering reliable community-first dispensaries, cold-chain integrity, and expert pharmacist care to every neighborhood.",
    image_url: "/images/pharmacy/pharmacy-hero-clean.jpg",
    primary_cta_label: "Our Pharmacies",
    primary_cta_url: "#locations",
    secondary_cta_label: "Partner With Us",
    secondary_cta_url: "modal:partner",
    extra_data: {
      stat_target_count: 500,
      stat_target_label: "Pharmacies (Target)",
      stat_active_count: 8,
      stat_active_label: "Active Locations",
      stat_districts_count: 14,
      stat_districts_label: "Kerala Districts",
    },
    is_active: true,
  },
  {
    section_key: "redefining",
    eyebrow_label: "Statewide Integration",
    heading: "Redefining Pharmaceutical Retail in Kerala",
    description:
      "Lamstone is strategically acquiring and integrating 500+ pharmacies across Kerala. We unite neighborhood accessibility with institutional pharmacy rigor, cold-chain integrity, and digitized prescription fulfillment.",
    image_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85",
    primary_cta_label: null,
    primary_cta_url: null,
    secondary_cta_label: null,
    secondary_cta_url: null,
    extra_data: {
      badges: [
        { icon: "ShieldCheck", title: "100% Authentic", desc: "Verified pharmaceutical sourcing & safety." },
        { icon: "Building2", title: "500+ Goal", desc: "Expanding across all 14 districts." },
        { icon: "Clock", title: "Expert Care", desc: "Registered pharmacists for consultations." },
      ],
    },
    is_active: true,
  },
  {
    section_key: "dispensaries",
    eyebrow_label: "Physical Footprint",
    heading: "Modern Community Dispensaries",
    description:
      "Standardized, clinical dispensary storefronts combining transparent pharmacy service with genuine personal care access.",
    image_url: "/images/banners/pharmacy-storefront.jpeg",
    primary_cta_label: "Partner With Us",
    primary_cta_url: "/contact",
    secondary_cta_label: null,
    secondary_cta_url: null,
    extra_data: {
      badge_tag: "Unified Pharmacy Network",
      card_title: "Lamstone Healthcare Pharmacy",
      card_subtitle: "Prescriptions • Healthcare Products • Personal Care • Baby Care • Wellness",
    },
    is_active: true,
  },
  {
    section_key: "cta_banner",
    eyebrow_label: "Pharmacy Partnership",
    heading: "Are You a Pharmacy Owner Interested in Joining Lamstone?",
    description:
      "We partner with independent pharmacy owners across Kerala, offering transparent acquisition pathways and growth models.",
    image_url: null,
    primary_cta_label: "Explore Pharmacy Partnership",
    primary_cta_url: "modal:partner",
    secondary_cta_label: null,
    secondary_cta_url: null,
    extra_data: {},
    is_active: true,
  },
];

async function seedPharmacyPage() {
  console.log("Seeding pharmacy_page_content table...");

  const { error: checkErr } = await supabase
    .from("pharmacy_page_content")
    .select("count", { count: "exact", head: true });

  if (checkErr) {
    console.error(
      "✕ Error accessing pharmacy_page_content table. Please make sure migration 009_pharmacy_page.sql has run in Supabase SQL editor:\n",
      checkErr.message
    );
    process.exit(1);
  }

  for (const item of DEFAULT_PHARMACY_SECTIONS) {
    const { data: existing } = await supabase
      .from("pharmacy_page_content")
      .select("id")
      .eq("section_key", item.section_key)
      .maybeSingle();

    if (existing) {
      console.log(`  - ${item.section_key} already exists (skipping overwrite to preserve edits)`);
    } else {
      const { error: insertErr } = await supabase
        .from("pharmacy_page_content")
        .insert(item);

      if (insertErr) {
        console.error(`  ✕ Error inserting ${item.section_key}:`, insertErr.message);
      } else {
        console.log(`  ✓ Seeded ${item.section_key}`);
      }
    }
  }

  console.log("Finished seeding pharmacy_page_content.");
}

seedPharmacyPage().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
