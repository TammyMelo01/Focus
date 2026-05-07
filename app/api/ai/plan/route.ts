import { NextResponse } from "next/server";
import { createPlanFromText } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Envie um texto válido." }, { status: 400 });
    }
    const plan = await createPlanFromText(text);
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível gerar o plano." }, { status: 500 });
  }
}
