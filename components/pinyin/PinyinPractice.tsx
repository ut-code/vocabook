"use client";

import { useEffect, useMemo, useState } from "react";
import { ACCENT_FONT_STYLE, AccentInput } from "@/components/verbs/AccentInput";
import { canonicalPinyin, TONE_CYCLES, TOOLBAR_CHARS } from "@/lib/pinyin";
import { speak } from "@/lib/speech";
import type { HanziEntry } from "@/app/learn/chinese/04/characters";

interface Question {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

interface PinyinPracticeProps {
  characters: HanziEntry[];
}

export function PinyinPractice({ characters }: PinyinPracticeProps) {
  const [phase, setPhase] = useState<"settings" | "practice">("settings");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(characters.map((c) => c.id)),
  );
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const selectedCharacters = useMemo(
    () => characters.filter((c) => selectedIds.has(c.id)),
    [characters, selectedIds],
  );

  const toggleCharacter = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setAll = (on: boolean) =>
    setSelectedIds(on ? new Set(characters.map((c) => c.id)) : new Set());

  const speakHanzi = (hanzi: string) => {
    const started = speak(hanzi, "zh-CN", {
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
    if (started) setSpeaking(true);
  };

  const generateQuestion = (pool = selectedCharacters, history = recentIds) => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    if (pool.length === 0) return;

    let candidates = pool.filter((c) => !history.includes(c.id));
    if (candidates.length === 0) candidates = pool;

    const next = candidates[Math.floor(Math.random() * candidates.length)];
    // 直近の出題を避ける。ただし少なくとも1つは候補が残るよう、選択数-1 を上限にする
    setRecentIds((prev) => [next.id, ...prev].slice(0, Math.max(0, Math.min(8, pool.length - 1))));
    setQuestion({ id: next.id, hanzi: next.hanzi, pinyin: next.pinyin, meaning: next.meaning });
    setAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
  };

  const startPractice = () => {
    setScore({ correct: 0, total: 0 });
    setRecentIds([]);
    setPhase("practice");
    generateQuestion(selectedCharacters, []);
  };

  const handleSubmit = () => {
    if (!question) return;
    if (!submitted) {
      const correct = canonicalPinyin(answer) === canonicalPinyin(question.pinyin);
      setIsCorrect(correct);
      setSubmitted(true);
      setScore((prev) => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
      if (audioEnabled) speakHanzi(question.hanzi);
    } else {
      generateQuestion();
    }
  };

  if (phase === "settings") {
    const canStart = selectedIds.size > 0;
    return (
      <div className="space-y-10">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-base font-bold text-zinc-800 dark:text-zinc-100">出題する漢字</div>
            <div className="flex gap-3 text-sm">
              <button
                type="button"
                onClick={() => setAll(true)}
                className="text-tealblue-600 hover:underline dark:text-tealblue-400"
              >
                全て選択
              </button>
              <button
                type="button"
                onClick={() => setAll(false)}
                className="text-tealblue-600 hover:underline dark:text-tealblue-400"
              >
                全て解除
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {characters.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors hover:border-tealblue-300 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-tealblue-600"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(c.id)}
                  onChange={() => toggleCharacter(c.id)}
                  className="h-4 w-4 accent-tealblue-600"
                />
                <span>
                  <span className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
                    {c.hanzi}
                  </span>
                  <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">{c.meaning}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900/50">
            <div>
              <div className="font-bold text-zinc-800 dark:text-zinc-100">音声読み上げ</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                答え合わせのときに、漢字の発音を自動で読み上げます。
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAudioEnabled((prev) => !prev)}
              aria-pressed={audioEnabled}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                audioEnabled
                  ? "bg-tealblue-600 text-white hover:bg-tealblue-700"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {audioEnabled ? "🔊 音声オン" : "🔇 音声オフ"}
            </button>
          </div>
        </section>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={startPractice}
            disabled={!canStart}
            className="rounded-full bg-tealblue-600 px-10 py-3 font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-tealblue-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            練習を始める
          </button>
        </div>
        {!canStart && (
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            漢字を1つ以上選んでください。
          </div>
        )}
      </div>
    );
  }

  if (!question) {
    return (
      <div className="py-16 text-center text-zinc-500 dark:text-zinc-400">
        <div>出題できる漢字がありません。設定を見直してください。</div>
        <button
          type="button"
          onClick={() => setPhase("settings")}
          className="mt-4 text-tealblue-600 hover:underline dark:text-tealblue-400"
        >
          設定に戻る
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <button
          type="button"
          onClick={() => setPhase("settings")}
          className="text-tealblue-600 hover:underline dark:text-tealblue-400"
        >
          設定に戻る
        </button>
        <span>
          正解: {score.correct} / {score.total}
        </span>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900/50">
        <div className="mb-2 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
          この漢字のピンインは？
        </div>
        <div className="mb-6 text-center">
          <div className="text-7xl font-bold text-zinc-800 dark:text-zinc-100">
            {question.hanzi}
          </div>
          {submitted && (
            <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{question.meaning}</div>
          )}
        </div>

        <AccentInput
          value={answer}
          onChange={setAnswer}
          onSubmit={handleSubmit}
          disabled={submitted}
          autoFocus
          placeholder="ピンインを入力..."
          accentCycles={TONE_CYCLES}
          toolbarChars={TOOLBAR_CHARS}
          chordReplacements={{ "u\\": "ü" }}
          hintText={
            <>
              ヒント: 母音（a e i o u ü）を入力した直後に ↑キーを押すと、
              <span style={ACCENT_FONT_STYLE}>a → ā → á → ǎ → à</span>
              のように四声の記号を付けられます（↓キーで逆順）。ü は u に続けて \
              を打つと入力できます。 ü や記号は下のボタンからも入力できます。数字での声調入力（例:
              hao3）も正解になります。
            </>
          }
          className={`w-full rounded-xl border-2 px-4 py-3 text-center text-xl font-medium text-zinc-800 outline-none transition-colors dark:text-zinc-100 ${
            !submitted
              ? "border-zinc-200 bg-white focus:border-tealblue-400 dark:border-zinc-700 dark:bg-zinc-800"
              : isCorrect
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-red-500 bg-red-50 dark:bg-red-900/20"
          }`}
        />

        {submitted && (
          <div className="mt-4 flex flex-col items-center gap-2 text-center">
            {isCorrect ? (
              <div className="font-bold text-green-600 dark:text-green-400">
                正解！（<span style={ACCENT_FONT_STYLE}>{question.pinyin}</span>）
              </div>
            ) : (
              <div className="font-bold text-red-600 dark:text-red-400">
                不正解 — 正解は「<span style={ACCENT_FONT_STYLE}>{question.pinyin}</span>」
              </div>
            )}
            <button
              type="button"
              onClick={() => speakHanzi(question.hanzi)}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:border-tealblue-400 hover:text-tealblue-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-tealblue-500 dark:hover:text-tealblue-400"
            >
              {speaking ? "🔊 再生中…" : "🔊 発音を聞く"}
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-tealblue-600 px-8 py-3 font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-tealblue-700"
          >
            {submitted ? "次の問題へ" : "答え合わせ"}
          </button>
        </div>
      </div>
    </div>
  );
}
