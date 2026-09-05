"use client";

import React, { useState } from "react";

//カードに使うデータ型の設定
interface TriangularCardProps {
  faces: [React.ReactNode, React.ReactNode, React.ReactNode];
  columnNames?: [string, string, string];
  width?: number;
  height?: number;
}

//以下三要素単語帳のカード
export const TriangularCard: React.FC<TriangularCardProps> = ({
  faces,
  columnNames = ["面1", "面2", "面3"],
  width = 340,
  height = 220,
}) => {
  //回転回数の記録
  const [rotationStep, setRotationStep] = useState(0);

  // 正三角形の重心から面までの距離（奥行き押し出し量）
  const tz = Math.round(width / (2 * Math.sqrt(3)));

  // クリック位置（左側か右側か）に応じて回転方向を分岐
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const halfWidth = rect.width / 2;
    //回転回数の更新
    if (clickX < halfWidth) {
      setRotationStep((prev) => prev - 1);
    } else {
      setRotationStep((prev) => prev + 1);
    }
  };
  //表示角度の決定
  const targetAngle = rotationStep * -120;

  // 今見ている面 (0, 1, 2) を割り出す
  const currentIndex = ((rotationStep % 3) + 3) % 3;

  // 左クリック（前へ）で行く面の名前を取得
  const prevIndex = (currentIndex + 2) % 3;
  const prevLabel = columnNames[prevIndex] || "前へ";

  // 右クリック（次へ）で行く面の名前を取得
  const nextIndex = (currentIndex + 1) % 3;
  const nextLabel = columnNames[nextIndex] || "次へ";

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 3D 視界領域 (perspective) */}
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          perspective: "1000px",
          perspectiveOrigin: "50% -160px", //  視点を上に持ち上げて見下ろす
          cursor: "pointer",
          userSelect: "none",
        }}
        className="group relative my-8" // 上部に上面が見えるスペースを確保
        onClick={handleClick}
      >
        {/* 三角柱本体 */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
            // targetAngle だけ回転させる
            transform: `translateZ(-${tz}px) rotateY(${targetAngle}deg)`,
          }}
        >
          {faces.map((content, index) => {
            const angle = index * 120;
            return (
              <div
                key={index}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${tz}px)`,
                }}
                className="absolute h-full w-full flex items-center justify-center p-6 rounded-2xl [backface-visibility:visible] border border-black/18 border-t-black/30 bg-white shadow-xl shadow-black/10 inset-shadow-sm dark:border-white/20 dark:border-t-white/40 dark:bg-zinc-950 dark:shadow-white/5"
              >
                {content}
              </div>
            );
          })}
        </div>

        {/* 左側ホバー時の矢印ガイド（前へ＋前の要素） */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-1/2 items-center justify-start pl-3 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xs font-bold text-black backdrop-blur-sm dark:bg-white/10 dark:text-white">
            <span>◀</span>
            <span>{prevLabel}</span>
          </span>
        </div>

        {/* 右側ホバー時の矢印ガイド（次の要素＋次へ） */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex w-1/2 items-center justify-end pr-3 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xs font-bold text-black backdrop-blur-sm dark:bg-white/10 dark:text-white">
            <span>{nextLabel}</span>
            <span>▶</span>
          </span>
        </div>
      </div>

      {/* 操作ガイド */}
      <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
        <span>◀ 左: 戻る</span>
        <span>|</span>
        <span>右: 進む ▶</span>
      </div>
    </div>
  );
};
