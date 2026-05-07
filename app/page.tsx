"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Brain, CalendarPlus, Loader2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import type { DayPlan } from "@/lib/types";

const starterText = "Tenho muitas mensagens para responder, preciso montar uma proposta, organizar documentos, revisar pendências e fazer pausas porque costumo hiperfocar e ficar exausta.";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function Home() {
  const [text, setText] = useState(starterText);
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [events, setEvents] = useState<{ title: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function generatePlan() {
    setLoading(true);
    setMessage("");
    setEvents([]);
    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPlan(data);
    } catch {
      setMessage("Não consegui gerar o plano agora. Verifique as chaves no .env.local.");
    } finally {
      setLoading(false);
    }
  }

  async function createCalendarLinks() {
    if (!plan) return;
    const res = await fetch("/api/calendar/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: plan.tasks }),
    });
    const data = await res.json();
    setEvents(data.events || []);
  }

  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setMessage("Seu navegador ainda não suporta push web.");
      return;
    }
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setMessage("Configure NEXT_PUBLIC_VAPID_PUBLIC_KEY no .env.local.");
      return;
    }
    const registration = await navigator.serviceWorker.register("/sw.js");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });
    setMessage("Push ativado. Agora o app pode enviar lembretes gentis.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-soft">
            <Brain size={16} /> Assistente real de função executiva
          </div>

          <div>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">Menos caos. Mais próxima ação.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Cole pensamentos, tarefas soltas ou um texto grande. A IA quebra em microetapas, organiza prioridade, sugere pausas contra hiperfoco e prepara blocos para agenda.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-4 shadow-soft"><Sparkles /> <b className="mt-3 block">Microetapas</b><span className="text-sm text-slate-500">Ações simples.</span></div>
            <div className="rounded-3xl bg-white p-4 shadow-soft"><Zap /> <b className="mt-3 block">Prioridade</b><span className="text-sm text-slate-500">Ordem do dia.</span></div>
            <div className="rounded-3xl bg-white p-4 shadow-soft"><Bell /> <b className="mt-3 block">Pausas</b><span className="text-sm text-slate-500">Alertas gentis.</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[2rem] bg-white p-5 shadow-soft md:p-7">
          <label className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Despejo mental</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-3 min-h-48 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 p-5 leading-7 outline-none ring-slate-950/10 transition focus:ring-4"
            placeholder="Escreva tudo que está na sua cabeça..."
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={generatePlan} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-bold text-white shadow-soft transition hover:scale-[1.02] disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />} Organizar meu dia
            </button>
            <button onClick={enablePush} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-200">
              <Bell size={18} /> Ativar push
            </button>
          </div>
          {message && <p className="mt-4 rounded-2xl bg-slate-100 p-3 text-sm text-slate-600">{message}</p>}
        </motion.div>
      </section>

      {plan && (
        <section className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
          <div className="mb-5 rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-sm text-slate-300"><ShieldCheck size={16} /> Risco de sobrecarga: {plan.overloadRisk}</p>
                <h2 className="mt-2 text-3xl font-black">{plan.summary}</h2>
                <p className="mt-2 text-slate-300">{plan.hyperfocusWarning}</p>
              </div>
              <button onClick={createCalendarLinks} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-slate-950 transition hover:scale-[1.02]">
                <CalendarPlus size={18} /> Preparar agenda
              </button>
            </div>
          </div>

          {events.length > 0 && (
            <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-soft">
              <h3 className="font-bold">Links para adicionar no Google Agenda</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {events.map((event, i) => (
                  <a key={i} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200" href={event.url} target="_blank">{event.title}</a>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {plan.tasks.map((task, index) => <TaskCard key={`${task.title}-${index}`} task={task} index={index} />)}
          </div>
        </section>
      )}
    </main>
  );
}
