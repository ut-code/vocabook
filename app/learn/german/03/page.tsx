"use client";

import { ListeningPractice } from "@/components/listening/ListeningPractice";
import { germanListeningConfig, germanListeningWords } from "@/lib/listening/de";

export const title = "発音識別";

export default function GermanListeningPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">発音識別</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        発音を聞いて、紛らわしい同音異綴語やウムラウトの有無などを聞き分けて入力しましょう。
      </p>
      <div className="mt-8">
        <ListeningPractice words={germanListeningWords} language={germanListeningConfig} />
      </div>
    </div>
  );
}
