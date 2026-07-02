// ============================================================
// Matcher — core scoring engine
// ============================================================

import type {
  MatchResult,
  MatchStats,
  SectionCheck,
  Token,
  CanonicalSection,
} from "./types";
import { extractTokens, tokenLookupSet } from "./tokenizer";

// ── Section detection patterns ───────────────────────────────

type RoleType = "tech" | "non-tech";

interface SectionPattern {
  section: CanonicalSection;
  jdPatterns: RegExp[];
}

const TECH_CHECKLIST: CanonicalSection[] = [
  "Summary",
  "Skills",
  "Experience",
  "Education",
  "Projects",
  "Certifications",
  "Achievements",
  "Leadership",
  "Volunteer",
];

const NON_TECH_CHECKLIST: CanonicalSection[] = [
  "Summary",
  "Skills",
  "Experience",
  "Education",
  "Projects",
  "Certifications",
  "Achievements",
  "Leadership",
  "Volunteer",
];

const FALLBACK_PRIORITY_TECH: Record<
  CanonicalSection,
  SectionCheck["relevance"]
> = {
  Summary: "high",
  Skills: "high",
  Experience: "high",
  Education: "medium",
  Projects: "high",
  Certifications: "medium",
  Achievements: "medium",
  Leadership: "medium",
  Volunteer: "low",
};

const FALLBACK_PRIORITY_NON_TECH: Record<
  CanonicalSection,
  SectionCheck["relevance"]
> = {
  Summary: "high",
  Skills: "high",
  Experience: "high",
  Education: "medium",
  Projects: "low",
  Certifications: "medium",
  Achievements: "medium",
  Leadership: "high",
  Volunteer: "medium",
};

function getFallbackRelevance(
  roleType: RoleType,
  section: CanonicalSection,
): SectionCheck["relevance"] {
  const map =
    roleType === "tech" ? FALLBACK_PRIORITY_TECH : FALLBACK_PRIORITY_NON_TECH;
  return map[section] ?? "low";
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeHeadingText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s&/:-]/g, "")
    .trim();
}

function hasSectionHeading(text: string, variants: string[]) {
  const normalizedText = text
    .split(/\r?\n/)
    .map((line) => normalizeHeadingText(line))
    .join("\n");

  return variants.some((variant) => {
    const v = normalizeHeadingText(variant);

    const patterns = [
      new RegExp(`(^|\\n)\\s*${escapeRegExp(v)}\\s*($|\\n)`, "i"),
      new RegExp(`(^|\\n)\\s*${escapeRegExp(v)}\\s*[:|-]`, "i"),
    ];

    return patterns.some((pattern) => pattern.test(normalizedText));
  });
}

const SECTION_PATTERNS: SectionPattern[] = [
  {
    section: "Summary",
    jdPatterns: [
      /^\s*(summary|brief summary|profile|profile summary|professional profile|professional summary|career summary|career objective|overview)\s*:?$/im,
      /\bprofessional summary\b/i,
      /\bcandidate profile\b/i,
    ],
  },
  {
    section: "Skills",
    jdPatterns: [
      /\b(technical|tech)\s+skills?\b/i,
      /\brequired\s+skills?\b/i,
      /\bpreferred\s+skills?\b/i,
      /\bmust[-\s]?have\b/i,
      /\btechnologies?\b/i,
      /\btech\s+stack\b/i,
      /\bprogramming\b/i,
      /\bframeworks?\b/i,
      /\btools?\b/i,
      /\blanguages?\b/i,
      /\bskills?\b/i,
      /\bcore\s+skills?\b/i,
      /\bkey\s+skills?\b/i,
      /\bkey expertise\b/i,
      /\bcompetencies\b/i,
      /\bfunctional\s+skills?\b/i,
      /\brequirements?\b/i,
      /\bqualifications?\b/i,
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
      /\bprior experience\b/i,
      /\bindustry experience\b/i,
    ],
  },
  {
    section: "Education",
    jdPatterns: [
      /\beducation\b/i,
      /\bacademic background\b/i,
      /\bdegree\b/i,
      /\bbachelor/i,
      /\bmaster/i,
      /\bphd\b/i,
      /\buniversity\b/i,
      /\bcollege\b/i,
      /\bqualifications?\b/i,
    ],
  },
  {
    section: "Projects",
    jdPatterns: [
      /\bprojects?\b/i,
      /\bportfolio\b/i,
      /\bgithub\b/i,
      /\bcase\s+stud/i,
      /\bwork\s+samples?\b/i,
      /\bproject experience\b/i,
    ],
  },
  {
    section: "Certifications",
    jdPatterns: [
      /\bcertificat/i,
      /\baccreditat/i,
      /\blicens/i,
      /\bcredential/i,
      /\bcertified\b/i,
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
      /\bproven track record\b/i,
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
      /\bmentor(?:ed|ship)?\b/i,
      /\bstakeholder management\b/i,
      /\bteam management\b/i,
      /\bpositions?\s+of\s+responsibility\b/i,
    ],
  },
  {
    section: "Volunteer",
    jdPatterns: [
      /\bvolunteer/i,
      /\bcommunity\b/i,
      /\bsocial\s+impact\b/i,
      /\bngo\b/i,
      /\bnon[-\s]?profit\b/i,
      /\bcommunity involvement\b/i,
    ],
  },
];

const SECTION_ALIASES: Record<CanonicalSection, string[]> = {
  Summary: [
    "summary",
    "brief summary",
    "profile summary",
    "professional summary",
    "career summary",
    "career objective",
    "objective",
    "profile",
    "about me",
    "overview",
  ],

  Skills: [
    "skills",
    "technical skills",
    "required skills",
    "core skills",
    "key skills",
    "skills summary",
    "competencies",
    "technical competencies",
    "tech stack",
    "tools and workflow",
    "programming languages",
    "key expertise",
  ],

  Experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
    "internship",
    "internships",
    "relevant experience",
  ],

  Education: ["education", "academic background", "qualifications"],

  Projects: [
    "projects",
    "project experience",
    "personal projects",
    "academic projects",
    "relevant projects",
    "portfolio",
    "projects / portfolio",
    "work samples",
  ],

  Certifications: [
    "certifications",
    "certification",
    "certificates",
    "courses",
    "licenses",
    "accreditations",
    "assessments / certifications",
    "assessments and certifications",
    "assessment / certification",
    "assessment",
    "assessments",
  ],

  Achievements: [
    "achievements",
    "achievement",
    "awards",
    "honors",
    "honours",
    "accomplishments",
    "recognition",
  ],

  Leadership: [
    "leadership",
    "leadership experience",
    "positions of responsibility",
    "position of responsibility",
    "positions & responsibilities",
    "responsibility",
    "responsibilities",
    "extracurricular leadership",
    "campus leadership",
  ],

  Volunteer: [
    "volunteer",
    "volunteering",
    "volunteer experience",
    "volunteering experience",
    "community involvement",
    "community work",
    "social impact",
    "extracurricular activities",
    "extracurricular activities / volunteering",
    "extracurricular / volunteering",
    "extra-curricular activities",
    "extra-curricular activities / volunteering",
    "extra-curricular / volunteering",
    "extracurricular",
    "extra-curricular",
    "community service",
  ],
};

const SECTION_SYNONYMS: Record<CanonicalSection, string[]> = SECTION_ALIASES;

function buildHeadingPattern(aliases: string[]): RegExp {
  const source = aliases.map(escapeRegExp).join("|");
  return new RegExp(`^\\s*(${source})\\s*:?$`, "im");
}

const EXPLICIT_RESUME_SECTION_HEADING_PATTERNS: RegExp[] = [
  buildHeadingPattern(SECTION_ALIASES.Summary),
  buildHeadingPattern(SECTION_ALIASES.Education),
  buildHeadingPattern(SECTION_ALIASES.Experience),
  buildHeadingPattern(SECTION_ALIASES.Skills),
  buildHeadingPattern(SECTION_ALIASES.Certifications),
  buildHeadingPattern(SECTION_ALIASES.Projects),
  buildHeadingPattern(SECTION_ALIASES.Leadership),
  buildHeadingPattern(SECTION_ALIASES.Achievements),
  buildHeadingPattern(SECTION_ALIASES.Volunteer),
];

function hasExplicitJdSectionSignals(jdText: string): boolean {
  const headingMatches = EXPLICIT_RESUME_SECTION_HEADING_PATTERNS.filter(
    (pattern) => pattern.test(jdText),
  ).length;

  return headingMatches >= 2;
}

const EXPLICIT_JD_TO_CHECKLIST_MAP: Record<CanonicalSection, RegExp[]> = {
  Summary: [buildHeadingPattern(SECTION_ALIASES.Summary)],
  Skills: [buildHeadingPattern(SECTION_ALIASES.Skills)],
  Experience: [buildHeadingPattern(SECTION_ALIASES.Experience)],
  Projects: [buildHeadingPattern(SECTION_ALIASES.Projects)],
  Leadership: [buildHeadingPattern(SECTION_ALIASES.Leadership)],
  Education: [buildHeadingPattern(SECTION_ALIASES.Education)],
  Certifications: [buildHeadingPattern(SECTION_ALIASES.Certifications)],
  Achievements: [buildHeadingPattern(SECTION_ALIASES.Achievements)],
  Volunteer: [buildHeadingPattern(SECTION_ALIASES.Volunteer)],
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

function getChecklistForRole(roleType: RoleType): readonly CanonicalSection[] {
  return roleType === "tech" ? TECH_CHECKLIST : NON_TECH_CHECKLIST;
}

function getSectionPattern(
  section: CanonicalSection,
): SectionPattern | undefined {
  return SECTION_PATTERNS.find((sp) => sp.section === section);
}

function getExplicitChecklistFromJd(jdText: string): CanonicalSection[] {
  const baseSections: CanonicalSection[] = [
    "Skills",
    "Experience",
    "Education",
    "Projects",
    "Certifications",
    "Summary",
    "Leadership",
    "Achievements",
    "Volunteer",
  ];

  return baseSections.filter((section) => {
    const patterns = EXPLICIT_JD_TO_CHECKLIST_MAP[section];
    return patterns.some((pattern) => pattern.test(jdText));
  });
}

/**
 * Detect which sections the JD cares about and whether the resume covers them.
 * If the JD has no explicit section headings, use role-based fallback expectations.
 */
function detectSections(
  resumeText: string,
  jdText: string,
): {
  checks: SectionCheck[];
  usedRoleFallback: boolean;
  detectedRoleType: RoleType;
} {
  const roleType = inferRoleType(jdText, resumeText);
  const fallbackChecklist = getChecklistForRole(roleType);

  const jdHasExplicitSectionSignals = hasExplicitJdSectionSignals(jdText);

  const checklist = jdHasExplicitSectionSignals
    ? getExplicitChecklistFromJd(jdText)
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

    const jdMatchCount = pattern.jdPatterns.filter((p) =>
      p.test(jdText),
    ).length;
    const resumeHas = hasSectionHeading(
      resumeText,
      SECTION_SYNONYMS[section] ?? [section],
    );

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
  const pct =
    stats.totalJdTokens > 0
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
  const coveredByConcept = new Map<string, Token>();
  const missingByConcept = new Map<string, Token>();

  let matchedCountRaw = 0;
  let missedCountRaw = 0;

  for (const jdToken of jdTokens) {
    const key = jdToken.conceptKey ?? jdToken.normalized;

    if (resumeLookup.has(key)) {
      matchedCountRaw++;

      // Concept is present in the resume; keep the strongest representation
      const existing = coveredByConcept.get(key);
      if (!existing || jdToken.weight > existing.weight) {
        coveredByConcept.set(key, jdToken);
      }
    } else {
      missedCountRaw++;

      // Concept is missing; again keep the strongest JD token for display
      const existing = missingByConcept.get(key);
      if (!existing || jdToken.weight > existing.weight) {
        missingByConcept.set(key, jdToken);
      }
    }
  }

  const coveredTokens: Token[] = Array.from(coveredByConcept.values());
  const missingTokens: Token[] = Array.from(missingByConcept.values());

  // 4. Compute weighted score (concept-level, as before)
  const maxWeightedScore = coveredTokens
    .concat(missingTokens)
    .reduce((sum, t) => sum + t.weight, 0);
  const totalWeightedScore = coveredTokens.reduce(
    (sum, t) => sum + t.weight,
    0,
  );

  const score =
    maxWeightedScore > 0
      ? Math.round((totalWeightedScore / maxWeightedScore) * 100)
      : 0;

  // 5. Section checklist
  const {
    checks: sectionChecklist,
    usedRoleFallback,
    detectedRoleType,
  } = detectSections(resumeText, jdText);

  // 6. Stats and explanation (raw-token counts)
  const label = getScoreLabel(score);
  const stats: MatchStats = {
    totalJdTokens: jdTokens.length,
    matchedCount: matchedCountRaw,
    missedCount: missedCountRaw,
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
