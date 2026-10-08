import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("invest_page_content")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.warn("[api/invest-page] DB notice:", error.message);
      return NextResponse.json({ sections: [] });
    }

    return NextResponse.json({ sections: data ?? [] });
  } catch (err: any) {
    console.warn("[api/invest-page] Exception:", err?.message);
    return NextResponse.json({ sections: [] });
  }
}
