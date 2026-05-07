import { DayPlan } from "./types";

const fallbackPlan: DayPlan = {
  summary: "Plano inicial criado localmente. Configure a GROQ_API_KEY para usar IA real.",
  overloadRisk: "medio",
  hyperfocusWarning: "Programe pausas curtas a cada 45-60 minutos para evitar exaustão.",
  tasks: [
    {
      title: "Organizar lista de tarefas",
      durationMinutes: 20,
      energy: "baixa",
      priority: "alta",
      steps: ["Ler tudo sem julgar", "Separar por tema", "Escolher a primeira ação simples"],
    },
  ],
};

export async function createPlanFromText(text: string): Promise<DayPlan> {
  if (!process.env.GROQ_API_KEY) return fallbackPlan;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente de função executiva. Transforme texto caótico em um plano do dia com microtarefas. Responda somente JSON válido no formato: { summary, overloadRisk: 'baixo'|'medio'|'alto', hyperfocusWarning, tasks: [{ title, durationMinutes, energy: 'baixa'|'media'|'alta', priority: 'alta'|'media'|'baixa', steps: string[] }] }. Seja gentil, prático e evite sobrecarregar.",
        },
        { role: "user", content: text },
      ],
    }),
  });

  if (!response.ok) throw new Error("Erro ao chamar Groq");
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  return JSON.parse(content) as DayPlan;
}
