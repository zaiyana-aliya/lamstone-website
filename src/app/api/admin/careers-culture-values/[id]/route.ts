import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = createServerSupabaseClient();

  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  const allowed = ["icon", "title", "description", "display_order", "is_active"];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      updatePayload[key] = body[key];
    }
  }

  const { data, error } = await supabase
    .from("careers_culture_values")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/careers-culture-values/[id] PUT] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ value: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("careers_culture_values")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin/careers-culture-values/[id] DELETE] DB error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
