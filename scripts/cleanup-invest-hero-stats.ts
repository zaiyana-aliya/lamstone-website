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

async function cleanup() {
  console.log("Fetching invest hero section from DB...");
  const { data, error } = await supabase
    .from("invest_page_content")
    .select("*")
    .eq("section_key", "hero")
    .single();

  if (error) {
    console.error("Error fetching hero section:", error.message);
    process.exit(1);
  }

  console.log("Current hero extra_data:", data.extra_data);

  if (data.extra_data) {
    const updatedExtra = { ...data.extra_data };
    delete updatedExtra.stat_target_pharmacies;
    delete updatedExtra.stat_districts;
    delete updatedExtra.stat_brand_partners;
    delete updatedExtra.stat_authentic_badge;

    console.log("Cleaned hero extra_data:", updatedExtra);

    const { error: updateError } = await supabase
      .from("invest_page_content")
      .update({
        extra_data: updatedExtra,
        updated_at: new Date().toISOString(),
      })
      .eq("section_key", "hero");

    if (updateError) {
      console.error("Error updating hero section:", updateError.message);
      process.exit(1);
    }

    console.log("Successfully cleaned up invest hero stats from DB!");
  } else {
    console.log("No extra_data found on hero row.");
  }
}

cleanup();
