import { describe, it, expect } from "vitest";
import { analyzeMatch } from "../lib/matcher";

describe("Matcher", () => {
  it("scores 100 when resume perfectly matches JD", () => {
    const jd =
      "Looking for a software engineer with React, TypeScript, and AWS experience.";
    const resume =
      "Software engineer with experience in React, TypeScript, and AWS.";

    const result = analyzeMatch(resume, jd);

    expect(result.score).toBe(100);
    expect(result.missingTokens.length).toBe(0);
    expect(result.coveredTokens.length).toBeGreaterThan(0);
    expect(result.label).toBe("Excellent");
  });

  it("scores 0 when there is no overlap", () => {
    const jd =
      "Looking for a Data Scientist with Python, Machine Learning, and Pandas.";
    const resume =
      "Chef with experience in cooking, baking, and managing kitchens.";

    const result = analyzeMatch(resume, jd);

    expect(result.score).toBe(0);
    expect(result.coveredTokens.length).toBe(0);
    expect(result.label).toBe("Weak");
  });

  it("identifies missing and covered tokens correctly", () => {
    const jd = "Require React, TypeScript, Node.js, and Docker.";
    const resume = "Experience with React and Node.js.";

    const result = analyzeMatch(resume, jd);

    const covered = result.coveredTokens.map(
      (t) => t.conceptKey ?? t.normalized,
    );
    const missing = result.missingTokens.map(
      (t) => t.conceptKey ?? t.normalized,
    );

    expect(covered).toContain("react.js");
    expect(covered).toContain("node.js");
    expect(covered).not.toContain("typescript");
    expect(covered).not.toContain("docker");

    expect(missing).toContain("typescript");
    expect(missing).toContain("docker");
    expect(missing).not.toContain("react.js");
  });

  it("deduplicates synonym variants into one covered concept", () => {
    const jd = "Need React, ReactJS, and React.js experience.";
    const resume = "Built production apps with React.";

    const result = analyzeMatch(resume, jd);
    const reactCovered = result.coveredTokens.filter(
      (t) => (t.conceptKey ?? t.normalized) === "react.js",
    );

    expect(reactCovered).toHaveLength(1);
    expect(result.missingTokens).toHaveLength(0);
    expect(result.stats.matchedCount).toBe(3);
    expect(result.coveredTokens.length).toBeLessThan(result.stats.matchedCount);
  });

  it("uses tech fallback checklist when JD does not specify explicit resume headings", () => {
    const jd =
      "We are hiring a frontend developer with React, TypeScript, APIs, and cloud exposure.";
    const resume =
      "Technical Skills: React, TypeScript\nEducation: B.Tech\nProjects: Dashboard app";

    const result = analyzeMatch(resume, jd);

    expect(result.usedRoleFallback).toBe(true);
    expect(result.detectedRoleType).toBe("tech");

    const skills = result.sectionChecklist.find((s) => s.section === "Skills");
    const projects = result.sectionChecklist.find(
      (s) => s.section === "Projects",
    );
    const education = result.sectionChecklist.find(
      (s) => s.section === "Education",
    );

    expect(skills).toBeDefined();
    expect(skills?.found).toBe(true);
    expect(projects).toBeDefined();
    expect(projects?.found).toBe(true);
    expect(education?.found).toBe(true);
  });

  it("uses non-tech fallback checklist for non-technical roles", () => {
    const jd =
      "We are hiring a marketing operations associate with campaign management, reporting, and stakeholder coordination.";
    const resume =
      "Core Skills: campaign planning, communication\nExperience: managed reports and stakeholders";

    const result = analyzeMatch(resume, jd);

    expect(result.usedRoleFallback).toBe(true);
    expect(result.detectedRoleType).toBe("non-tech");

    const skillsSection = result.sectionChecklist.find(
      (s) => s.section === "Skills",
    );
    expect(skillsSection).toBeDefined();
    expect(skillsSection?.found).toBe(true);
  });

  it("uses explicit JD section headings instead of fallback when present", () => {
    const jd = `
Skills:
Experience:
Education:
Certifications:
Projects:
`;

    const resume = `
Skills: React, TypeScript
Education: B.Tech in Computer Science
Projects: Resume matcher
`;

    const result = analyzeMatch(resume, jd);

    expect(result.usedRoleFallback).toBe(false);

    const experience = result.sectionChecklist.find(
      (s) => s.section === "Experience",
    );
    const certifications = result.sectionChecklist.find(
      (s) => s.section === "Certifications",
    );
    const projects = result.sectionChecklist.find(
      (s) => s.section === "Projects",
    );

    expect(experience).toBeDefined();
    expect(experience?.found).toBe(false);
    expect(certifications).toBeDefined();
    expect(certifications?.found).toBe(false);
    expect(projects?.found).toBe(true);
  });

  it("keeps raw stats separate from concept-level token display", () => {
    const jd = "React ReactJS React.js Docker Docker Compose AWS";
    const resume = "React AWS";

    const result = analyzeMatch(resume, jd);

    expect(result.stats.totalJdTokens).toBeGreaterThan(0);
    expect(result.stats.matchedCount).toBe(4);
    expect(result.stats.missedCount).toBe(2);
    expect(result.coveredTokens.length).toBe(2);
    expect(result.missingTokens.length).toBe(1);
    expect(result.stats.matchedCount).toBeGreaterThan(
      result.coveredTokens.length,
    );
    expect(result.stats.missedCount).toBeGreaterThan(
      result.missingTokens.length,
    );
    expect(result.explanation).toContain("We extracted");
    expect(result.explanation).toContain("Your weighted score:");
    expect(result.explanation).toContain("Overall assessment:");
  });

  it("maps Profile Summary to Summary", () => {
    const jd = "Summary and education are required.";
    const resume =
      "Profile Summary:\nFrontend developer\nEducation:\nB.E. in CSE";

    const result = analyzeMatch(resume, jd);

    expect(
      result.sectionChecklist.find((s) => s.section === "Summary")?.found,
    ).toBe(true);
    expect(
      result.sectionChecklist.find((s) => s.section === "Education")?.found,
    ).toBe(true);
  });

  it("maps Technical Skills to Skills", () => {
    const jd = "Technical skills are required.";
    const resume = "Technical Skills:\nReact, TypeScript, Next.js";

    const result = analyzeMatch(resume, jd);

    expect(
      result.sectionChecklist.find((s) => s.section === "Skills")?.found,
    ).toBe(true);
  });

  it("maps Position of Responsibility to Leadership", () => {
    const jd = "Leadership experience is preferred.";
    const resume = "Position of Responsibility:\nIEEE Chairperson";

    const result = analyzeMatch(resume, jd);

    expect(
      result.sectionChecklist.find((s) => s.section === "Leadership")?.found,
    ).toBe(true);
  });

  it("does not treat body text as an Experience heading", () => {
    const jd = "Experience is required.";
    const resume =
      "Built several projects with experience in React and Node.js.";

    const result = analyzeMatch(resume, jd);

    expect(
      result.sectionChecklist.find((s) => s.section === "Experience")?.found,
    ).toBe(false);
  });
});
