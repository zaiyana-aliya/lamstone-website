import { NextRequest, NextResponse } from "next/server";
import { careersSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/sanitize";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendCareersAlert } from "@/lib/email";

const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req: NextRequest) {
  const { isRateLimited } = checkRateLimit(req, "careers");
  if (isRateLimited) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in an hour." },
      { status: 429 }
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  const supabase = createServerSupabaseClient();

  let fields: Record<string, string> = {};
  let resumeUrl: string | undefined;

  if (contentType.includes("multipart/form-data")) {
    // Handle file upload
    const formData = await req.formData();
    fields = {
      full_name: String(formData.get("full_name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      position: String(formData.get("position") ?? ""),
      cover_letter: String(formData.get("cover_letter") ?? ""),
    };

    const file = formData.get("resume") as File | null;
    if (file && file.size > 0) {
      if (file.size > MAX_RESUME_SIZE) {
        return NextResponse.json(
          {
            error: "Resume must be under 5 MB",
            fields: { resume: ["Resume must be under 5 MB"] },
          },
          { status: 413 }
        );
      }
      if (!ALLOWED_MIME.includes(file.type)) {
        return NextResponse.json(
          {
            error: "Resume must be a PDF or Word document",
            fields: { resume: ["Resume must be a PDF or Word document"] },
          },
          { status: 415 }
        );
      }

      const ext = file.name.split(".").pop() ?? "pdf";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filename, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        console.error("[careers] Upload error:", uploadError);
        // Don't fail the application — resume upload is optional
      } else {
        resumeUrl = uploadData.path;
      }
    }
  } else {
    // JSON payload (no file)
    try {
      fields = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
  }

  const parsed = careersSchema.safeParse({ ...fields, resume_url: resumeUrl });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = sanitizeObject({
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    position: parsed.data.position,
    cover_letter: parsed.data.cover_letter,
  });

  const { error: dbError } = await supabase
    .from("careers_applications")
    .insert({
      ...data,
      resume_url: resumeUrl || null,
      status: "new",
    });

  if (dbError) {
    console.error("[careers] DB error:", dbError);
    return NextResponse.json(
      { error: "Something went wrong submitting your form — please try again" },
      { status: 500 }
    );
  }

  await sendCareersAlert({ ...data, resume_url: resumeUrl }).catch(console.error);

  return NextResponse.json({ success: true }, { status: 201 });
}
