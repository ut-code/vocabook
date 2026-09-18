import { useCallback, useEffect, useRef, useState } from "react";
import { speak } from "@/lib/speech";
import type { ListeningLanguageConfig, ListeningQuizItemBase } from "@/lib/listening/types";

// 出題数の選択肢型定義
export type CountOption = "5" | "10" | "20" | "all";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function filterByCategory<T extends ListeningQuizItemBase>(items: T[], category: string): T[] {
  if (category === "all") return items;
  return items.filter((item) => item.categoryTitle === category);
}

/**
 * 発音識別演習（単語の聞き分け・長文の穴埋め）に共通する出題・採点ステートマシン。
 * 問題カードの見た目はモードごとに異なるため、状態と操作だけをこのフックで共有する。
 */
export function useListeningQuiz<T extends ListeningQuizItemBase>(
  items: T[],
  language: ListeningLanguageConfig,
) {
  // ユーザーが選択した設定状態（カテゴリ・出題数）
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCount, setSelectedCount] = useState<CountOption>("10");

  // カテゴリ一覧の取得
  const categories = Array.from(new Set(items.map((item) => item.categoryTitle)));

  // 問題リストの構築純粋関数
  const buildQuestions = useCallback((list: T[], cat: string, count: CountOption) => {
    const filtered = filterByCategory(list, cat);
    const shuffled = shuffleArray(filtered);
    const countNum = count === "all" ? shuffled.length : parseInt(count, 10);
    return shuffled.slice(0, countNum);
  }, []);

  // 初回マウントフラグ
  const isMountedRef = useRef(false);

  // クライアントハイドレーション一致のための問題状態
  const [questions, setQuestions] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  /**
   * 出題設定が変更された際、または再挑戦時に問題をリセットする処理
   */
  const resetQuiz = useCallback(
    (cat: string, count: CountOption) => {
      const newQuestions = buildQuestions(items, cat, count);
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
      setIsAnswered(false);
      setUserAnswer("");
      setIsCorrect(null);
    },
    [items, buildQuestions],
  );

  // クライアントサイドでのマウント時に初回問題を生成
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      resetQuiz("all", "10");
    }
  }, [resetQuiz]);

  // アンマウント時に読み上げ中の音声を止める
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const currentQuestion = questions[currentIndex];

  const playCurrent = useCallback(
    (item?: T) => {
      if (!item) return;
      const started = speak(item.spokenText ?? item.answer, language.langTag, {
        onEnd: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
      if (started) setSpeaking(true);
    },
    [language.langTag],
  );

  // 新しい問題が表示されるたびに自動で発音を再生する
  // （setTimeoutで遅延させ、エフェクト本体内での同期的なsetState呼び出しを避ける）
  useEffect(() => {
    if (isFinished || !currentQuestion) return;
    const timer = setTimeout(() => playCurrent(currentQuestion), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, isFinished]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    resetQuiz(cat, selectedCount);
  };

  const handleCountChange = (count: CountOption) => {
    setSelectedCount(count);
    resetQuiz(selectedCategory, count);
  };

  /**
   * 次の問題に進むか、全問題終了画面へ移行する処理
   */
  const goNext = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setUserAnswer("");
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, questions.length]);

  /**
   * 解答の送信および次問題への遷移処理
   */
  const handleSubmit = useCallback(() => {
    if (isAnswered) {
      goNext();
      return;
    }

    if (!userAnswer.trim() || !currentQuestion) return;

    const normalize = language.normalize ?? ((v: string) => v.trim().toLowerCase());
    const correct = normalize(userAnswer) === normalize(currentQuestion.answer);

    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore((s) => s + 1);
    }
  }, [isAnswered, goNext, userAnswer, currentQuestion, language]);

  // 結果表示状態でフォーカスが外れていてもEnterキーを押せば次へ進むキーボードリスナー
  useEffect(() => {
    if (!isAnswered || isFinished) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (e.isComposing) return;
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isAnswered, isFinished, goNext]);

  const handleSkip = () => {
    goNext();
  };

  return {
    categories,
    selectedCategory,
    selectedCount,
    handleCategoryChange,
    handleCountChange,
    questions,
    currentIndex,
    currentQuestion,
    userAnswer,
    setUserAnswer,
    isAnswered,
    isCorrect,
    score,
    isFinished,
    speaking,
    playCurrent,
    handleSubmit,
    goNext,
    handleSkip,
    resetQuiz,
  };
}
