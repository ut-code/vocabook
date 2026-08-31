"use client";

import { useEffect, useOptimistic, useRef, useState } from "react";
import Link from "next/link";

import { incrementViewCount, toggleStar } from "../../actions";
import EyeIcon from "@/components/EyeIcon";
import StarCountEditor from "@/components/StarCountEditor";
import { useStarColors } from "@/components/UseStarColors";
import { starColorFor } from "@/lib/star-colors";
import type { CardData } from "@/lib/card-data";
import { TriangularCard } from "@/components/my-notebooks/ThreeElement"; //三次元用の三角柱UIを導入

type Card = {
  id: string;
  data: CardData;
  starred: boolean;
  starCount: number;
  viewCount: number;
};

// Fisher-Yatesシャッフル: [0, 1, ..., length-1] という「カードの元の並び順（インデックス）」の
// 配列を作り、末尾から先頭に向かって「自分より前（自分を含む）」のランダムな位置と1つずつ
// 交換していくことで、すべての並び替えパターンが等確率で出現するようにする。
// cards配列自体は書き換えず、参照順だけを表すこの order 配列をシャッフルする点がポイント
// （元のカード配列とidの対応を保ったまま表示順だけ変えられる）
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
  // order: 「何番目に何のカード（cards配列のインデックス）を出すか」を表す並び替えテーブル。
  // 初期状態は [0, 1, 2, ...] で、cardsをそのままの順番で出す
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  // index: order の何番目（＝現在何枚目）を表示しているか
  const [index, setIndex] = useState(0);
  // flipped: 今のカードが表（見出し語）か裏（意味）のどちらを向いているか
  const [flipped, setFlipped] = useState(false);

  // 現在表示すべきカードは、order[index]（実際のcardsインデックス）から引く
  const current = cards[order[index]];
  const frontColumn = columns[0];
  const senseColumns = columns.slice(1);

  // 要素数がちょうど3個の時だけ3Dモードにする判定
  const is3DMode = columns.length === 3;

  // 3D三角柱のそれぞれの面に入れるコンテンツの準備
  const primarySense = current?.data.senses[0] || {};
  const faces: [React.ReactNode, React.ReactNode, React.ReactNode] = [
    // 面1（見出し語）
    <div key="face1" className="flex flex-col items-center gap-2 text-center">
      <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
        {columns[0]}
      </span>
      <span className="text-2xl font-semibold text-black dark:text-zinc-50">
        {current?.data.head || "—"}
      </span>
    </div>,
    // 面2（2つ目の要素）
    <div key="face2" className="flex flex-col items-center gap-2 text-center">
      <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
        {columns[1]}
      </span>
      <span className="text-xl font-medium text-black dark:text-zinc-50">
        {primarySense[columns[1]] || "—"}
      </span>
    </div>,
    // 面3（3つ目の要素）
    <div key="face3" className="flex flex-col items-center gap-2 text-center">
      <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
        {columns[2]}
      </span>
      <span className="text-base text-zinc-700 dark:text-zinc-300">
        {primarySense[columns[2]] || "—"}
      </span>
    </div>,
  ];
  // toggleStarの結果（サーバーの往復）を待たず、クリックした瞬間に★・回数・色を切り替えるためのUI
  // idも保持し、往復の間にカードを送り進めても別カードへ誤って適用されないようにする
  const [optimisticStar, setOptimisticStar] = useOptimistic(
    { id: current.id, starred: current.starred, starCount: current.starCount },
    (_state, next: { id: string; starred: boolean; starCount: number }) => next,
  );
  const displayedStar =
    optimisticStar.id === current.id
      ? optimisticStar
      : { id: current.id, starred: current.starred, starCount: current.starCount };
  async function handleToggleStar() {
    setOptimisticStar(
      current.starred
        ? { id: current.id, starred: false, starCount: current.starCount }
        : { id: current.id, starred: true, starCount: current.starCount + 1 },
    );
    await toggleStar(current.id, notebookId);
  }

  // ★を付けた回数（displayedStar.starCount）に応じた色。0回（未使用）ならundefinedになりニュートラル表示にする
  const { colors: starColors } = useStarColors();
  const starColor = starColorFor(displayedStar.starCount, starColors);

  // カードが切り替わる（＝暗記モードでこの単語が表示される）たびに、表示回数を1増やす
  // countedIdRefで直前に数えたカードIDを覚えておき、同じidに対して二重に数えないようにする
  // （開発時のStrictModeによるeffect二重発火対策も兼ねる）
  const countedIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (countedIdRef.current === current.id) return;
    countedIdRef.current = current.id;
    incrementViewCount(current.id, notebookId).catch(() => {});
  }, [current.id, notebookId]);

  // 次のカードへ。indexが末尾を超えないようMath.minでクランプし、
  // カードが切り替わったら必ず表向きに戻す
  function goNext() {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, order.length - 1));
  }

  // 前のカードへ。indexが0未満にならないようMath.maxでクランプする
  function goPrev() {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  // 出題順を丸ごとシャッフルし直し、1枚目（index=0）・表向きの状態からやり直す
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
      
      {/* relativeなラッパーで囲み、右上の★ボタンをカードに重ねて絶対配置する。
          ★ボタンはフリップ用ボタンとは別要素（兄弟）なので、クリックがフリップに巻き込まれない */}
      <div className="relative w-full max-w-md">
        {/* カード自体がクリック領域。クリックするたびに表裏(flipped)をトグルするだけで、
            カードの移動（前へ/次へ/シャッフル）とは独立した操作になっている */}
        
      {is3DMode ? (
        /* 3つの要素があるときは三角柱 */
        <div className="my-2 flex flex-col items-center gap-2">
          <TriangularCard
            key={current.id}
            faces={faces}
            columnNames={columns as [string, string, string]}
            width={320}
            height={220}
          />
          <span className="mt-2 text-xs text-zinc-400 dark:text-zinc-600">
            クリックして次の面へ回転
          </span>
        </div>
      ) : (
        /* それ以外の時（2つの要素など）は元通りの表裏ボタン */
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="flex min-h-56 w-full max-w-md flex-col items-center justify-center gap-3 rounded-2xl border border-black/[.08] bg-white p-8 text-center transition-colors hover:border-black/[.15] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.25]"
        >
          {!flipped ? (
            // 表面: 1列目（見出し語）だけを大きく表示する
            <>
              <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
                {frontColumn}
              </span>
              <span className="text-2xl font-semibold text-black dark:text-zinc-50">
                {current.data.head || "—"}
              </span>
            </>
          ) : senseColumns.length > 0 && current.data.senses.length > 0 ? (
            // 裏面: 意味が1件以上あれば、多義語すべてを「意味1」「意味2」…として順番に表示する
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
            // 意味の列自体が無い、またはこのカードに意味が1件も登録されていない場合のフォールバック表示
            <p className="text-sm text-zinc-500 dark:text-zinc-500">他に項目がありません</p>
          )}
          <span className="mt-2 text-xs text-zinc-400 dark:text-zinc-600">
            クリックして{flipped ? "表" : "裏"}を見る
          </span>
        </button>
      )}

        {/* handleToggleStar は楽観的UI: optimisticStar を即座に切り替えてから
            toggleStar（サーバー更新）を呼ぶ。表示も current.starred ではなく
            displayedStar.starred を見るため、通信を待たずに★が切り替わる。

            ★ボタンはフリップボタンと別要素にし、右上に絶対的に配置。
            ★クリックがフリップに巻き込まれないようにするため。

            回数の表示・修正は StarCountEditor に分離。誤クリック時も
            手動で書き換え・0リセットができる。

            全件モード（/study）は再検証しても件数・並び順が変わらないため、
            ★の付け外しをその場で反映できる。 */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <form action={handleToggleStar}>
            <button
              type="submit"
              aria-label={displayedStar.starred ? "★を外す" : "★をつける"}
              style={starColor ? { color: starColor } : undefined}
              className={
                starColor
                  ? "text-2xl transition-opacity hover:opacity-75"
                  : "text-2xl text-zinc-300 transition-colors hover:text-zinc-400 dark:text-zinc-700 dark:hover:text-zinc-500"
              }
            >
              {displayedStar.starred ? "★" : "☆"}
            </button>
          </form>
          <StarCountEditor
            cardId={current.id}
            notebookId={notebookId}
            starCount={displayedStar.starCount}
            color={starColor}
          />
          {/* 目アイコンは暗記モード（/study, /review）でこのカードが表示された累計回数。
              ★（左）の右隣に並べる。サイズは★の文字サイズ（text-2xl）に合わせている */}
          <span
            aria-label="暗記モードで表示した回数"
            className="inline-flex items-center gap-0.5 text-sm text-zinc-400 dark:text-zinc-600"
          >
            <EyeIcon className="h-6 w-6" />
            {current.viewCount}
          </span>
        </div>
      </div>

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
