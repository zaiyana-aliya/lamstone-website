import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Public endpoint — only returns is_active = true postings
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("job_postings")
      .select("id, title, department, location, employment_type, description, is_active, display_order, created_at")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[api/jobs] DB error:", error);
      return NextResponse.json({ jobs: [] });
    }

    return NextResponse.json({ jobs: data ?? [] });
  } catch (err) {
    console.error("[api/jobs] unexpected error:", err);
    return NextResponse.json({ jobs: [] });
  }
}
