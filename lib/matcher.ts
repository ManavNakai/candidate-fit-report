// ============================================================
// Matcher — core scoring engine
// ============================================================

import type { MatchResult, MatchStats, SectionCheck, Token } from "./types";
import { extractTokens, tokenLookupSet } from "./tokenizer";

// ── Section detection patterns ───────────────────────────────

interface SectionPattern {
  section: string;
  /** Patterns to look for in the JD (case-insensitive). */
  jdPatterns: RegExp[];
  /** Patterns to look for in the resume (case-insensitive). */
  resumePatterns: RegExp[];
}

const SECTION_PATTERNS: SectionPattern[] = [
  {
    section: "Technical Skills",
    jdPatterns: [
      /\b(technical|tech)\s+skills?\b/i,
      /\brequired\s+skills?\b/i,
      /\btechnologies?\b/i,
      /\btech\s+stack\b/i,
      /\bprogramming\b/i,
      /\bframework/i,
    ],
    resumePatterns: [
      /\btechnical\s+skills?\b/i,
      /\bskills?\b/i,
      /\btechnologies?\b/i,
      /\btech\s+stack\b/i,
      /\bprogramming\b/i,
      /\bproficienc/i,
    ],
  },
  {
    section: "Work Experience",
    jdPatterns: [
      /\bexperience\b/i,
      /\byears?\s+(of\s+)?experience\b/i,
      /\bwork\s+history\b/i,
      /\bprofessional\s+experience\b/i,
    ],
    resumePatterns: [
      /\bexperience\b/i,
      /\bwork\s+experience\b/i,
      /\bprofessional\s+experience\b/i,
      /\bemployment\b/i,
      /\bwork\s+history\b/i,
    ],
  },
  {
    section: "Education",
    jdPatterns: [
      /\beducation\b/i,
      /\bdegree\b/i,
      /\bbachelor/i,
      /\bmaster/i,
      /\bphd\b/i,
      /\buniversity\b/i,
      /\bcollege\b/i,
    ],
    resumePatterns: [
      /\beducation\b/i,
      /\bdegree\b/i,
      /\bbachelor/i,
      /\bmaster/i,
      /\bphd\b/i,
      /\buniversity\b/i,
      /\bcollege\b/i,
    ],
  },
  {
    section: "Projects",
    jdPatterns: [
      /\bproject/i,
      /\bportfolio\b/i,
    ],
    resumePatterns: [
      /\bproject/i,
      /\bportfolio\b/i,
    ],
  },
  {
    section: "Certifications",
    jdPatterns: [
      /\bcertificat/i,
      /\baccreditat/i,
      /\blicens/i,
    ],
    resumePatterns: [
      /\bcertificat/i,
      /\baccreditat/i,
      /\blicens/i,
    ],
  },
  {
    section: "Soft Skills",
    jdPatterns: [
      /\bcommunicat/i,
      /\bleadership\b/i,
      /\bteamwork\b/i,
      /\bcollaborat/i,
      /\binterpersonal\b/i,
      /\bproblem.?solving\b/i,
    ],
    resumePatterns: [
      /\bcommunicat/i,
      /\bleadership\b/i,
      /\bteamwork\b/i,
      /\bcollaborat/i,
      /\binterpersonal\b/i,
      /\bproblem.?solving\b/i,
    ],
  },
];

/**
 * Detect which sections the JD cares about and whether the resume covers them.
 */
function detectSections(resumeText: string, jdText: string): SectionCheck[] {
  const checks: SectionCheck[] = [];

  for (const sp of SECTION_PATTERNS) {
    const jdMentions = sp.jdPatterns.some((p) => p.test(jdText));
    if (!jdMentions) continue; // JD doesn't care about this section

    const resumeHas = sp.resumePatterns.some((p) => p.test(resumeText));

    // Determine relevance by how many JD patterns match
    const jdMatchCount = sp.jdPatterns.filter((p) => p.test(jdText)).length;
    let relevance: SectionCheck["relevance"] = "low";
    if (jdMatchCount >= 3) relevance = "high";
    else if (jdMatchCount >= 2) relevance = "medium";

    checks.push({
      section: sp.section,
      found: resumeHas,
      relevance,
    });
  }

  return checks;
}

/**
 * Get a qualitative label for a numeric score.
 */
function getScoreLabel(score: number): MatchResult["label"] {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Strong";
  if (score >= 40) return "Moderate";
  return "Weak";
}

/**
 * Build a human-readable explanation of how the score was computed.
 */
function buildExplanation(stats: MatchStats, label: string): string {
  const pct = stats.totalJdTokens > 0
    ? Math.round((stats.matchedCount / stats.totalJdTokens) * 100)
    : 0;

  const parts: string[] = [
    `We extracted ${stats.totalJdTokens} meaningful keyword${stats.totalJdTokens !== 1 ? "s" : ""} from the job description.`,
    `Your resume matched ${stats.matchedCount} of them (${pct}% keyword coverage).`,
    `${stats.missedCount} keyword${stats.missedCount !== 1 ? "s" : ""} from the JD ${stats.missedCount !== 1 ? "were" : "was"} not found in your resume.`,
    ``,
    `The final score uses weighted scoring — technical skills and tools count more heavily than general terms.`,
    `Your weighted score: ${stats.totalWeightedScore.toFixed(1)} out of ${stats.maxWeightedScore.toFixed(1)} possible points.`,
    ``,
    `Overall assessment: ${label}.`,
  ];

  return parts.join("\n");
}

// ── Main analysis function ───────────────────────────────────

/**
 * Analyze how well a resume matches a job description.
 *
 * @param resumeText - Raw resume text (pasted by user)
 * @param jdText     - Raw job description text (pasted by user)
 * @returns MatchResult with score, covered/missing tokens, section checklist, and explanation
 */
export function analyzeMatch(resumeText: string, jdText: string): MatchResult {
  // 1. Extract tokens from both inputs
  const jdTokens = extractTokens(jdText);
  const resumeTokens = extractTokens(resumeText);

  // 2. Create a lookup set from the resume tokens for fast matching
  const resumeLookup = tokenLookupSet(resumeTokens);

  // 3. Classify each JD token as covered or missing
  const coveredTokens: Token[] = [];
  const missingTokens: Token[] = [];

  for (const jdToken of jdTokens) {
    if (resumeLookup.has(jdToken.normalized)) {
      coveredTokens.push(jdToken);
    } else {
      missingTokens.push(jdToken);
    }
  }

  // 4. Compute weighted score
  const maxWeightedScore = jdTokens.reduce((sum, t) => sum + t.weight, 0);
  const totalWeightedScore = coveredTokens.reduce((sum, t) => sum + t.weight, 0);

  const score = maxWeightedScore > 0
    ? Math.round((totalWeightedScore / maxWeightedScore) * 100)
    : 0;

  // 5. Section checklist
  const sectionChecklist = detectSections(resumeText, jdText);

  // 6. Stats and explanation
  const label = getScoreLabel(score);
  const stats: MatchStats = {
    totalJdTokens: jdTokens.length,
    matchedCount: coveredTokens.length,
    missedCount: missingTokens.length,
    totalWeightedScore,
    maxWeightedScore,
  };
  const explanation = buildExplanation(stats, label);

  // 7. Sort: high-weight tokens first within each list
  coveredTokens.sort((a, b) => b.weight - a.weight);
  missingTokens.sort((a, b) => b.weight - a.weight);

  return {
    score,
    label,
    coveredTokens,
    missingTokens,
    sectionChecklist,
    explanation,
    stats,
  };
}
