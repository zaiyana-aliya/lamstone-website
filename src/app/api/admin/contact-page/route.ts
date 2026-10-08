import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("contact_page_content")
    .select("*")
    .order("section_key", { ascending: true });

  if (error) {
    console.error("[admin/contact-page GET] DB error:", error);
    return NextResponse.json({ error: error.message, sections: [] }, { status: 500 });
  }

  return NextResponse.json({ sections: data ?? [] });
}
