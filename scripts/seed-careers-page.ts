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

const DEFAULT_CAREERS_SECTIONS = [
  {
    section_key: "hero",
    eyebrow_label: "Join Our Team",
    heading: "Careers at\nLamstone",
    description:
      "Be part of a growing healthcare, pharmaceutical, and beauty ecosystem.\n\nJoin our passionate team across retail pharmacies, cosmetics distribution, and corporate operations. Open roles will be posted here soon.",
    image_url: "/images/careers/careers-team-collaborating.jpg",
    primary_cta_label: "View Open Roles",
    primary_cta_url: "#careers-notice",
    secondary_cta_label: null,
    secondary_cta_url: null,
    extra_data: {
      subheading: "Be part of a growing healthcare, pharmaceutical, and beauty ecosystem.",
      secondary_description:
        "Join our passionate team across retail pharmacies, cosmetics distribution, and corporate operations. Open roles will be posted here soon.",
      badge1_label: "Equal",
      badge1_title: "Opportunity",
      badge2_label: "Growth",
      badge2_title: "Ecosystem",
      badge3_title: "Expanding Network",
      badge3_subtitle: "Kerala & South India",
    },
    is_active: true,
  },
  {
    section_key: "culture_intro",
    eyebrow_label: "Opportunities",
    heading: "Join Our Healthcare & Beauty Team",
    description:
      "We are actively expanding our retail pharmacy network, cosmetics distribution teams, and corporate operations across Kerala and South India. If you are passionate about healthcare innovation and excellence, we would love to connect.",
    image_url: null,
    primary_cta_label: "Send Resume / Connect",
    primary_cta_url: "modal:apply",
    secondary_cta_label: "Learn About Lamstone",
    secondary_cta_url: "/about",
    extra_data: {
      subheading: "Join our team — open roles will be posted here soon.",
      secondary_description:
        "We are actively expanding our retail pharmacy network, cosmetics distribution teams, and corporate operations across Kerala and South India. If you are passionate about healthcare innovation and excellence, we would love to connect.",
      icon: "Briefcase",
    },
    is_active: true,
  },
];

const DEFAULT_CULTURE_VALUES = [
  {
    icon: "Users",
    title: "Inclusive & Empowering Culture",
    description:
      "We foster an environment where talent is recognized, mentorship is active, and ideas thrive across every division.",
    display_order: 1,
    is_active: true,
  },
  {
    icon: "TrendingUp",
    title: "Accelerated Career Pathways",
    description:
      "As our retail pharmacy footprint and cosmetics distribution expand, new leadership and clinical roles emerge rapidly.",
    display_order: 2,
    is_active: true,
  },
  {
    icon: "Sparkles",
    title: "Community-Centric Impact",
    description:
      "Every prescription filled and customer consultation delivered helps elevate patient well-being across local neighborhoods.",
    display_order: 3,
    is_active: true,
  },
];

async function seedCareersPage() {
  console.log("Seeding careers_page_content table...");

  const { error: checkErr } = await supabase
    .from("careers_page_content")
    .select("id")
    .limit(1);

  if (checkErr) {
    console.error(
      "✕ Error accessing careers_page_content table. Please make sure migration 014_careers_page.sql has run in Supabase SQL editor:\n",
      checkErr.message
    );
    process.exit(1);
  }

  for (const item of DEFAULT_CAREERS_SECTIONS) {
    const { data: existing } = await supabase
      .from("careers_page_content")
      .select("id")
      .eq("section_key", item.section_key)
      .maybeSingle();

    if (existing) {
      console.log(`  - ${item.section_key} already exists in careers_page_content (skipping overwrite)`);
    } else {
      const { error: insertErr } = await supabase
        .from("careers_page_content")
        .insert(item as any);

      if (insertErr) {
        console.error(`  ✕ Error inserting ${item.section_key}:`, insertErr.message);
      } else {
        console.log(`  ✓ Seeded section ${item.section_key}`);
      }
    }
  }

  console.log("Seeding careers_culture_values table...");

  const { error: checkValuesErr } = await supabase
    .from("careers_culture_values")
    .select("id")
    .limit(1);

  if (checkValuesErr) {
    console.error(
      "✕ Error accessing careers_culture_values table. Please make sure migration 014_careers_page.sql has run in Supabase SQL editor:\n",
      checkValuesErr.message
    );
    process.exit(1);
  }

  for (const val of DEFAULT_CULTURE_VALUES) {
    const { data: existingVal } = await supabase
      .from("careers_culture_values")
      .select("id")
      .eq("title", val.title)
      .maybeSingle();

    if (existingVal) {
      console.log(`  - Culture value "${val.title}" already exists (skipping overwrite)`);
    } else {
      const { error: insertValErr } = await supabase
        .from("careers_culture_values")
        .insert(val as any);

      if (insertValErr) {
        console.error(`  ✕ Error inserting "${val.title}":`, insertValErr.message);
      } else {
        console.log(`  ✓ Seeded culture value "${val.title}"`);
      }
    }
  }

  console.log("Finished seeding Careers page and culture values.");
}

seedCareersPage().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
