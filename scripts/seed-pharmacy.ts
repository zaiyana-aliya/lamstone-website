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

const PHARMACY_LOCATIONS = [
  { name: "Puthalath Medicals", area: "Villiapally, Vadakara", district: "Calicut", display_order: 1 },
  { name: "Janananma Medicals", area: "Angadipuram", district: "Malappuram", display_order: 2 },
  { name: "Medcity Medicals", area: "Mulleria", district: "Kasaragod", display_order: 3 },
  { name: "Meditech Medicals", area: "Kambil", district: "Kannur", display_order: 4 },
  { name: "Illikal Medicals", area: "Koottilangadi", district: "Malappuram", display_order: 5 },
  { name: "Sahakar Medicals", area: "Edappaly, Kochi", district: "Ernakulam", display_order: 6 },
  { name: "Shobha Medicals", area: "East Fort", district: "Thiruvananthapuram", display_order: 7 },
  { name: "Gulf Medicals", area: "Mankavu", district: "Calicut", display_order: 8 },
];

async function seedPharmacies() {
  console.log("Seeding pharmacy branches to Supabase...");

  for (const loc of PHARMACY_LOCATIONS) {
    const { data: existing } = await supabase
      .from("pharmacy_locations")
      .select("id")
      .eq("name", loc.name)
      .maybeSingle();

    if (existing) {
      console.log(`- Skipping ${loc.name} (already exists)`);
    } else {
      const { error } = await supabase.from("pharmacy_locations").insert({
        ...loc,
        status: "open_dispensing",
        phone: "+91 9746397686",
      });

      if (error) {
        console.error(`- Error inserting ${loc.name}:`, error.message);
      } else {
        console.log(`✔ Inserted ${loc.name} (${loc.district})`);
      }
    }
  }

  console.log("Pharmacy seeding complete!");
}

seedPharmacies().catch(console.error);
