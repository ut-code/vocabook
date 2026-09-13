import type { ConjugationLanguageConfig } from "@/components/verbs/ConjugationPractice";
import { speak } from "@/lib/speech";
import { buildConjugation } from "./engine";
import { PERSONS, TENSE_OPTIONS, formsFor, type ConjugationTable, type VerbEntry } from "./types";

const ACCENT_CYCLES: string[][] = [
  ["e", "é", "è", "ê", "ë"],
  ["a", "à", "â"],
  ["i", "î", "ï"],
  ["o", "ô"],
  ["u", "ù", "û", "ü"],
  ["c", "ç"],
  ["y", "ÿ"],
];

const TOOLBAR_CHARS = ["é", "è", "ê", "ë", "à", "â", "î", "ï", "ô", "ù", "û", "ç"];

export const frenchConjugationConfig: ConjugationLanguageConfig<VerbEntry, ConjugationTable> = {
  persons: PERSONS,
  tenseOptions: TENSE_OPTIONS,
  buildConjugation,
  formsFor,
  speak: (text, handlers) => speak(text, "fr-FR", handlers),
  accentCycles: ACCENT_CYCLES,
  toolbarChars: TOOLBAR_CHARS,
  inputPlaceholder: "活用形を入力...",
};
