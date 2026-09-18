"use client";

import { ListeningPractice } from "@/components/listening/ListeningPractice";
import { spanishListeningConfig, spanishListeningWords } from "@/lib/listening/es";

export const title = "発音識別";

export default function SpanishListeningPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">発音識別</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        発音を聞いて、b/v や ll/y、アクセント位置など紛らわしい綴りを聞き分けて入力しましょう。
      </p>
      <div className="mt-8">
        <ListeningPractice words={spanishListeningWords} language={spanishListeningConfig} />
      </div>
    </div>
  );
}
