export type MicroTask = {
  title: string;
  durationMinutes: number;
  energy: "baixa" | "media" | "alta";
  priority: "alta" | "media" | "baixa";
  steps: string[];
  suggestedStart?: string;
};

export type DayPlan = {
  summary: string;
  overloadRisk: "baixo" | "medio" | "alto";
  hyperfocusWarning: string;
  tasks: MicroTask[];
};
