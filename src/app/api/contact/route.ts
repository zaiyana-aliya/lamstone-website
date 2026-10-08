import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/sanitize";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendContactConfirmation, sendContactTeamAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  // 1. Rate limit
  const { isRateLimited } = checkRateLimit(req, "contact");
  if (isRateLimited) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in an hour." },
      { status: 429 }
    );
  }

  // 2. Parse + validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // 3. Sanitize
  const data = sanitizeObject(parsed.data);

  // 4. Insert to DB
  const supabase = createServerSupabaseClient();
  const { error: dbError } = await supabase
    .from("contact_submissions")
    .insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      status: "new",
    });

  if (dbError) {
    console.error("[contact] DB error:", dbError);
    return NextResponse.json(
      { error: "Something went wrong submitting your form — please try again" },
      { status: 500 }
    );
  }

  // 5. Send emails (non-blocking — never fail the user for email errors)
  await Promise.allSettled([
    sendContactConfirmation(data.email, data.full_name),
    sendContactTeamAlert(data),
  ]);

  return NextResponse.json({ success: true }, { status: 201 });
}
