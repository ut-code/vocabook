import type { ConjugationLanguageConfig } from "@/components/verbs/ConjugationPractice";
import { speak } from "@/lib/speech";
import { buildConjugation } from "./engine";
import { PERSONS, TENSE_OPTIONS, formsFor, type ConjugationTable, type VerbEntry } from "./types";

const ACCENT_CYCLES: string[][] = [
  ["a", "á"],
  ["e", "é"],
  ["i", "í"],
  ["o", "ó"],
  ["u", "ú", "ü"],
  ["n", "ñ"],
];

const TOOLBAR_CHARS = ["á", "é", "í", "ó", "ú", "ü", "ñ"];

export const spanishConjugationConfig: ConjugationLanguageConfig<VerbEntry, ConjugationTable> = {
  persons: PERSONS,
  tenseOptions: TENSE_OPTIONS,
  buildConjugation,
  formsFor,
  speak: (text, handlers) => speak(text, "es-ES", handlers),
  accentCycles: ACCENT_CYCLES,
  toolbarChars: TOOLBAR_CHARS,
  inputPlaceholder: "活用形を入力...",
};
