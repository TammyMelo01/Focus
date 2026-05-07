import { Clock, Sparkles } from "lucide-react";
import type { MicroTask } from "@/lib/types";

export function TaskCard({ task, index }: { task: MicroTask; index: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Microtarefa {index + 1}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">{task.title}</h3>
        </div>
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{task.priority}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><Clock size={14} /> {task.durationMinutes} min</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1"><Sparkles size={14} /> energia {task.energy}</span>
      </div>
      <ol className="mt-4 space-y-2">
        {task.steps.map((step, i) => (
          <li key={i} className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xs font-bold shadow-sm">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
