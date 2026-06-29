// ============================================================
// Types for the Candidate Fit Report
// ============================================================

/** A single meaningful token extracted from text. */
export interface Token {
  /** The original word/phrase as it appeared. */
  raw: string;
  /** Lowercased, trimmed form used for comparison. */
  normalized: string;
  /** Semantic category for weighting. */
  category: TokenCategory;
  /** Numeric weight used in scoring (higher = more important). */
  weight: number;
}

export type TokenCategory =
  | "programming_language"
  | "framework"
  | "tool"
  | "cloud"
  | "database"
  | "methodology"
  | "soft_skill"
  | "role"
  | "education"
  | "certification"
  | "general"
  | "customer_success"
  | "account_management"
  | "sales"
  | "marketing"
  | "operations"
  | "recruiting"
  | "business_analysis";

/** A resume-section check (e.g. "Does the resume cover Education?"). */
export interface SectionCheck {
  /** Human-readable section name. */
  section: CanonicalSection;
  /** Whether a match was found in the resume. */
  found: boolean;
  /** How strongly the JD emphasises this section. */
  relevance: "high" | "medium" | "low";
}

/** The full result object returned by `analyzeMatch()`. */
export interface MatchResult {
  /** Overall match score, 0–100. */
  score: number;
  /** Qualitative label derived from the score. */
  label: "Weak" | "Moderate" | "Strong" | "Excellent";
  /** JD tokens that appear in the resume. */
  coveredTokens: Token[];
  /** JD tokens that are missing from the resume. */
  missingTokens: Token[];
  /** Section-level checklist. */
  sectionChecklist: SectionCheck[];
  /** Human-readable explanation of the score. */
  explanation: string;
  /** Raw stats for the explanation panel. */
  stats: MatchStats;
  /** Whether role fallback was used. */
  usedRoleFallback: boolean;
  /** Detected role type. */
  detectedRoleType: "tech" | "non-tech";
}

export interface MatchStats {
  totalJdTokens: number;
  matchedCount: number;
  missedCount: number;
  totalWeightedScore: number;
  maxWeightedScore: number;
}


export type CanonicalSection =
  | "Summary"
  | "Skills"
  | "Experience"
  | "Projects"
  | "Leadership"
  | "Education"
  | "Certifications"
  | "Achievements"
  | "Volunteer";
