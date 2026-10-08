import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { extractStoragePath } from "@/lib/storage";

// GET /api/admin/submissions/resume?id=[application_id]
// GET /api/admin/submissions/resume?path=[filename]
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const rawPath = searchParams.get("path");
  const asDownload = searchParams.get("download") === "true";
  const asJson = searchParams.get("action") === "json";

  const supabase = createServerSupabaseClient();
  let targetPath = "";

  if (id) {
    const { data: appRecord, error: dbError } = await supabase
      .from("careers_applications")
      .select("id, resume_url, full_name")
      .eq("id", id)
      .maybeSingle();

    if (dbError || !appRecord || !appRecord.resume_url) {
      return NextResponse.json({ error: "Application or resume not found" }, { status: 404 });
    }

    targetPath = extractStoragePath(appRecord.resume_url, "resumes");
  } else if (rawPath) {
    targetPath = extractStoragePath(rawPath, "resumes");
  } else {
    return NextResponse.json({ error: "Missing 'id' or 'path' parameter" }, { status: 400 });
  }

  if (!targetPath) {
    return NextResponse.json({ error: "Invalid resume storage path" }, { status: 400 });
  }

  // Generate signed URL with 10-minute expiry (600 seconds)
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(targetPath, 600, asDownload ? { download: true } : undefined);

  if (error || !data?.signedUrl) {
    console.error("[admin/submissions/resume] Error creating signed URL:", error);
    return NextResponse.json({ error: "Failed to generate signed download URL" }, { status: 404 });
  }

  if (asJson) {
    return NextResponse.json({ signedUrl: data.signedUrl });
  }

  return NextResponse.redirect(data.signedUrl);
}
