import { NextRequest, NextResponse } from "next/server";
import { lameNotifySchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { isRateLimited } = checkRateLimit(req, "lame-notify");
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

  const parsed = lameNotifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { email, product_name } = parsed.data;
  const supabase = createServerSupabaseClient();

  // Upsert — ignore duplicate (email + product_name combo already registered)
  const { error } = await supabase
    .from("lame_launch_notify")
    .upsert({ email: email.toLowerCase().trim(), product_name }, { onConflict: "email,product_name" });

  if (error) {
    console.error("[lame-notify] DB error:", error);
    return NextResponse.json(
      { error: "Something went wrong submitting your form — please try again" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
