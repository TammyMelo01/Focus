import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const subscription = await req.json();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("push_subscriptions").insert({ subscription });
  }

  return NextResponse.json({ ok: true, saved: Boolean(supabase) });
}
