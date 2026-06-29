import { describe, it, expect } from "vitest";
import {
  normalize,
  splitWords,
  extractTokens,
  isStopword,
} from "../lib/tokenizer";

describe("Tokenizer", () => {
  describe("normalize", () => {
    it("lowercases text", () => {
      expect(normalize("HELLO")).toBe("hello");
    });

    it("collapses whitespace", () => {
      expect(normalize("hello world\n\t!")).toBe("hello world");
    });

    it("keeps specific special characters", () => {
      expect(normalize("C++, C#, .NET, CI/CD")).toBe("c++ c# .net ci/cd");
    });

    it("removes punctuation", () => {
      expect(normalize("hello, world! How's it going?")).toBe(
        "hello world how s it going"
      );
    });

    it("handles empty text safely", () => {
      expect(normalize("")).toBe("");
      expect(normalize("   \n\t   ")).toBe("");
    });
  });

  describe("splitWords", () => {
    it("splits by space", () => {
      expect(splitWords("hello world")).toEqual(["hello", "world"]);
    });

    it("ignores empty strings", () => {
      expect(splitWords(" hello world ")).toEqual(["hello", "world"]);
    });

    it("trims leading and trailing separators", () => {
      expect(splitWords("/react ./node.js aws/")).toEqual([
        "react",
        "node.js",
        "aws",
      ]);
    });
  });

  describe("isStopword", () => {
    it("identifies stopwords", () => {
      expect(isStopword("the")).toBe(true);
      expect(isStopword("and")).toBe(true);
      expect(isStopword("experience")).toBe(true);
    });

    it("does not identify non-stopwords", () => {
      expect(isStopword("react")).toBe(false);
      expect(isStopword("python")).toBe(false);
      expect(isStopword("developer")).toBe(false);
    });
  });

  describe("extractTokens", () => {
    it("extracts dictionary tokens with higher priority", () => {
      const text = "I have experience with React and Python, as well as Next.js.";
      const tokens = extractTokens(text);

      const normalizedTokens = tokens.map((t) => t.normalized);
      expect(normalizedTokens).toContain("react");
      expect(normalizedTokens).toContain("python");
      expect(normalizedTokens).toContain("next.js");
      expect(normalizedTokens).not.toContain("experience");
      expect(normalizedTokens).not.toContain("and");
    });

    it("extracts bigrams", () => {
      const text = "Looking for a software engineer with React Native skills.";
      const tokens = extractTokens(text);

      const normalizedTokens = tokens.map((t) => t.normalized);
      expect(normalizedTokens).toContain("react native");
    });

    it("extracts trigrams", () => {
      const text = "Experience with Amazon Web Services is a plus.";
      const tokens = extractTokens(text);

      const normalizedTokens = tokens.map((t) => t.normalized);
      expect(normalizedTokens).toContain("amazon web services");
    });

    it("deduplicates tokens", () => {
      const text = "React react React.js react";
      const tokens = extractTokens(text);

      const reactCount = tokens.filter((t) => t.normalized === "react").length;
      expect(reactCount).toBe(1);
    });

    it("returns an empty array for empty or stopword-only text", () => {
      expect(extractTokens("")).toEqual([]);
      expect(extractTokens("the and with for")).toEqual([]);
    });
  });
});