import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { extractStoragePath } from "@/lib/storage";

const TABLES = {
  contact: "contact_submissions",
  newsletter: "newsletter_subscribers",
  investment: "investment_requests",
  lame: "lame_launch_notify",
  distribution: "distribution_inquiries",
  careers: "careers_applications",
  partnership: "partnership_inquiries",
} as const;

type SubmissionType = keyof typeof TABLES;

// GET /api/admin/submissions?type=contact&status=new&page=1
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") ?? "contact") as SubmissionType;
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 25;
  const offset = (page - 1) * limit;

  const table = TABLES[type];
  if (!table) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  let query = supabase.from(table).select("*", { count: "exact" });

  if (status && type !== "newsletter" && type !== "lame") {
    query = query.eq("status", status) as typeof query;
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[admin/submissions] DB error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (type === "careers" && data && data.length > 0) {
    await Promise.all(
      data.map(async (item: any) => {
        if (item.resume_url) {
          const path = extractStoragePath(item.resume_url, "resumes");
          if (path) {
            const { data: signed } = await supabase.storage
              .from("resumes")
              .createSignedUrl(path, 600);
            if (signed?.signedUrl) {
              item.resume_url = signed.signedUrl;
            }
          }
        }
      })
    );
  }

  return NextResponse.json({ data, total: count, page, limit });
}

// PATCH /api/admin/submissions — update status
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, id, status } = await req.json();
  const table = TABLES[type as SubmissionType];
  if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ success: true });
}
