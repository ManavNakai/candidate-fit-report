// ============================================================
// Tokenizer — text normalization, stopword removal, n-gram extraction
// ============================================================

import { STOPWORDS } from "./stopwords";
import { SKILL_WEIGHTS } from "./skillWeights";
import type { Token } from "./types";

/**
 * Normalize a string: lowercase, strip non-alphanumeric (keeping +, #, ., /),
 * collapse whitespace.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\r\n\t]+/g, " ")               // newlines → space
    .replace(/[^a-z0-9+#./ -]/g, " ")         // keep +#./ for C++, C#, .NET, CI/CD
    .replace(/\s+/g, " ")                     // collapse whitespace
    .trim();
}

/**
 * Split normalized text into individual word tokens.
 */
export function splitWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((w) => w.replace(/^[./-]+|[./-]+$/g, ""))
    .filter((w) => w.length > 0);
}

/**
 * Check whether a word is a stopword.
 */
export function isStopword(word: string): boolean {
  return STOPWORDS.has(word);
}

/**
 * Generate bigrams from a list of words.
 * e.g. ["machine", "learning", "python"] → ["machine learning", "learning python"]
 */
export function generateBigrams(words: string[]): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  return bigrams;
}

/**
 * Generate trigrams from a list of words.
 */
export function generateTrigrams(words: string[]): string[] {
  const trigrams: string[] = [];
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }
  return trigrams;
}

/**
 * Extract meaningful tokens from raw text.
 *
 * Strategy:
 * 1. Normalize the text.
 * 2. Generate trigrams, bigrams, and unigrams.
 * 3. Match against the skill dictionary first (multi-word matches take priority).
 * 4. For unmatched unigrams that aren't stopwords and are 2+ chars, add as general tokens.
 * 5. Deduplicate by normalized form.
 */
export function extractTokens(rawText: string): Token[] {
  const normalized = normalize(rawText);
  const allWords = splitWords(normalized);
  const tokenMap = new Map<string, Token>();

  // Track which word indices are consumed by multi-word matches
  const consumed = new Set<number>();

  // --- Pass 1: Trigrams (highest priority for multi-word skills) ---
  const trigrams = generateTrigrams(allWords);
  for (let i = 0; i < trigrams.length; i++) {
    const trigram = trigrams[i];
    const skill = SKILL_WEIGHTS[trigram];
    if (skill && !tokenMap.has(trigram)) {
      tokenMap.set(trigram, {
        raw: trigram,
        normalized: trigram,
        category: skill.category,
        weight: skill.weight,
      });
      consumed.add(i);
      consumed.add(i + 1);
      consumed.add(i + 2);
    }
  }

  // --- Pass 2: Bigrams ---
  const bigrams = generateBigrams(allWords);
  for (let i = 0; i < bigrams.length; i++) {
    const bigram = bigrams[i];
    const skill = SKILL_WEIGHTS[bigram];
    if (skill && !tokenMap.has(bigram)) {
      tokenMap.set(bigram, {
        raw: bigram,
        normalized: bigram,
        category: skill.category,
        weight: skill.weight,
      });
      consumed.add(i);
      consumed.add(i + 1);
    }
  }

  // --- Pass 3: Unigrams ---
  for (let i = 0; i < allWords.length; i++) {
    if (consumed.has(i)) continue;

    const word = allWords[i];
    if (word.length < 2) continue;
    if (isStopword(word)) continue;
    if (tokenMap.has(word)) continue;

    const skill = SKILL_WEIGHTS[word];
    if (skill) {
      tokenMap.set(word, {
        raw: word,
        normalized: word,
        category: skill.category,
        weight: skill.weight,
      });
    }
  }

  return Array.from(tokenMap.values());
}

/**
 * Create a lookup Set of normalized token strings for fast membership checks.
 */
export function tokenLookupSet(tokens: Token[]): Set<string> {
  return new Set(tokens.map((t) => t.normalized));
}
