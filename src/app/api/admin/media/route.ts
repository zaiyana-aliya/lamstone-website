import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// 5 MB max file size limit as per requirements
const MAX_SIZE = 5 * 1024 * 1024;
// Supported image types: .jpg, .jpeg, .png, .webp
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ALLOWED_FOLDERS = [
  "home-cards",
  "home-slides",
  "pharmacy",
  "pharmacy-partners",
  "cosmetics",
  "cosmetics-brands",
  "cosmetics-categories",
  "lame",
  "lame-products",
  "about",
  "careers",
  "blogs",
  "invest",
  "contact",
];

// Helper to sanitize filenames
function sanitizeFilename(originalName: string): string {
  const parts = originalName.split(".");
  const ext = (parts.pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const baseName = parts
    .join(".")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
  return `${Date.now()}-${baseName || "image"}.${ext}`;
}

// GET /api/admin/media?folder=xxx — list media assets in Supabase Storage
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder")?.trim() || "";

  // Validate folder if specified
  if (folder && !ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Invalid folder specified" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  try {
    // List directly from Supabase Storage bucket
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("media")
      .list(folder, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (storageError) {
      console.error("[media GET] Storage list error:", storageError);
      return NextResponse.json({ error: "Failed to list storage files" }, { status: 500 });
    }

    // Filter out potential placeholder files or empty folder stubs (.emptyFolderPlaceholder)
    const validFiles = (storageFiles || []).filter(
      (file) => file.name && !file.name.startsWith(".")
    );

    // Build media asset objects with public CDN URLs
    const assets = validFiles.map((file) => {
      const storagePath = folder ? `${folder}/${file.name}` : file.name;
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(storagePath);

      return {
        id: file.id || storagePath,
        name: file.name,
        filename: file.name,
        folder: folder || "root",
        path: storagePath,
        url: urlData.publicUrl,
        size_bytes: file.metadata?.size || 0,
        mime_type: file.metadata?.mimetype || "image/jpeg",
        created_at: file.created_at || new Date().toISOString(),
        updated_at: file.updated_at || file.created_at || new Date().toISOString(),
      };
    });

    return NextResponse.json({ assets, folder });
  } catch (err: any) {
    console.error("[media GET] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// POST /api/admin/media — upload file to Supabase Storage in designated section folder
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let folder = (formData.get("folder") as string | null)?.trim() || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 5 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB provided).` },
        { status: 413 }
      );
    }

    // Validate file type (.jpg, .jpeg, .png, .webp)
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and WebP images are allowed." },
        { status: 415 }
      );
    }

    // Default to home-cards if invalid folder specified
    if (folder && !ALLOWED_FOLDERS.includes(folder)) {
      folder = "home-cards";
    }

    const cleanFilename = sanitizeFilename(file.name);
    const storagePath = folder ? `${folder}/${cleanFilename}` : cleanFilename;

    const supabase = createServerSupabaseClient();

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[media POST] Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message || "Upload failed" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(storagePath);
    const publicUrl = urlData.publicUrl;

    // Synchronize with media_assets DB table
    try {
      await supabase.from("media_assets").insert({
        url: publicUrl,
        filename: storagePath,
        mime_type: file.type,
        size_bytes: file.size,
      });
    } catch (dbErr) {
      console.warn("[media POST] media_assets table insert warning (non-fatal):", dbErr);
    }

    return NextResponse.json(
      {
        url: publicUrl,
        filename: cleanFilename,
        path: storagePath,
        folder,
        size_bytes: file.size,
        mime_type: file.type,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[media POST] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}

// DELETE /api/admin/media?path=xxx or ?filename=xxx
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || searchParams.get("filename");
  if (!path) return NextResponse.json({ error: "File path required" }, { status: 400 });

  const supabase = createServerSupabaseClient();

  try {
    const { error: storageError } = await supabase.storage.from("media").remove([path]);
    if (storageError) {
      console.error("[media DELETE] Storage delete error:", storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    // Also remove from media_assets table if exists
    try {
      await supabase.from("media_assets").delete().or(`filename.eq.${path},url.like.%${path}`);
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, deletedPath: path });
  } catch (err: any) {
    console.error("[media DELETE] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Delete failed" }, { status: 500 });
  }
}
