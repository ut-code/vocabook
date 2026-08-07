"use client";

import { useState } from "react";
import Link from "next/link";

import type { CardData } from "@/lib/card-data";

type Card = { id: string; data: CardData };

// Fisher-Yatesシャッフル
function shuffleOrder(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export default function StudyDeck({
  notebookId,
  columns,
  cards,
}: {
  notebookId: string;
  columns: string[];
  cards: Card[];
}) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = cards[order[index]];
  const frontColumn = columns[0];
  const senseColumns = columns.slice(1);

  function goNext() {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, order.length - 1));
  }

  function goPrev() {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  function shuffle() {
    setOrder(shuffleOrder(cards.length));
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-zinc-500 dark:text-zinc-500">
        {index + 1} / {order.length}
      </p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-56 w-full max-w-md flex-col items-center justify-center gap-3 rounded-2xl border border-black/[.08] bg-white p-8 text-center transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.25]"
      >
        {!flipped ? (
          <>
            <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
              {frontColumn}
            </span>
            <span className="text-2xl font-semibold text-black dark:text-zinc-50">
              {current.data.head || "—"}
            </span>
          </>
        ) : senseColumns.length > 0 && current.data.senses.length > 0 ? (
          <div className="flex flex-col gap-4">
            {current.data.senses.map((sense, senseIndex) => (
              <div key={senseIndex} className="flex flex-col gap-3">
                {current.data.senses.length > 1 && (
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600">
                    意味 {senseIndex + 1}
                  </p>
                )}
                {senseColumns.map((column) => (
                  <div key={column}>
                    <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
                      {column}
                    </p>
                    <p className="text-lg text-black dark:text-zinc-50">{sense[column] || "—"}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-500">他に項目がありません</p>
        )}
        <span className="mt-2 text-xs text-zinc-400 dark:text-zinc-600">
          クリックして{flipped ? "表" : "裏"}を見る
        </span>
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="rounded-full border border-black/[.08] px-4 py-2 text-sm transition-colors hover:border-black/[.15] disabled:opacity-40 dark:border-white/[.145] dark:hover:border-white/[.25]"
        >
          前へ
        </button>
        <button
          type="button"
          onClick={shuffle}
          className="rounded-full border border-black/[.08] px-4 py-2 text-sm transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:hover:border-white/[.25]"
        >
          シャッフル
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={index === order.length - 1}
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        >
          次へ
        </button>
      </div>

      <Link
        href={`/my-notebooks/${notebookId}`}
        className="text-sm text-zinc-500 transition-colors hover:underline dark:text-zinc-500"
      >
        ← 単語帳に戻る
      </Link>
    </div>
  );
}
