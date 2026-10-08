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

const DEFAULT_DIVISIONS = [
  {
    badge_label: "PHARMACY CHAIN",
    title: "Lamstone Pharmacy Chain",
    description:
      "Lamstone is a rapidly expanding network of premium pharmacies across Kerala, committed to delivering authentic medicines, expert healthcare guidance, and a comprehensive range of wellness and personal care products. With a vision to redefine pharmaceutical retail excellence, Lamstone is strategically acquiring and integrating 500+ pharmacies across the state, building a trusted healthcare ecosystem that combines accessibility, innovation, and customer-centric care under one unified brand experience.",
    image_url: "/images/home/pharmacy-luxury-storefront.jpg",
    link_url: "/pharmacy-chain",
    cta_label: "Our Pharmacies",
    display_order: 1,
    is_active: true,
  },
  {
    badge_label: "COSMETICS DIVISION",
    title: "Lamstone Cosmetics Division",
    description:
      "Lamstone is a leading distributor of globally renowned beauty and personal care brands, including Dove, Pears, Mamaearth, Lotus, Jovees, Johnson & Johnson, Cetaphil, Pantene, Ponds, Head & Shoulders, and Sebamed. Committed to authenticity and quality, we supply high-demand cosmetic products across the region, catering to modern beauty, wellness, and personal care needs.",
    image_url: "/images/home/cosmetics-luxury-flatlay.jpg",
    link_url: "/cosmetics",
    cta_label: "Brand Collection",
    display_order: 2,
    is_active: true,
  },
];

async function seedCoreDivisions() {
  console.log("Checking core_divisions table...");

  const { data: existing, error: checkError } = await supabase
    .from("core_divisions")
    .select("id, title");

  if (checkError) {
    console.error("Error checking table (run migration 005_core_divisions.sql first):", checkError.message);
    return;
  }

  if (existing && existing.length > 0) {
    console.log(`Table already has ${existing.length} core divisions. Skipping seed.`);
    return;
  }

  console.log("Seeding initial 2 core divisions...");
  const { error: insertError } = await supabase
    .from("core_divisions")
    .insert(DEFAULT_DIVISIONS);

  if (insertError) {
    console.error("Error inserting core divisions:", insertError.message);
  } else {
    console.log("Successfully inserted 2 core divisions!");
  }
}

seedCoreDivisions();
