import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const DEFAULT_DIVISION_CARDS = [
  {
    title: "Pharmacy Chain",
    subtitle: "500+ Pharmacies Statewide",
    icon: "Building2",
    link_url: "/pharmacy-chain",
    display_order: 1,
    is_active: true,
  },
  {
    title: "Cosmetics Division",
    subtitle: "Trusted Global Brands",
    icon: "Sparkles",
    link_url: "/cosmetics",
    display_order: 2,
    is_active: true,
  },
  {
    title: "Lamé",
    subtitle: "Clinically Tested, Cruelty-Free",
    icon: "ShieldCheck",
    link_url: "/lame",
    display_order: 3,
    is_active: true,
  },
  {
    title: "Overall",
    subtitle: "Trust & Innovation Since 2019",
    icon: "Award",
    link_url: "/about",
    display_order: 4,
    is_active: true,
  },
];

async function seed() {
  console.log("Checking division_cards table...");

  const { data: existing, error: checkError } = await supabase
    .from("division_cards")
    .select("id, title")
    .limit(5);

  if (checkError) {
    console.error("Table check error:", checkError.message);
    console.log("\nIf the table does not exist yet, please execute supabase/migrations/004_division_cards.sql in the Supabase SQL editor:");
    console.log("https://supabase.com/dashboard/project/erytiiodcekrfledmjfs/sql\n");
    return;
  }

  if (existing && existing.length > 0) {
    console.log(`Table already has ${existing.length} records. Skipping seed.`);
    return;
  }

  console.log("Seeding initial 4 division cards...");
  const { data, error: insertError } = await supabase
    .from("division_cards")
    .insert(DEFAULT_DIVISION_CARDS)
    .select();

  if (insertError) {
    console.error("Error inserting division cards:", insertError.message);
    return;
  }

  console.log(`Successfully inserted ${data.length} division cards!`);
}

seed().catch(console.error);
