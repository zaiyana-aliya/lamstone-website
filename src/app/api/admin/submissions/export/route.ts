import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

function toCSV(data: Record<string, unknown>[]): string {
  if (!data || data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        const str = val === null || val === undefined ? "" : String(val);
        // Escape double quotes and wrap in quotes if contains comma/newline
        const escaped = str.replace(/"/g, '""');
        return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

// GET /api/admin/submissions/export?type=contact
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") ?? "contact") as SubmissionType;
  const table = TABLES[type];
  if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });

  const csv = toCSV((data ?? []) as Record<string, unknown>[]);
  const filename = `${type}-submissions-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
