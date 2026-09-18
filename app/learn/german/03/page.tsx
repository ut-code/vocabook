"use client";

import { ListeningSection } from "@/components/listening/ListeningSection";
import {
  germanListeningClozeItems,
  germanListeningConfig,
  germanListeningWords,
} from "@/lib/listening/de";

export const title = "発音識別";

export default function GermanListeningPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">発音識別</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        発音を聞いて、紛らわしい同音異綴語やウムラウトの有無などを聞き分けて入力しましょう。単語単位の聞き分けと、長文の穴埋めの2つのモードから選べます。
      </p>
      <div className="mt-8">
        <ListeningSection
          words={germanListeningWords}
          clozeItems={germanListeningClozeItems}
          language={germanListeningConfig}
        />
      </div>
    </div>
  );
}
