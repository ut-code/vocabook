// 背景の動く文字列とメインコピー（Vocabookなど）の間に敷く、開いた本のシルエット。
// 半透明の図形で背景の文字列を和らげ、手前の文字の視認性を上げる。
export default function BookShape() {
  return (
    <svg
      aria-hidden="true"
      viewBox="2.5 6.25 19 12"
      fill="none"
      preserveAspectRatio="none"
      // 見出しブロック（バッジ・見出し・説明文）を包むdivは中身の実際の幅に
      // シュリンクラップされている（page.tsx側でw-fullを外している）ため、
      // そこに少しだけ外側にはみ出させて（負のinset）重ねれば、
      // 文字を欠けさせず、かつ幅が広がりすぎて本に見えなくなることもない。
      className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 fill-white/70 sm:-inset-x-6 sm:-inset-y-8 dark:fill-zinc-900/60"
      // Bebas Neueはディセンダー分の余白が行下側に大きく偏っているため、
      // insetを上下均等にしただけだとVOCABOOKの文字の中心より下にずれる。
      // 見出しのフォントサイズ（18.7vw）に比例させてその分だけ上に引き上げて中心を合わせる。
      style={{ transform: "translateY(-5.4vw)" }}
    >
      <path d="M3.25 6.75L11 6.75A1 1 0 0 1 12 7.75L12 17.75A1 1 0 0 0 11 16.75L3.25 16.75A0.25 0.25 0 0 1 3 16.5L3 7A0.25 0.25 0 0 1 3.25 6.75Z" />
      <path d="M20.75 6.75L13 6.75A1 1 0 0 0 12 7.75L12 17.75A1 1 0 0 1 13 16.75L20.75 16.75A0.25 0.25 0 0 0 21 16.5L21 7A0.25 0.25 0 0 0 20.75 6.75Z" />
    </svg>
  );
}
