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

const DEFAULT_INVEST_SECTIONS = [
  {
    section_key: "hero",
    eyebrow_label: "Partnership Opportunities",
    heading: "Invest in\nLamstone",
    description:
      "Join our rapidly expanding pharmacy chain and beauty ecosystem.\n\nWe offer transparent, secure, and lucrative partnership models for forward-thinking investors seeking defensive, high-growth healthcare ventures.",
    image_url: "/images/invest/invest-corporate-skyline-clean.jpg",
    primary_cta_label: "Request Investment Deck",
    primary_cta_url: "modal:deck",
    secondary_cta_label: "Why Lamstone",
    secondary_cta_url: "#why-invest",
    extra_data: {
      subheading: "Join our rapidly expanding pharmacy chain and beauty ecosystem.",
      secondary_description:
        "We offer transparent, secure, and lucrative partnership models for forward-thinking investors seeking defensive, high-growth healthcare ventures.",
    },
    is_active: true,
  },
  {
    section_key: "why_invest",
    eyebrow_label: "The Investment Case",
    heading: "Why Invest in Lamstone?",
    description:
      "Healthcare retail is one of the most defensible, scalable industries in emerging markets — and Lamstone is positioned at its frontier.",
    image_url: null,
    primary_cta_label: null,
    primary_cta_url: null,
    secondary_cta_label: null,
    secondary_cta_url: null,
    extra_data: {
      cards: [
        {
          icon: "TrendingUp",
          title: "Proven Growth Trajectory",
          description:
            "Lamstone is aggressively expanding through a strategic pharmacy acquisition plan, with each integrated pharmacy representing an existing revenue-generating asset.",
        },
        {
          icon: "ShieldCheck",
          title: "Recession-Resistant Industry",
          description:
            "Healthcare is a fundamental, non-discretionary market. The pharmacy sector remains resilient across economic cycles, providing stable, long-term returns.",
        },
        {
          icon: "Users",
          title: "Expert Management & Operations",
          description:
            "Our team combines deep pharmaceutical knowledge with modern retail management, brand building, and supply chain optimization expertise.",
        },
      ],
    },
    is_active: true,
  },
  {
    section_key: "pathways",
    eyebrow_label: "Partnership Model",
    heading: "Transparent & Structured Investment Pathways",
    description:
      "We believe that informed investors are long-term partners. Our investor relations team provides clear financial projections, regular reporting, and direct access to operations leadership.",
    image_url:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    primary_cta_label: "Request Partnership Details",
    primary_cta_url: "modal:partnership",
    secondary_cta_label: null,
    secondary_cta_url: null,
    extra_data: {
      bullet_points: [
        "Strategic pharmacy acquisition",
        "Brand distribution equity",
        "Lamé co-branding opportunities",
      ],
    },
    is_active: true,
  },
  {
    section_key: "cta_banner",
    eyebrow_label: null,
    heading: "Ready to Grow With Lamstone?",
    description:
      "Connect with our leadership to explore structured investment, strategic co-branding, or network partnerships.",
    image_url: null,
    primary_cta_label: "Request Information Memorandum",
    primary_cta_url: "modal:memorandum",
    secondary_cta_label: null,
    secondary_cta_url: null,
    extra_data: {},
    is_active: true,
  },
];

const DEFAULT_OPPORTUNITIES = [
  {
    icon: "Building2",
    category_tag: "Healthcare Retail Hypermarket",
    title: "Attingal Healthcare Hypermarket",
    location: "Attingal, Thiruvananthapuram",
    description:
      "Partnership opportunity in Attingal — contact us for project prospectus, equity structure, and operational timeline.",
    cta_url: "modal:inquiry",
    display_order: 1,
    is_active: true,
  },
  {
    icon: "Sparkles",
    category_tag: "Luxury Cosmetics & Personal Care",
    title: "Lamé Cosmetics – Kottarakara",
    location: "Kottarakara, Kollam",
    description:
      "Partnership opportunity in Kottarakara — contact us for retail footprint, brand co-ownership, and projected returns.",
    cta_url: "modal:inquiry",
    display_order: 2,
    is_active: true,
  },
  {
    icon: "Pill",
    category_tag: "Pharmacy & Cosmetics Retail",
    title: "Lamstone Pharmacy & Cosmetics, Nagaroor",
    location: "Nagaroor, Thiruvananthapuram",
    description:
      "Partnership opportunity in Nagaroor — contact us for branch financials, customer catchment details, and turnkey operations.",
    cta_url: "modal:inquiry",
    display_order: 3,
    is_active: true,
  },
  {
    icon: "Pill",
    category_tag: "Retail Pharmacy Network",
    title: "Lamstone Pharmacy, Kodungalloor",
    location: "Kodungalloor, Thrissur",
    description:
      "Partnership opportunity in Kodungalloor — contact us for branch location details, revenue forecasts, and partnership options.",
    cta_url: "modal:inquiry",
    display_order: 4,
    is_active: true,
  },
];

async function seedInvestPage() {
  console.log("Seeding invest_page_content table...");

  const { error: checkErr } = await supabase
    .from("invest_page_content")
    .select("count", { count: "exact", head: true });

  if (checkErr) {
    console.error(
      "✕ Error accessing invest_page_content table. Please make sure migration 013_invest_page.sql has run in Supabase SQL editor:\n",
      checkErr.message
    );
    process.exit(1);
  }

  for (const item of DEFAULT_INVEST_SECTIONS) {
    const { data: existing } = await supabase
      .from("invest_page_content")
      .select("id")
      .eq("section_key", item.section_key)
      .maybeSingle();

    if (existing) {
      console.log(`  - ${item.section_key} already exists in invest_page_content (skipping overwrite)`);
    } else {
      const { error: insertErr } = await supabase
        .from("invest_page_content")
        .insert(item as any);

      if (insertErr) {
        console.error(`  ✕ Error inserting ${item.section_key}:`, insertErr.message);
      } else {
        console.log(`  ✓ Seeded section ${item.section_key}`);
      }
    }
  }

  console.log("Seeding investment_opportunities table...");
  const { error: checkOppErr } = await supabase
    .from("investment_opportunities")
    .select("id")
    .limit(1);

  if (checkOppErr) {
    console.error(
      "✕ Error accessing investment_opportunities table. Please make sure migration 013_invest_page.sql has run in Supabase SQL editor:\n",
      checkOppErr.message
    );
    process.exit(1);
  }

  for (const opp of DEFAULT_OPPORTUNITIES) {
    const { data: existingOpp } = await supabase
      .from("investment_opportunities")
      .select("id")
      .eq("title", opp.title)
      .maybeSingle();

    if (existingOpp) {
      console.log(`  - Opportunity "${opp.title}" already exists (skipping overwrite)`);
    } else {
      const { error: insertOppErr } = await supabase
        .from("investment_opportunities")
        .insert(opp as any);

      if (insertOppErr) {
        console.error(`  ✕ Error inserting "${opp.title}":`, insertOppErr.message);
      } else {
        console.log(`  ✓ Seeded opportunity "${opp.title}"`);
      }
    }
  }

  console.log("Finished seeding Invest page and opportunities.");
}

seedInvestPage().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
