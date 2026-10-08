import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cosmetics_page_content")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[admin/cosmetics-page] DB error:", error);
    return NextResponse.json({ error: error.message, sections: [] }, { status: 500 });
  }

  return NextResponse.json({ sections: data ?? [] });
}
