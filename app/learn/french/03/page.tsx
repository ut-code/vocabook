"use client";

import { ListeningPractice } from "@/components/listening/ListeningPractice";
import { frenchListeningConfig, frenchListeningWords } from "@/lib/listening/fr";

export const title = "発音識別";

export default function FrenchListeningPage() {
  return (
    <div>
      <h1>発音識別</h1>
      <p>発音を聞いて、紛らわしい同音異綴語などの正しい綴りを入力しましょう。</p>
      <div className="mt-8">
        <ListeningPractice words={frenchListeningWords} language={frenchListeningConfig} />
      </div>
    </div>
  );
}
