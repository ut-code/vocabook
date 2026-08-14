import { Fraunces } from "next/font/google";

/* 4言語（vocabulary/vocabulaire/Wortschatz/vocabulario、book/livre/Buch/libro）に共通で使うフォント。
next/font/googleは中国語フォントに不具合があるため、中国語（词汇・书）はOSの標準フォント。*/
const bookFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-book",
});

const vocabularyWords = ["vocabulary", "词汇", "vocabulaire", "Wortschatz", "vocabulario"];

const bookWords = ["book", "书", "livre", "Buch", "libro"];

function isCJK(word: string) {
  return /[\u4e00-\u9fff]/.test(word);
}

type Depth = {
  // 手前(fg)・奥(bg)。速さや振れ幅の見た目上の強さを決める
  layer: "fg" | "bg";
  amplitudeY: number;
  amplitudeRotate: number;
  scaleRange: number;
  opacityRange: [number, number];
};

const FG: Depth = {
  layer: "fg",
  amplitudeY: 16,
  amplitudeRotate: 3.5,
  scaleRange: 0.1,
  opacityRange: [0.65, 1],
};

const BG: Depth = {
  layer: "bg",
  amplitudeY: 9,
  amplitudeRotate: 2,
  scaleRange: 0.06,
  opacityRange: [0.55, 0.9],
};

function FlowRow({
  words,
  phase,
  depth,
  repeat,
  className,
}: {
  words: string[];
  phase: number;
  depth: Depth;
  repeat: number;
  className: string;
}) {
  const totalItems = words.length * repeat * 2;
  const items = Array.from({ length: totalItems }, (_, i) => words[i % words.length]);
  const freq = (2 * Math.PI) / words.length;

  return (
    <div
      className={`vb-flow-row vb-flow-row--${depth.layer} flex w-max shrink-0 items-baseline gap-12 whitespace-nowrap ${className}`}
    >
      {items.map((word, i) => {
        const angle = (i % words.length) * freq + phase;
        const wave = Math.sin(angle) + 0.25 * Math.sin(angle * 2);
        const norm = wave / 1.25; // -1〜1 に正規化

        const translateY = wave * depth.amplitudeY;
        const rotate = Math.cos(angle) * depth.amplitudeRotate;
        const scale = 1 + norm * depth.scaleRange;
        const [opMin, opMax] = depth.opacityRange;
        const opacity = opMin + ((norm + 1) / 2) * (opMax - opMin);

        return (
          <span
            key={`${word}-${i}`}
            className={isCJK(word) ? "font-serif" : bookFont.className}
            style={{
              transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
              opacity,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

// 背景の装飾
export default function Background() {
  return (
    <div
      aria-hidden="true"
      // 装飾目的なのでaria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex select-none flex-col justify-center gap-8 overflow-hidden"
    >
      <FlowRow
        words={vocabularyWords}
        phase={0}
        depth={FG}
        repeat={3}
        className="text-4xl text-zinc-300 sm:text-5xl dark:text-zinc-800"
      />
      <FlowRow
        words={bookWords}
        phase={Math.PI}
        depth={BG}
        repeat={3}
        className="text-3xl text-zinc-300 sm:text-4xl dark:text-zinc-800"
      />
    </div>
  );
}
