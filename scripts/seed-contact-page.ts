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

const DEFAULT_CONTACT_SECTION = {
  section_key: "hero",
  eyebrow_label: "Let's Connect",
  heading: "Contact Lamstone",
  description:
    "Have a query, partnership proposal, or investment inquiry? Our team will respond within 24 hours.",
  image_url:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85",
  primary_cta_label: "Send a Message",
  primary_cta_url: "#contact-form",
  extra_data: {
    badges: [
      {
        icon: "Clock",
        title: "24h Response",
        subtitle: "Prompt Review",
      },
      {
        icon: "ShieldCheck",
        title: "Direct Line",
        subtitle: "Verified Team",
      },
      {
        icon: "Building2",
        title: "Kerala, India",
        subtitle: "HQ & Operations",
      },
    ],
    offices_eyebrow: "Our Offices",
    offices_heading: "Customer Happiness Center",
  },
  is_active: true,
};

const DEFAULT_CONTACT_OFFICES = [
  {
    label: "Office",
    company_name: "Lamstone HealthCare Pvt Ltd",
    address: "Z Avenue, 10/20/E-10/20/G, NH 66\nMangalapuram, Kerala, India - 695317",
    phone: "+91 9746397686",
    email: "mail@lamstonehealthcare.com",
    display_order: 1,
    is_active: true,
  },
  {
    label: "Corporate Head Office",
    company_name: "Alverstone Healthcare Pvt Ltd",
    address: "Bio 360 Kerala Life Sciences Industries Park\nTrivandrum, Kerala, India - 695317",
    phone: "+91 9746397686",
    email: "mail@lamstonehealthcare.com",
    display_order: 2,
    is_active: true,
  },
  {
    label: "Customer Happiness Center",
    company_name: "Lamstone HealthCare Pvt Ltd",
    address: "5th Floor, SPTI Building, Technopark Phase-1\nKazhakuttom, 695581",
    phone: "+91 9746397686",
    email: "mail@lamstonehealthcare.com",
    display_order: 3,
    is_active: true,
  },
];

async function seedContactPage() {
  console.log("Seeding contact_page_content table...");

  const { error: checkErr } = await supabase
    .from("contact_page_content")
    .select("id")
    .limit(1);

  if (checkErr) {
    console.error(
      "✕ Error accessing contact_page_content table. Please make sure migration 015_contact_page.sql has run in Supabase SQL editor:\n",
      checkErr.message
    );
    process.exit(1);
  }

  const { data: existing } = await supabase
    .from("contact_page_content")
    .select("id")
    .eq("section_key", DEFAULT_CONTACT_SECTION.section_key)
    .maybeSingle();

  if (existing) {
    console.log(`  - ${DEFAULT_CONTACT_SECTION.section_key} already exists in contact_page_content (skipping overwrite)`);
  } else {
    const { error: insertErr } = await supabase
      .from("contact_page_content")
      .insert(DEFAULT_CONTACT_SECTION as any);

    if (insertErr) {
      console.error(`  ✕ Error inserting ${DEFAULT_CONTACT_SECTION.section_key}:`, insertErr.message);
    } else {
      console.log(`  ✓ Seeded section ${DEFAULT_CONTACT_SECTION.section_key}`);
    }
  }

  console.log("Seeding contact_offices table...");

  const { error: checkOfficesErr } = await supabase
    .from("contact_offices")
    .select("id")
    .limit(1);

  if (checkOfficesErr) {
    console.error(
      "✕ Error accessing contact_offices table. Please make sure migration 015_contact_page.sql has run in Supabase SQL editor:\n",
      checkOfficesErr.message
    );
    process.exit(1);
  }

  for (const office of DEFAULT_CONTACT_OFFICES) {
    const { data: existingOffice } = await supabase
      .from("contact_offices")
      .select("id")
      .eq("label", office.label)
      .maybeSingle();

    if (existingOffice) {
      console.log(`  - Office "${office.label}" already exists (skipping overwrite)`);
    } else {
      const { error: insertOfficeErr } = await supabase
        .from("contact_offices")
        .insert(office as any);

      if (insertOfficeErr) {
        console.error(`  ✕ Error inserting "${office.label}":`, insertOfficeErr.message);
      } else {
        console.log(`  ✓ Seeded office "${office.label}"`);
      }
    }
  }

  console.log("Finished seeding Contact page and offices.");
}

seedContactPage().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
