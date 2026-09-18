"use client";

import { ListeningPractice } from "@/components/listening/ListeningPractice";
import { chineseListeningConfig, chineseListeningWords } from "@/lib/listening/zh";

export const title = "発音識別";

export default function ChineseListeningPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">発音識別</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        漢字の発音を聞いて、声調やそり舌音・有気音などを聞き分けて正しいピンインを入力しましょう。
      </p>
      <div className="mt-8">
        <ListeningPractice words={chineseListeningWords} language={chineseListeningConfig} />
      </div>
    </div>
  );
}
