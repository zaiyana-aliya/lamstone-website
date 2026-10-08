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

interface AboutSectionSeed {
  section_key: string;
  eyebrow_label: string;
  heading: string;
  description: string;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  extra_data?: Record<string, any>;
  is_active: boolean;
}

const DEFAULT_ABOUT_SECTIONS: AboutSectionSeed[] = [
  {
    section_key: "hero",
    eyebrow_label: "About Us",
    heading: "About\nLamstone",
    description:
      "Pioneering a holistic approach to wellness by integrating reliable pharmaceutical services with premium cosmetic solutions.\n\nLamstone is a diversified group with a strong presence in pharmaceuticals, cosmetics, personal care and investments. We are committed to improving lives through quality, innovation and care.",
    image_url: "/images/about/corporate-building-clean.jpg",
    cta_label: "Our Journey",
    cta_url: "#story",
    extra_data: {
      subheading:
        "Pioneering a holistic approach to wellness by integrating reliable pharmaceutical services with premium cosmetic solutions.",
      secondary_description:
        "Lamstone is a diversified group with a strong presence in pharmaceuticals, cosmetics, personal care and investments. We are committed to improving lives through quality, innovation and care.",
      stat_trusted_year: "2019",
      stat_pharmacies_count: "500+",
      stat_delivery_title: "Home Delivery",
      stat_delivery_subtitle: "Straight to your door",
    },
    is_active: true,
  },
  {
    section_key: "story",
    eyebrow_label: "Our Story",
    heading: "From a Vision\nto a Healthier Future",
    description:
      "What started as a single vision — to make quality healthcare and beauty accessible to all — has now grown into a diversified group, trusted by millions.\n\nOver the years, Lamstone has expanded its footprint across healthcare, skincare, personal care and investments, driven by a commitment to trust, quality and long-term value.",
    image_url: "/images/about/lamstone-about-story.jpg",
    cta_label: "Learn More About Us",
    cta_url: "/contact",
    extra_data: {
      lead_subheading:
        "What started as a single vision — to make quality healthcare and beauty accessible to all — has now grown into a diversified group, trusted by millions.",
      secondary_body:
        "Over the years, Lamstone has expanded its footprint across healthcare, skincare, personal care and investments, driven by a commitment to trust, quality and long-term value.",
    },
    is_active: true,
  },
  {
    section_key: "vision",
    eyebrow_label: "Our Vision & Mission",
    heading: "The Future We See",
    description:
      "To be the most trusted healthcare and beauty destination, empowering individuals to live healthier, more confident lives.",
    image_url: null,
    cta_label: null,
    cta_url: null,
    extra_data: {
      tagline: "Aspirational Horizon",
    },
    is_active: true,
  },
  {
    section_key: "mission",
    eyebrow_label: "Our Vision & Mission",
    heading: "The Promise We Keep",
    description:
      "To provide unparalleled access to genuine medicines, expert care, and scientifically-backed beauty products through continuous innovation.",
    image_url: null,
    cta_label: null,
    cta_url: null,
    extra_data: {
      tagline: "Actionable Purpose",
    },
    is_active: true,
  },
  {
    section_key: "photo_band",
    eyebrow_label: "",
    heading: "A Growing Healthcare Ecosystem Since 2019",
    description: "Modern Lamstone Healthcare corporate headquarters and clinical campus",
    image_url: "/images/about/lamstone-healthcare-headquarters.jpg",
    cta_label: null,
    cta_url: null,
    extra_data: {
      object_position: "center 35%",
      subheadline: "",
    },
    is_active: true,
  },
];

async function seedAboutPage() {
  console.log("Seeding about_page_content table...");

  const { data: checkTable, error: checkErr } = await supabase
    .from("about_page_content")
    .select("count", { count: "exact", head: true });

  if (checkErr) {
    console.error(
      "Error accessing about_page_content. Please make sure migration 007_about_page.sql has run in Supabase:\n",
      checkErr.message
    );
    process.exit(1);
  }

  for (const item of DEFAULT_ABOUT_SECTIONS) {
    const { data: existing } = await supabase
      .from("about_page_content")
      .select("id")
      .eq("section_key", item.section_key)
      .maybeSingle();

    if (existing) {
      console.log(`  - ${item.section_key} already exists (skipping overwrite to preserve edits)`);
    } else {
      const { error: insertErr } = await supabase
        .from("about_page_content")
        .insert({
          section_key: item.section_key,
          eyebrow_label: item.eyebrow_label,
          heading: item.heading,
          description: item.description,
          image_url: item.image_url,
          cta_label: item.cta_label,
          cta_url: item.cta_url,
          extra_data: item.extra_data,
          is_active: item.is_active,
        });

      if (insertErr) {
        console.error(`  ✕ Error inserting ${item.section_key}:`, insertErr.message);
      } else {
        console.log(`  ✓ Seeded ${item.section_key}`);
      }
    }
  }

  console.log("Finished seeding about_page_content.");
}

seedAboutPage().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
