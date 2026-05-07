import { NextResponse } from "next/server";
import { addMinutes, formatISO, setHours, setMinutes } from "date-fns";
import type { MicroTask } from "@/lib/types";

export async function POST(req: Request) {
  const { tasks } = await req.json() as { tasks: MicroTask[] };
  if (!Array.isArray(tasks)) {
    return NextResponse.json({ error: "Tarefas inválidas." }, { status: 400 });
  }

  // MVP: gera links Google Calendar sem exigir OAuth.
  // Próximo passo: trocar por Google Calendar API com OAuth e refresh token.
  let cursor = setMinutes(setHours(new Date(), 9), 0);
  const events = tasks.map((task) => {
    const start = cursor;
    const end = addMinutes(start, task.durationMinutes || 25);
    cursor = addMinutes(end, 10);
    const details = encodeURIComponent(`Microetapas:\n- ${task.steps.join("\n- ")}\n\nCriado pelo MicroFocus AI.`);
    const title = encodeURIComponent(task.title);
    const dates = `${formatISO(start).replace(/[-:]/g, "").split(".")[0]}/${formatISO(end).replace(/[-:]/g, "").split(".")[0]}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
    return { title: task.title, start: start.toISOString(), end: end.toISOString(), url };
  });

  return NextResponse.json({ events });
}
