import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MicroFocus AI",
  description: "Assistente com IA para quebrar tarefas, reduzir sobrecarga e organizar agenda.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
