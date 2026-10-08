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

interface BlogSectionSeed {
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

const DEFAULT_BLOG_SECTIONS: BlogSectionSeed[] = [
  {
    section_key: "hero",
    eyebrow_label: "Insights & Perspectives",
    heading: "Blogs &\nPerspectives",
    description:
      "Thought leadership, healthcare innovations, skincare science, and ecosystem milestones.\n\nExplore in-depth articles, scientific perspectives, and executive insights from the teams shaping Lamstone HealthCare.",
    image_url: "/images/blog-hero-reading.jpg",
    primary_cta_label: "Explore Articles",
    primary_cta_url: "#articles",
    extra_data: {
      subheading: "Thought leadership, healthcare innovations, skincare science, and ecosystem milestones.",
      secondary_description:
        "Explore in-depth articles, scientific perspectives, and executive insights from the teams shaping Lamstone HealthCare.",
      badge_1_label: "Curated",
      badge_1_value: "Insights",
      badge_2_value: "3",
      badge_2_label: "Core Pillars",
      badge_3_title: "Regular Edition",
      badge_3_sub: "Healthcare & Science",
    },
    is_active: true,
  },
];

async function seedBlogPage() {
  console.log("Seeding blog_page_content table...");

  const { error: checkErr } = await supabase
    .from("blog_page_content")
    .select("count", { count: "exact", head: true });

  if (checkErr) {
    console.error(
      "✕ Error accessing blog_page_content table. Please make sure migration 012_blog_page.sql has run in Supabase SQL editor:\n",
      checkErr.message
    );
    process.exit(1);
  }

  for (const item of DEFAULT_BLOG_SECTIONS) {
    const { data: existing } = await supabase
      .from("blog_page_content")
      .select("id")
      .eq("section_key", item.section_key)
      .maybeSingle();

    if (existing) {
      console.log(`  - ${item.section_key} already exists (skipping overwrite to preserve edits)`);
    } else {
      const { error: insertErr } = await supabase
        .from("blog_page_content")
        .insert(item);

      if (insertErr) {
        console.error(`  ✕ Error inserting ${item.section_key}:`, insertErr.message);
      } else {
        console.log(`  ✓ Seeded ${item.section_key}`);
      }
    }
  }

  console.log("Finished seeding blog_page_content.");
}

seedBlogPage().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
