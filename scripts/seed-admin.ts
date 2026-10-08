import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Default admin credentials (can be overridden via environment variables)
const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL || "mail@lamstonehealthcare.com";
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || "LamstoneAdmin2026!";

async function seedAdmin() {
  console.log(`Seeding initial admin user (${ADMIN_EMAIL})...`);

  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", ADMIN_EMAIL.toLowerCase().trim())
    .maybeSingle();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  if (existing) {
    console.log("Admin user already exists. Updating password hash...");
    const { error } = await supabase
      .from("admin_users")
      .update({ password_hash: passwordHash, role: "super_admin" })
      .eq("id", existing.id);

    if (error) {
      console.error("Error updating admin password:", error.message);
    } else {
      console.log("✔ Admin password updated successfully!");
    }
  } else {
    const { error } = await supabase.from("admin_users").insert({
      email: ADMIN_EMAIL.toLowerCase().trim(),
      password_hash: passwordHash,
      role: "super_admin",
    });

    if (error) {
      console.error("Error creating admin user:", error.message);
    } else {
      console.log("✔ Super Admin created successfully!");
      console.log(`  Email:    ${ADMIN_EMAIL}`);
      console.log(`  Password: ${ADMIN_PASSWORD}`);
      console.log("  Please log in at /admin/login and change your password in production.");
    }
  }
}

seedAdmin().catch(console.error);
