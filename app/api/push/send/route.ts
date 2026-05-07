import { NextResponse } from "next/server";
import webpush from "web-push";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { title = "Pausa gentil", body = "Respire, levante e volte pela próxima microetapa." } = await req.json();

  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY || !process.env.VAPID_EMAIL) {
    return NextResponse.json({ error: "Configure as chaves VAPID." }, { status: 400 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Configure Supabase para salvar inscritos." }, { status: 400 });

  const { data } = await supabase.from("push_subscriptions").select("subscription");
  await Promise.allSettled((data || []).map((row) => webpush.sendNotification(row.subscription, JSON.stringify({ title, body }))));
  return NextResponse.json({ sent: data?.length || 0 });
}
