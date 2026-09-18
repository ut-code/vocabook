import type { ConjugationLanguageConfig } from "@/components/verbs/ConjugationPractice";
import { speak } from "@/lib/speech";
import { buildConjugation } from "./engine";
import { PERSONS, TENSE_OPTIONS, formsFor, type ConjugationTable, type VerbEntry } from "./types";

const ACCENT_CYCLES: string[][] = [
  ["a", "ä"],
  ["o", "ö"],
  ["u", "ü"],
  ["s", "ß"],
];

const TOOLBAR_CHARS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

export const germanConjugationConfig: ConjugationLanguageConfig<VerbEntry, ConjugationTable> = {
  languageSlug: "german",
  persons: PERSONS,
  tenseOptions: TENSE_OPTIONS,
  buildConjugation,
  formsFor,
  speak: (text, handlers) => speak(text, "de-DE", handlers),
  accentCycles: ACCENT_CYCLES,
  toolbarChars: TOOLBAR_CHARS,
  inputPlaceholder: "活用形を入力...",
};
