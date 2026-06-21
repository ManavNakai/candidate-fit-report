// ============================================================
// Matcher — core scoring engine
// ============================================================

import type { MatchResult, MatchStats, SectionCheck, Token } from "./types";
import { extractTokens, tokenLookupSet } from "./tokenizer";

// ── Section detection patterns ───────────────────────────────

interface SectionPattern {
  section: string;
  jdPatterns: RegExp[];
  resumePatterns: RegExp[];
}

type RoleType = "tech" | "non-tech";

const TECH_CHECKLIST = [
  "Summary",
  "Skills",
  "Experience",
  "Education",
  "Projects",
  "Certifications",
  "Achievements",
  "Leadership",
  "Volunteer Experience",
] as const;

const FALLBACK_PRIORITY_TECH: Record<string, SectionCheck["relevance"]> = {
  Summary: "high",
  Skills: "high",
  Experience: "high",
  Education: "medium",
  Projects: "high",          // tech: projects are strong proof of skill
  Certifications: "medium",    // tech: certs matter more than in non-tech
  Achievements: "medium",
  Leadership: "medium",
  "Volunteer Experience": "low",
};

const NON_TECH_CHECKLIST = [
  "Summary",
  "Core Skills",
  "Experience",
  "Education",
  "Certifications",
  "Achievements",
  "Leadership",
  "Volunteer Experience",
  "Projects / Portfolio",
] as const;

const FALLBACK_PRIORITY_NON_TECH: Record<string, SectionCheck["relevance"]> = {
  Summary: "high",
  "Core Skills": "high",      // soft skills / core competencies
  Experience: "high",
  Education: "medium",
  Certifications: "low",
  Achievements: "medium",
  Leadership: "high",       // non-tech: leadership/soft skills matter more
  "Volunteer Experience": "medium",
  "Projects / Portfolio": "low", // non-tech: portfolio is nice-to-have
};

function getFallbackRelevance(
  roleType: RoleType,
  section: string
): SectionCheck["relevance"] {
  const map =
    roleType === "tech" ? FALLBACK_PRIORITY_TECH : FALLBACK_PRIORITY_NON_TECH;
  return map[section] ?? "low";
}

const SECTION_PATTERNS: SectionPattern[] = [
  {
    section: "Summary",
    jdPatterns: [
      /^\s*(summary|profile|professional summary|career objective)\s*:?$/im,
    ],
    resumePatterns: [
      /\bsummary\b/i,
      /\bprofessional\s+summary\b/i,
      /\bprofile\b/i,
      /\bcareer\s+objective\b/i,
      /\bobjective\b/i,
      /\boverview\b/i,
    ],
  },
  {
    section: "Skills",
    jdPatterns: [
      /\b(technical|tech)\s+skills?\b/i,
      /\brequired\s+skills?\b/i,
      /\btechnologies?\b/i,
      /\btech\s+stack\b/i,
      /\bprogramming\b/i,
      /\bframeworks?\b/i,
      /\btools?\b/i,
      /\blanguages?\b/i,
      /\bskills?\b/i,
    ],
    resumePatterns: [
      /\btechnical\s+skills?\b/i,
      /\bskills?\b/i,
      /\btechnologies?\b/i,
      /\btech\s+stack\b/i,
      /\bprogramming\b/i,
      /\bproficienc/i,
      /\btools?\b/i,
      /\blanguages?\b/i,
    ],
  },
  {
    section: "Core Skills",
    jdPatterns: [
      /\bcore\s+skills?\b/i,
      /\bkey\s+skills?\b/i,
      /\bcompetencies\b/i,
      /\bfunctional\s+skills?\b/i,
      /\bskills?\b/i,
    ],
    resumePatterns: [
      /\bcore\s+skills?\b/i,
      /\bkey\s+skills?\b/i,
      /\bcompetencies\b/i,
      /\bskills?\b/i,
    ],
  },
  {
    section: "Experience",
    jdPatterns: [
      /\bexperience\b/i,
      /\byears?\s+(of\s+)?experience\b/i,
      /\bwork\s+history\b/i,
      /\bprofessional\s+experience\b/i,
      /\bemployment\b/i,
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
      /\bprojects?\b/i,
      /\bportfolio\b/i,
      /\bgithub\b/i,
      /\bcase\s+stud/i,
    ],
    resumePatterns: [
      /\bprojects?\b/i,
      /\bportfolio\b/i,
      /\bgithub\b/i,
      /\bcase\s+stud/i,
    ],
  },
  {
    section: "Projects / Portfolio",
    jdPatterns: [
      /\bprojects?\b/i,
      /\bportfolio\b/i,
      /\bwork\s+samples?\b/i,
      /\bcase\s+stud/i,
    ],
    resumePatterns: [
      /\bprojects?\b/i,
      /\bportfolio\b/i,
      /\bwork\s+samples?\b/i,
      /\bcase\s+stud/i,
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
    section: "Achievements",
    jdPatterns: [
      /\bachievement/i,
      /\baward/i,
      /\bhonou?r/i,
      /\brecognition\b/i,
      /\baccomplishment/i,
    ],
    resumePatterns: [
      /\bachievement/i,
      /\baward/i,
      /\bhonou?r/i,
      /\brecognition\b/i,
      /\baccomplishment/i,
    ],
  },
  {
    section: "Leadership",
    jdPatterns: [
      /\bleadership\b/i,
      /\bteam\s+lead\b/i,
      /\bled\b/i,
      /\bowner(ship)?\b/i,
      /\bmentorship\b/i,
      /\bpositions?\s+of\s+responsibility\b/i,
    ],
    resumePatterns: [
      /\bleadership\b/i,
      /\bteam\s+lead\b/i,
      /\bled\b/i,
      /\bowner(ship)?\b/i,
      /\bmentorship\b/i,
      /\bpositions?\s+of\s+responsibility\b/i,
      /\bextracurricular/i,
    ],
  },
  {
    section: "Volunteer Experience",
    jdPatterns: [
      /\bvolunteer/i,
      /\bcommunity\b/i,
      /\bsocial\s+impact\b/i,
      /\bngo\b/i,
    ],
    resumePatterns: [
      /\bvolunteer/i,
      /\bcommunity\b/i,
      /\bsocial\s+impact\b/i,
      /\bngo\b/i,
    ],
  },
];

const EXPLICIT_RESUME_SECTION_HEADING_PATTERNS: RegExp[] = [
  /^\s*(education|academic background)\s*:?$/im,
  /^\s*(experience|work experience|professional experience)\s*:?$/im,
  /^\s*(skills|technical skills|required skills|core skills)\s*:?$/im,
  /^\s*(certifications|licenses|accreditations)\s*:?$/im,
  /^\s*(projects|project experience|portfolio)\s*:?$/im,
];

function hasExplicitResumeSectionPreferences(jdText: string): boolean {
  const headingMatches = EXPLICIT_RESUME_SECTION_HEADING_PATTERNS.filter((pattern) =>
    pattern.test(jdText)
  ).length;

  return headingMatches >= 2;
}

const EXPLICIT_JD_TO_CHECKLIST_MAP: Record<string, RegExp[]> = {
  Summary: [/^\s*(summary|profile|professional summary|career objective)\s*:?$/im],
  Skills: [/^\s*(skills|technical skills|required skills|core skills)\s*:?$/im],
  "Core Skills": [/^\s*(core skills|key skills|competencies|functional skills)\s*:?$/im],
  Experience: [/^\s*(experience|work experience|professional experience)\s*:?$/im],
  Education: [/^\s*(education|academic background)\s*:?$/im],
  Projects: [/^\s*(projects|project experience|portfolio)\s*:?$/im, /^\s*(nice to have)\s*:?$/im],
  "Projects / Portfolio": [/^\s*(projects|project experience|portfolio|work samples)\s*:?$/im],
  Certifications: [/^\s*(certifications|licenses|accreditations)\s*:?$/im],
};

function inferRoleType(jdText: string, resumeText: string): RoleType {
  const primaryText = `${jdText}\n${jdText}\n${resumeText}`;

  const techSignals = [
    /\bsoftware\b/i,
    /\bdeveloper\b/i,
    /\bengineer\b/i,
    /\bfrontend\b/i,
    /\bbackend\b/i,
    /\bfull[\s-]?stack\b/i,
    /\breact\b/i,
    /\bnext\.?js\b/i,
    /\bnode\.?js\b/i,
    /\bpython\b/i,
    /\bjava\b/i,
    /\bcpp\b/i,
    /\bjavascript\b/i,
    /\btypescript\b/i,
    /\bsql\b/i,
    /\bmachine learning\b/i,
    /\bdata science\b/i,
    /\bapi\b/i,
    /\bcloud\b/i,
    /\bdevops\b/i,
    /\bkubernetes\b/i,
    /\bdocker\b/i,
  ];

  const nonTechSignals = [
    /\bsales\b/i,
    /\bmarketing\b/i,
    /\bhr\b/i,
    /\bhuman resources\b/i,
    /\brecruit/i,
    /\boperations\b/i,
    /\bfinance\b/i,
    /\baccount/i,
    /\bbusiness development\b/i,
    /\bcustomer success\b/i,
    /\bconsult/i,
    /\bcontent\b/i,
    /\bbrand\b/i,
    /\bstrategy\b/i,
    /\bpartnerships?\b/i,
  ];

  const techScore = techSignals.filter((p) => p.test(primaryText)).length;
  const nonTechScore = nonTechSignals.filter((p) => p.test(primaryText)).length;

  return techScore >= nonTechScore ? "tech" : "non-tech";
}

function getChecklistForRole(roleType: RoleType): readonly string[] {
  return roleType === "tech" ? TECH_CHECKLIST : NON_TECH_CHECKLIST;
}

function getSectionPattern(section: string): SectionPattern | undefined {
  return SECTION_PATTERNS.find((sp) => sp.section === section);
}

function getExplicitChecklistFromJd(jdText: string, roleType: RoleType): string[] {
  const baseSections =
    roleType === "tech"
      ? ["Skills", "Experience", "Education", "Projects", "Certifications", "Summary"]
      : ["Core Skills", "Experience", "Education", "Projects / Portfolio", "Certifications", "Summary"];

  return baseSections.filter((section) => {
    const patterns = EXPLICIT_JD_TO_CHECKLIST_MAP[section];
    if (!patterns) return false;

    return patterns.some((pattern) => pattern.test(jdText));
  });
}

/**
 * Detect which sections the JD cares about and whether the resume covers them.
 * If the JD has no explicit section headings, use role-based fallback expectations.
 */
function detectSections(
  resumeText: string,
  jdText: string
): {
  checks: SectionCheck[];
  usedRoleFallback: boolean;
  detectedRoleType: RoleType;
} {
  const roleType = inferRoleType(jdText, resumeText);
  const fallbackChecklist = getChecklistForRole(roleType);

  const jdHasExplicitSectionSignals = hasExplicitResumeSectionPreferences(jdText);

  const checklist = jdHasExplicitSectionSignals
  ? getExplicitChecklistFromJd(jdText, roleType)
  : fallbackChecklist;

  const checks: SectionCheck[] = checklist.map((section) => {
    const pattern = getSectionPattern(section);

    if (!pattern) {
      return {
        section,
        found: false,
        relevance: "low" as const,
      };
    }

    const jdMatchCount = pattern.jdPatterns.filter((p) => p.test(jdText)).length;
    const resumeHas = pattern.resumePatterns.some((p) => p.test(resumeText));

    let relevance: SectionCheck["relevance"] = "low";

    if (jdHasExplicitSectionSignals) {
      // JD-driven mode: keep match-based relevance
      if (jdMatchCount >= 3) {
        relevance = "high";
      } else if (jdMatchCount >= 1) {
        relevance = "medium";
      } else {
        relevance = "low";
      }
    } else {
      // Fallback mode: use role-based defaults
      relevance = getFallbackRelevance(roleType, section);
    }

    return {
      section,
      found: resumeHas,
      relevance,
    };
  });

  return {
    checks,
    usedRoleFallback: !jdHasExplicitSectionSignals,
    detectedRoleType: roleType,
  };
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
    `Your resume matched ${stats.matchedCount} of them (${pct}% keyword coverage). ${stats.missedCount} keyword${stats.missedCount !== 1 ? "s" : ""} from the JD ${stats.missedCount !== 1 ? "were" : "was"} not found in your resume.`,
    ``,
    `The final score uses weighted scoring — technical skills and tools count more heavily than general terms.`,
    `Note: This score in no way represents ATS score used by companies to filter out resumes.`,
    ``,
    `Your weighted score: ${stats.totalWeightedScore.toFixed(1)} out of ${stats.maxWeightedScore.toFixed(1)} possible points.`,
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
  const {
    checks: sectionChecklist,
    usedRoleFallback,
    detectedRoleType,
  } = detectSections(resumeText, jdText);

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
    usedRoleFallback,
    detectedRoleType,
  };
}
