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

// ─── 1. PHARMACEUTICAL PARTNERS (30) ──────────────────────────────────────────
const PHARMA_PARTNERS = [
  { name: "Sun Pharmaceutical Industries", category_label: "Formulations", logo_url: "/images/pharma-partners/sun-pharma.svg" },
  { name: "Abbott India", category_label: "Nutrition & Care", logo_url: "/images/pharma-partners/abbott-india.png" },
  { name: "Cipla", category_label: "Respiratory Care", logo_url: "/images/pharma-partners/cipla.svg" },
  { name: "Mankind Pharma", category_label: "Therapeutics & OTC", logo_url: "/images/pharma-partners/mankind-pharma.png" },
  { name: "Alkem Laboratories", category_label: "Anti-Infectives", logo_url: "/images/pharma-partners/alkem-laboratories.png" },
  { name: "Torrent Pharmaceuticals", category_label: "Cardiovascular", logo_url: "/images/pharma-partners/torrent-pharmaceuticals.png" },
  { name: "Lupin", category_label: "Formulations", logo_url: "/images/pharma-partners/lupin.png" },
  { name: "Zydus Lifesciences", category_label: "Biologics", logo_url: "/images/pharma-partners/zydus-lifesciences.png" },
  { name: "Dr. Reddy's Laboratories", category_label: "Biosimilars", logo_url: "/images/pharma-partners/dr-reddys.svg" },
  { name: "Intas Pharmaceuticals", category_label: "Biopharma", logo_url: "/images/pharma-partners/intas-pharmaceuticals.svg" },
  { name: "Macleods Pharmaceuticals", category_label: "Essential Meds", logo_url: "/images/pharma-partners/macleods-pharmaceuticals.png" },
  { name: "Glenmark Pharmaceuticals", category_label: "Dermatology", logo_url: "/images/pharma-partners/glenmark-pharmaceuticals.jpg" },
  { name: "USV", category_label: "Cardio-Diabetic", logo_url: "/images/pharma-partners/usv.png" },
  { name: "Aristo Pharmaceuticals", category_label: "Prescriptions", logo_url: "/images/pharma-partners/aristo-pharmaceuticals.png" },
  { name: "Micro Labs", category_label: "Cardio Care", logo_url: "/images/pharma-partners/micro-labs.png" },
  { name: "IPCA Laboratories", category_label: "Formulations", logo_url: "/images/pharma-partners/ipca-laboratories.png" },
  { name: "Eris Lifesciences", category_label: "Chronic Therapy", logo_url: "/images/pharma-partners/eris-lifesciences.png" },
  { name: "Ajanta Pharma", category_label: "Specialty Pharma", logo_url: "/images/pharma-partners/ajanta-pharma.png" },
  { name: "Emcure Pharmaceuticals", category_label: "Cardiology", logo_url: "/images/pharma-partners/emcure-pharmaceuticals.png" },
  { name: "Alembic Pharmaceuticals", category_label: "Active Ingredients", logo_url: "/images/pharma-partners/alembic-pharmaceuticals.png" },
  { name: "Aurobindo Pharma", category_label: "Generics", logo_url: "/images/pharma-partners/aurobindo-pharma.png" },
  { name: "Hetero", category_label: "Therapeutics", logo_url: "/images/pharma-partners/hetero.png" },
  { name: "Biocon", category_label: "Biotechnology", logo_url: "/images/pharma-partners/biocon.png" },
  { name: "Sanofi India", category_label: "Vaccines & Care", logo_url: "/images/pharma-partners/sanofi-india.svg" },
  { name: "Pfizer India", category_label: "Biopharma", logo_url: "/images/pharma-partners/pfizer-india.svg" },
  { name: "GSK India", category_label: "Vaccines", logo_url: "/images/pharma-partners/gsk-india.png" },
  { name: "Merck", category_label: "Specialty Care", logo_url: "/images/pharma-partners/merck.png" },
  { name: "Novo Nordisk", category_label: "Diabetes Care", logo_url: "/images/pharma-partners/novo-nordisk.png" },
  { name: "Eli Lilly", category_label: "Endocrinology", logo_url: "/images/pharma-partners/eli-lilly.png" },
  { name: "Himalaya Wellness", category_label: "Herbal Wellness", logo_url: "/images/pharma-partners/himalaya-wellness.png" },
];

// ─── 2. COSMETICS BRANDS (9) ──────────────────────────────────────────────────
const COSMETICS_BRANDS = [
  { name: "Lotus", category_label: "Botanical & Natural", logo_url: "/images/brands/lotus.png" },
  { name: "Mamaearth", category_label: "Toxin-Free Beauty", logo_url: "/images/brands/mamaearth.png" },
  { name: "Ponds", category_label: "Classic Skincare", logo_url: "/images/brands/ponds.png" },
  { name: "Cetaphil", category_label: "Dermatologist Recommended", logo_url: "/images/brands/cetaphil.png" },
  { name: "Lakmé", category_label: "Iconic Color & Care", logo_url: "/images/brands/lakme.jpg" },
  { name: "Dove", category_label: "Nourishing Care", logo_url: "/images/brands/dove.png" },
  { name: "Jovees", category_label: "Herbal Formulations", logo_url: "/images/brands/jovees.jpg" },
  { name: "Sebamed", category_label: "pH 5.5 Clinical Skincare", logo_url: "/images/brands/sebamed.jpg" },
  { name: "Femisafe", category_label: "Intimate & Personal Wellness", logo_url: "/images/brands/femisafe.jpg" },
];

// ─── 3. PRODUCT CATEGORIES (Pharmacy & Cosmetics) ─────────────────────────────
const PRODUCT_CATEGORIES = [
  // Pharmacy Categories
  {
    page_name: "pharmacy",
    title: "Medicines",
    subtitle: "Prescription and general medicines",
    description: "Wide spectrum of life-saving, acute, and chronic prescription medications stored under strict temperature control.",
    image_url: null,
    features_json: ["Full cold-chain compliance", "Doctor prescription verification", "Automated batch tracing"],
    cta_label: "Locate Dispensary",
    cta_link: "/pharmacy-chain#locations",
  },
  {
    page_name: "pharmacy",
    title: "OTC Products",
    subtitle: "Over-the-counter healthcare essentials",
    description: "Daily healthcare, first-aid, pain relief, and seasonal remedy essentials available over the counter.",
    image_url: null,
    features_json: ["Immediate counter availability", "Top OTC brand selection", "Pharmacist consultation"],
    cta_label: "Locate Dispensary",
    cta_link: "/pharmacy-chain#locations",
  },
  {
    page_name: "pharmacy",
    title: "Food Products",
    subtitle: "Nutrition and wellness food items",
    description: "Nutraceuticals, protein supplements, diabetic nutrition, and herbal wellness drinks.",
    image_url: null,
    features_json: ["Dietary supplements", "Sugar-free essentials", "Herbal infusions"],
    cta_label: "Locate Dispensary",
    cta_link: "/pharmacy-chain#locations",
  },
  {
    page_name: "pharmacy",
    title: "Baby Care",
    subtitle: "Baby and infant care essentials",
    description: "Pediatric formulations, gentle baby skincare, infant feeding accessories, and hygiene essentials.",
    image_url: null,
    features_json: ["Dermatologically tested", "Pediatrician recommended", "Hypoallergenic products"],
    cta_label: "Locate Dispensary",
    cta_link: "/pharmacy-chain#locations",
  },
  {
    page_name: "pharmacy",
    title: "Cosmetics",
    subtitle: "Beauty and personal care products",
    description: "Medicated cosmetics, dermatological sunscreens, premium cleansers, and personal wellness lines.",
    image_url: null,
    features_json: ["Clinical dermatological brands", "Skin-barrier care", "Certified genuine"],
    cta_label: "Locate Dispensary",
    cta_link: "/pharmacy-chain#locations",
  },
  // Cosmetics Categories
  {
    page_name: "cosmetics",
    title: "Skincare",
    subtitle: "Facial Care & Dermatological Formulations",
    description: "Engineered to cleanse, nourish, protect, and restore skin health across all skin types.",
    image_url: "/images/cosmetics/category-skincare.jpg",
    features_json: [
      "Deep Cleanse & Purifying Cleansers",
      "Barrier Repair & Hydration Creams",
      "Advanced Serums & Targeted Formulations",
      "Clinical Sunscreens & UV Protection",
      "Rejuvenating Night Creams & Treatments",
    ],
    cta_label: "Inquire Distribution",
    cta_link: "/contact",
  },
  {
    page_name: "cosmetics",
    title: "Personal Care",
    subtitle: "Daily Wellness & Body Essentials",
    description: "Everyday hygienic and nourishing solutions sourced from internationally trusted brands.",
    image_url: "/images/cosmetics/category-personal-care.png",
    features_json: [
      "Nourishing Shampoos & Conditioners",
      "Botanical & Antibacterial Body Washes",
      "Gentle Hydrating Soaps & Bath Bars",
      "Complete Oral Hygiene & Dental Care",
      "Therapeutic Hair Oils & Scalp Tonics",
    ],
    cta_label: "Inquire Distribution",
    cta_link: "/contact",
  },
  {
    page_name: "cosmetics",
    title: "Healthcare Cosmetics",
    subtitle: "Medicated & Therapeutic Topicals",
    description: "Targeted formulations bridging cosmetic aesthetics with clinical dermatological efficacy.",
    image_url: "/images/cosmetics/category-healthcare-cosmetics.png",
    features_json: [
      "Clinical Dermatological Ointments",
      "Medicated Hypoallergenic Soaps",
      "Intensive Barrier & Eczema Creams",
      "Therapeutic Scalp & Skin Treatments",
      "Post-Procedure Recovery Topicals",
    ],
    cta_label: "Inquire Distribution",
    cta_link: "/contact",
  },
];

// ─── 4. LAMÉ PRODUCTS (4) ─────────────────────────────────────────────────────
const LAME_PRODUCTS = [
  {
    name: "2% Salicylic Acid Gel Cleanser",
    category_label: "Cleanser",
    descriptor: "Active BHA Exfoliant",
    description:
      "Deep-cleansing clinical gel formulated with 2% salicylic acid to exfoliate dead skin cells, clear congested pores, and prevent acne formation while maintaining natural barrier hydration.",
    image_url: "/images/products/facewash.jpeg",
    features_json: ["Exfoliate dead skin", "Prevent acne formation"],
    status: "available",
    store_url: null,
  },
  {
    name: "Derma Polish Body Scrub",
    category_label: "Body Care",
    descriptor: "Micro-Exfoliation Polish",
    description:
      "Gentle dermocosmetic body scrub engineered to eliminate environmental pollutants and dead cellular buildup, leaving skin velvety smooth, supple, and revitalized.",
    image_url: "/images/products/scrub.jpeg",
    features_json: ["Gentle Exfoliation & Pollution Removal", "For Smooth, Refreshed skin"],
    status: "available",
    store_url: null,
  },
  {
    name: "Sugar DAYS Eau de Parfum",
    category_label: "Fragrance",
    descriptor: "Artisanal Fine Fragrance",
    description:
      "Artisanal luxury eau de parfum featuring a sophisticated, long-lasting sensorial profile crafted with delicate sweet notes and fine botanical essences for an enduring signature scent.",
    image_url: "/images/products/sugardays.jpeg",
    features_json: ["Long-lasting sensorial profile", "Artisanal fine fragrance blend"],
    status: "available",
    store_url: null,
  },
  {
    name: "DermaBarrier Gel Moisturizer",
    category_label: "Moisturizer",
    descriptor: "Oil-Free Clinical Hydration",
    description:
      "Oil-free barrier repair formulation enriched with essential ceramides and hyaluronic acid for deep cellular hydration, soothing compromised skin without clogging pores.",
    image_url: "/images/products/moisturizer.jpeg",
    features_json: ["Barrier Repair & Deep Hydration", "Non-comedogenic clinical hydration"],
    status: "available",
    store_url: null,
  },
];

// ─── 5. HERO SLIDES (2) ───────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    page_name: "home",
    eyebrow_label: "Care Beyond Medicine",
    heading: "Building a Healthier Tomorrow, Together.",
    subtext:
      "A premium ecosystem of pharmacy chains and cosmetic brands, built on trust, clinical integrity, and continuous innovation.",
    image_url: "/images/home/hero-caregiver-patient.jpg",
    primary_cta_label: "Explore Our Divisions",
    primary_cta_link: "#divisions",
    secondary_cta_label: "Invest With Us",
    secondary_cta_link: "/invest",
  },
  {
    page_name: "home",
    eyebrow_label: "OPENING SOON",
    heading: "Introducing Lamstone Healthcare Hypermarket.",
    subtext: "One destination for pharmacy, wellness, and beauty — all under one roof.",
    image_url: "/images/banners/pharmacy-interior-shelves.jpg",
    primary_cta_label: "Explore the Hypermarket",
    primary_cta_link: "/pharmacy-chain",
    secondary_cta_label: "Find a Location",
    secondary_cta_link: "/pharmacy-chain#locations",
  },
];

async function seedContentGrids() {
  console.log("=== Seeding Content Grids to Supabase ===");

  // 1. Seed brand_partners (Pharmacy)
  console.log("\n1. Seeding Pharmaceutical Partners...");
  let order = 1;
  for (const partner of PHARMA_PARTNERS) {
    const { data: existing } = await supabase
      .from("brand_partners")
      .select("id")
      .eq("name", partner.name)
      .eq("partner_type", "pharmacy")
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("brand_partners").insert({
        ...partner,
        partner_type: "pharmacy",
        display_order: order++,
      });
      if (error) console.error(`- Error: ${partner.name}:`, error.message);
      else console.log(`✔ Inserted Pharma Partner: ${partner.name}`);
    } else {
      console.log(`- Skipping ${partner.name} (exists)`);
      order++;
    }
  }

  // 2. Seed brand_partners (Cosmetics)
  console.log("\n2. Seeding Cosmetics Multi-Brand Portfolio...");
  order = 1;
  for (const brand of COSMETICS_BRANDS) {
    const { data: existing } = await supabase
      .from("brand_partners")
      .select("id")
      .eq("name", brand.name)
      .eq("partner_type", "cosmetics")
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("brand_partners").insert({
        ...brand,
        partner_type: "cosmetics",
        display_order: order++,
      });
      if (error) console.error(`- Error: ${brand.name}:`, error.message);
      else console.log(`✔ Inserted Cosmetics Brand: ${brand.name}`);
    } else {
      console.log(`- Skipping ${brand.name} (exists)`);
      order++;
    }
  }

  // 3. Seed product_categories
  console.log("\n3. Seeding Product Categories...");
  order = 1;
  for (const cat of PRODUCT_CATEGORIES) {
    const { data: existing } = await supabase
      .from("product_categories")
      .select("id")
      .eq("page_name", cat.page_name)
      .eq("title", cat.title)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("product_categories").insert({
        ...cat,
        display_order: order++,
      });
      if (error) console.error(`- Error: ${cat.title}:`, error.message);
      else console.log(`✔ Inserted Category (${cat.page_name}): ${cat.title}`);
    } else {
      console.log(`- Skipping ${cat.title} (exists)`);
      order++;
    }
  }

  // 4. Seed lame_products
  console.log("\n4. Seeding Lamé Signature Products...");
  order = 1;
  for (const prod of LAME_PRODUCTS) {
    const { data: existing } = await supabase
      .from("lame_products")
      .select("id")
      .eq("name", prod.name)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("lame_products").insert({
        ...prod,
        display_order: order++,
      });
      if (error) console.error(`- Error: ${prod.name}:`, error.message);
      else console.log(`✔ Inserted Lamé Product: ${prod.name}`);
    } else {
      console.log(`- Skipping ${prod.name} (exists)`);
      order++;
    }
  }

  // 5. Seed hero_slides
  console.log("\n5. Seeding Hero Slides...");
  order = 1;
  for (const slide of HERO_SLIDES) {
    const { data: existing } = await supabase
      .from("hero_slides")
      .select("id")
      .eq("page_name", slide.page_name)
      .eq("eyebrow_label", slide.eyebrow_label)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("hero_slides").insert({
        ...slide,
        display_order: order++,
      });
      if (error) console.error(`- Error: ${slide.eyebrow_label}:`, error.message);
      else console.log(`✔ Inserted Hero Slide: ${slide.eyebrow_label}`);
    } else {
      console.log(`- Skipping ${slide.eyebrow_label} (exists)`);
      order++;
    }
  }

  console.log("\n=== Content Grids Seeding Complete! ===");
}

seedContentGrids().catch(console.error);
