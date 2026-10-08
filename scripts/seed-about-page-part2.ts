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

const DEFAULT_VALUES = [
  {
    icon: "ShieldCheck",
    title: "Quality First",
    description: "We never compromise on quality, safety or integrity.",
    display_order: 0,
    is_active: true,
  },
  {
    icon: "Lightbulb",
    title: "Innovation",
    description: "We embrace change and invest in better solutions for tomorrow.",
    display_order: 1,
    is_active: true,
  },
  {
    icon: "Users",
    title: "People & Communities",
    description: "We care for our people, our partners and the communities we serve.",
    display_order: 2,
    is_active: true,
  },
  {
    icon: "Heart",
    title: "Loyalty & Customer Care",
    description: "We put our customers first, building lasting trust through care and reliability.",
    display_order: 3,
    is_active: true,
  },
];

const DEFAULT_MILESTONES = [
  {
    year: "2019",
    milestone_label: "MILESTONE 01",
    title: "Inception of Lamstone",
    description: "Lamstone's journey began with a vision to deliver affordable healthcare.",
    display_order: 0,
    is_active: true,
  },
  {
    year: "2021",
    milestone_label: "MILESTONE 02",
    title: "Pharmacy Chain Expansion",
    description: "Opened multiple stores, locations across Kerala to increase accessibility.",
    display_order: 1,
    is_active: true,
  },
  {
    year: "2023",
    milestone_label: "MILESTONE 03",
    title: "Cosmetics Division Launch",
    description: "Introduced high-quality beauty & personal care products.",
    display_order: 2,
    is_active: true,
  },
  {
    year: "2024",
    milestone_label: "MILESTONE 04",
    title: "LAMÉ Brand & Global Reach",
    description: "Launched our proprietary cosmetics line, LAMÉ, and growing operations.",
    display_order: 3,
    is_active: true,
  },
];

const CAMPUS_DATA = {
  section_key: "campus",
  eyebrow_label: "Our Campus",
  heading: "A Modern Infrastructure",
  description:
    "Our state-of-the-art facilities are designed to support innovation, research and world-class manufacturing. With cutting-edge technology and strict quality standards, we ensure that every product meets the highest level of excellence.",
  image_url: "/images/about/corporate-head-office.jpg",
  cta_label: "Our Manufacturing Units",
  cta_url: "/pharmacy-chain",
  extra_data: {
    badge_subtitle: "Pharma | Cosmetics | Personal Care",
    image_caption: "Corporate Head Office — Bio 360, Kerala Life Sciences Industrial Park",
  },
  is_active: true,
};

async function seedPart2() {
  console.log("Seeding About Page Part 2 (Values, Milestones, Campus)...");

  // 1. Campus in about_page_content
  console.log("1. Checking 'campus' section in about_page_content...");
  const { data: existingCampus } = await supabase
    .from("about_page_content")
    .select("id")
    .eq("section_key", "campus")
    .maybeSingle();

  if (existingCampus) {
    console.log("  - Campus row already exists in about_page_content.");
  } else {
    const { error: campusErr } = await supabase
      .from("about_page_content")
      .insert(CAMPUS_DATA);
    if (campusErr) {
      console.error("  ✕ Error inserting campus row:", campusErr.message);
    } else {
      console.log("  ✓ Inserted campus section into about_page_content.");
    }
  }

  // 2. about_values
  console.log("2. Checking about_values table...");
  const { error: valuesCheckErr } = await supabase
    .from("about_values")
    .select("count", { count: "exact", head: true });

  if (valuesCheckErr) {
    console.error(
      "  ✕ about_values table not found. Please apply 008_about_page_lists.sql migration in Supabase SQL editor first!"
    );
  } else {
    for (const val of DEFAULT_VALUES) {
      const { data: existingVal } = await supabase
        .from("about_values")
        .select("id")
        .eq("title", val.title)
        .maybeSingle();

      if (existingVal) {
        console.log(`  - Value "${val.title}" already exists (skipped)`);
      } else {
        const { error: insertValErr } = await supabase
          .from("about_values")
          .insert(val);
        if (insertValErr) {
          console.error(`  ✕ Error inserting value "${val.title}":`, insertValErr.message);
        } else {
          console.log(`  ✓ Inserted value "${val.title}"`);
        }
      }
    }
  }

  // 3. about_milestones
  console.log("3. Checking about_milestones table...");
  const { error: milesCheckErr } = await supabase
    .from("about_milestones")
    .select("count", { count: "exact", head: true });

  if (milesCheckErr) {
    console.error(
      "  ✕ about_milestones table not found. Please apply 008_about_page_lists.sql migration in Supabase SQL editor first!"
    );
  } else {
    for (const step of DEFAULT_MILESTONES) {
      const { data: existingMile } = await supabase
        .from("about_milestones")
        .select("id")
        .eq("year", step.year)
        .eq("milestone_label", step.milestone_label)
        .maybeSingle();

      if (existingMile) {
        console.log(`  - Milestone ${step.year} (${step.milestone_label}) already exists (skipped)`);
      } else {
        const { error: insertMileErr } = await supabase
          .from("about_milestones")
          .insert(step);
        if (insertMileErr) {
          console.error(`  ✕ Error inserting milestone ${step.year}:`, insertMileErr.message);
        } else {
          console.log(`  ✓ Inserted milestone ${step.year} (${step.milestone_label})`);
        }
      }
    }
  }

  console.log("Finished About Page Part 2 seed check.");
}

seedPart2().catch((err) => {
  console.error("Fatal Part 2 seed error:", err);
  process.exit(1);
});
