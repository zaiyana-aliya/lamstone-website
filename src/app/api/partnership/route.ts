import { NextRequest, NextResponse } from "next/server";
import { partnershipSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/sanitize";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendPartnershipAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { isRateLimited } = checkRateLimit(req, "partnership");
  if (isRateLimited) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in an hour." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = partnershipSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = sanitizeObject(parsed.data);
  const supabase = createServerSupabaseClient();

  const { error: dbError } = await supabase
    .from("partnership_inquiries")
    .insert({ ...data, status: "new" });

  if (dbError) {
    console.error("[partnership] DB error:", dbError);
    return NextResponse.json(
      { error: "Something went wrong submitting your form — please try again" },
      { status: 500 }
    );
  }

  await sendPartnershipAlert(data).catch(console.error);

  return NextResponse.json({ success: true }, { status: 201 });
}
