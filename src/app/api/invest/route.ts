import { NextRequest, NextResponse } from "next/server";
import { investmentSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/sanitize";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendInvestmentAlert } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { isRateLimited } = checkRateLimit(req, "invest");
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

  const parsed = investmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = sanitizeObject(parsed.data);
  const supabase = createServerSupabaseClient();

  const { error: dbError } = await supabase
    .from("investment_requests")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      request_type: data.request_type,
      opportunity_name: data.opportunity_name || null,
      message: data.message,
      status: "new",
    });

  if (dbError) {
    console.error("[invest] DB error:", dbError);
    return NextResponse.json(
      { error: "Something went wrong submitting your form — please try again" },
      { status: 500 }
    );
  }

  await sendInvestmentAlert(data).catch(console.error);

  return NextResponse.json({ success: true }, { status: 201 });
}
