"use client";

import { ListeningSection } from "@/components/listening/ListeningSection";
import {
  chineseListeningClozeItems,
  chineseListeningConfig,
  chineseListeningWords,
} from "@/lib/listening/zh";

export const title = "発音識別";

export default function ChineseListeningPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">発音識別</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        漢字の発音を聞いて、声調やそり舌音・有気音などを聞き分けて正しいピンインを入力しましょう。単語単位の聞き分けと、長文の穴埋めの2つのモードから選べます。
      </p>
      <div className="mt-8">
        <ListeningSection
          words={chineseListeningWords}
          clozeItems={chineseListeningClozeItems}
          language={chineseListeningConfig}
        />
      </div>
    </div>
  );
}
