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
  return /[\u4E00-\u9FFF]/.test(word);
}

// 単語ごとの見た目上の横幅を文字数から概算（1文字あたりのem係数。
// CJKは全角文字なので、フォントによらず送り幅がちょうど1emになる）
function estimateWidthEm(word: string) {
  let width = 0;
  for (const ch of word) {
    width += /[\u4E00-\u9FFF]/.test(ch) ? 1 : 0.72;
  }
  return width;
}

// VOCABOOKの見出し(h1)の中心に、流れる文字の縦の中心を合わせるための計算。
// page.tsx側のレイアウト（section: py-24, バッジ: text-xs 1行, gap-6, h1: fontSize 18.7vw）
// をもとに、h1の行ボックス上端は画面幅によらず常に「py-24(96px) + バッジの行の高さ(16px)
// + gap-6(24px) = 136px」の位置になる（実測でも確認済み）。
const H1_TOP_PX = 136;

// VOCABOOKのフォントサイズ（page.tsx側の指定と合わせる）
const VOCABOOK_FONT_SIZE_VW = 18.7;

// VOCABOOKの「見た目の高さの中心」＝実際に文字が塗られているピクセル（インク）の
// 上端と下端の中間点。h1の行ボックス上端からの距離を、フォントサイズに対する比率で
// 表したもの。
//   line-height比 = 1.5
//   fontBoundingBoxAscent比 = 0.90、fontBoundingBoxDescent比 = 0.30
//   actualBoundingBoxAscent比（インク上端） = 0.71、actualBoundingBoxDescent比（インク下端） = 0.01
// これらから、インクの中心は行ボックス上端からフォントサイズのちょうど0.70倍の位置になる
// （h1のフォントや文字列を変えたら、この値も実測し直すこと）
const VOCABOOK_INK_CENTER_RATIO = 0.7;

// VOCABOOKのインクの高さ（上端〜下端）は、上と同じ実測により
// actualBoundingBoxAscent比(0.71) + actualBoundingBoxDescent比(0.01) = フォントサイズの0.72倍
const VOCABOOK_INK_HEIGHT_RATIO = 0.72;

// VOCABOOKの視覚的な縦中心（背景コンテナ上端からの距離、px + vw）
const VOCABOOK_CENTER_VW = VOCABOOK_INK_CENTER_RATIO * VOCABOOK_FONT_SIZE_VW;

// 二次曲線の頂点（画面中央、単語がVOCABOOKの前を横切る瞬間）どうしの距離が、
// VOCABOOKの実際の文字の高さ（インクの上端〜下端）の2倍になるようにする。
// 頂点は中心から一番遠い位置（弧の基準位置＝画面外の待機列にいる間は中心に寄り、
// 中央で最も離れる向き）になるようにし、そこから中心までの距離はその半分
// （globals.cssの@keyframes vb-wave-dip/vb-wave-peakの振れ幅と連動しているので、
// 変更する場合は両方を合わせて直すこと）
const VOCABOOK_INK_HEIGHT_VW = VOCABOOK_INK_HEIGHT_RATIO * VOCABOOK_FONT_SIZE_VW;
const VERTEX_OFFSET_VW = (VOCABOOK_INK_HEIGHT_VW * 2) / 2;

type Curve = {
  // "dip"は画面中央で下に凸（谷）、"peak"は画面中央で上に凸（山）。
  // 頂点はどちらも画面横幅の中心。振れ幅を抑えて互いに交差しないようにする
  shape: "dip" | "peak";
  // 弧の基準位置（アニメーション開始・終了時点の高さ。背景コンテナ上端からの距離）
  baselineTop: string;
  // 単語がスタート地点からゴール地点まで移動する距離（画面外の余白を含む、vw）
  travelVw: number;
  // フォントサイズ（vw指定。画面幅に比例させることで、どの画面幅でも
  // 1emあたりのvw換算値が変わらず、単語間隔の計算が崩れないようにする）
  fontSizeVw: number;
  fontSizeMinRem: number;
  fontSizeMaxRem: number;
  // 単語と単語の間に空けるスペース（em）
  gapEm: number;
  durationSeconds: number;
  direction: "normal" | "reverse";
};

const TOP_CURVE: Curve = {
  // "peak"（頂点でVERTEX_OFFSET_VW分上に動く）にすることで、画面中央でVOCABOOKから
  // 一番遠ざかる（＝重ならない）向きにする
  shape: "peak",
  // 弧の基準位置（画面外の待機列にいる高さ）はVOCABOOKの縦中心そのもの。
  // 頂点（画面中央）ではそこからVERTEX_OFFSET_VW分上に離れる
  baselineTop: `calc(${H1_TOP_PX}px + ${VOCABOOK_CENTER_VW}vw)`,
  travelVw: 124,
  fontSizeVw: 4.4,
  fontSizeMinRem: 0.8,
  fontSizeMaxRem: 5.5,
  gapEm: 2.2,
  durationSeconds: 34,
  direction: "reverse",
};

const BOTTOM_CURVE: Curve = {
  // "dip"（頂点でVERTEX_OFFSET_VW分下に動く）にすることで、画面中央でVOCABOOKから
  // 一番遠ざかる（＝重ならない）向きにする
  shape: "dip",
  // 弧の基準位置（画面外の待機列にいる高さ）はVOCABOOKの縦中心そのもの。
  // 頂点（画面中央）ではそこからVERTEX_OFFSET_VW分下に離れる
  baselineTop: `calc(${H1_TOP_PX}px + ${VOCABOOK_CENTER_VW}vw)`,
  travelVw: 124,
  fontSizeVw: 3.6,
  fontSizeMinRem: 0.6,
  fontSizeMaxRem: 4.5,
  gapEm: 2.2,
  durationSeconds: 34,
  direction: "normal",
};

function buildChain(words: string[], curve: Curve) {
  const stepVw = curve.fontSizeVw; // 1emあたりのvw換算値
  const chainWords: string[] = [];
  const offsetsVw: number[] = [];

  let cumulativeVw = 0;
  let i = 0;
  // 画面外の待機列も含めて、移動距離全体が単語で埋まるまで並べる
  while (cumulativeVw < curve.travelVw) {
    const word = words[i % words.length];
    const widthVw = estimateWidthEm(word) * stepVw;
    chainWords.push(word);
    // 各単語はtranslate(-50%, -50%)で「その位置」を中心にレンダリングされるため、
    // 枠の開始位置ではなく枠の中心（開始位置 + 単語幅の半分）をオフセットにする。
    // 開始位置をそのまま使うと、単語ごとに幅が違う分だけ隣の単語との間隔が
    // 均等にならない（幅が広い単語ほど左にずれて詰まって見える）
    offsetsVw.push(cumulativeVw + widthVw / 2);
    cumulativeVw += widthVw + curve.gapEm * stepVw;
    i++;
  }

  // ループの継ぎ目（最後の単語→最初の単語）も他と同じ間隔になるよう、
  // 固定のtravelVwではなく実際に単語で埋まった合計幅を1周期として使う
  const loopPeriodVw = cumulativeVw;

  return chainWords.map((word, idx) => {
    const t = offsetsVw[idx] / loopPeriodVw;
    return { word, delaySeconds: -t * curve.durationSeconds };
  });
}

function WaveCurve({
  words,
  curve,
  className,
}: {
  words: string[];
  curve: Curve;
  className: string;
}) {
  const items = buildChain(words, curve);

  return (
    <>
      {items.map(({ word, delaySeconds }, i) => (
        <span
          key={`${word}-${i}`}
          className={`vb-wave-item vb-wave-item--${curve.shape} whitespace-nowrap ${
            isCJK(word) ? "font-serif" : bookFont.className
          } ${className}`}
          style={{
            top: curve.baselineTop,
            fontSize: `clamp(${curve.fontSizeMinRem}rem, ${curve.fontSizeVw}vw, ${curve.fontSizeMaxRem}rem)`,
            animationDuration: `${curve.durationSeconds}s`,
            animationDirection: curve.direction,
            animationDelay: `${delaySeconds}s`,
          }}
        >
          {word}
        </span>
      ))}
    </>
  );
}

// 背景の装飾：画面横幅の中心を頂点とする、下に凸／上に凸の2本の弧（交差しない）に沿って単語が連なって流れる
export default function Background() {
  return (
    <div
      aria-hidden="true"
      // 装飾目的なのでaria-hidden
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      <WaveCurve
        words={vocabularyWords}
        curve={TOP_CURVE}
        className="text-zinc-300 dark:text-zinc-800"
      />
      <WaveCurve
        words={bookWords}
        curve={BOTTOM_CURVE}
        className="text-zinc-300 dark:text-zinc-800"
      />
    </div>
  );
}
