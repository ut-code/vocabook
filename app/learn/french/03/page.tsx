"use client";

import { ListeningSection } from "@/components/listening/ListeningSection";
import {
  frenchListeningClozeItems,
  frenchListeningConfig,
  frenchListeningWords,
} from "@/lib/listening/fr";

export const title = "発音識別";

export default function FrenchListeningPage() {
  return (
    <div>
      <h1>発音識別</h1>
      <p>
        発音を聞いて、紛らわしい同音異綴語などの正しい綴りを入力しましょう。単語単位の聞き分けと、長文の穴埋めの2つのモードから選べます。
      </p>
      <div className="mt-8">
        <ListeningSection
          words={frenchListeningWords}
          clozeItems={frenchListeningClozeItems}
          language={frenchListeningConfig}
        />
      </div>
    </div>
  );
}
