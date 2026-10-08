import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendNewsletterWelcome } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { isRateLimited } = checkRateLimit(req, "newsletter");
  if (isRateLimited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid email address",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const supabase = createServerSupabaseClient();

  // Upsert: if already subscribed do nothing, if unsubscribed re-subscribe
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, unsubscribed_at")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (!existing.unsubscribed_at) {
      // Already subscribed — return success silently (don't leak info)
      return NextResponse.json({ success: true }, { status: 200 });
    }
    // Re-subscribe
    await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: null, subscribed_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      console.error("[newsletter] DB error:", error);
      return NextResponse.json(
        { error: "Something went wrong submitting your form — please try again" },
        { status: 500 }
      );
    }
  }

  await sendNewsletterWelcome(email).catch(console.error);

  return NextResponse.json({ success: true }, { status: 201 });
}
