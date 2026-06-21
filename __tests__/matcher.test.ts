import { describe, it, expect } from "vitest";
import { analyzeMatch } from "../lib/matcher";

describe("Matcher", () => {
  it("scores 100 when resume perfectly matches JD", () => {
    const jd = "Looking for a software engineer with React, TypeScript, and AWS experience.";
    const resume = "Software engineer with experience in React, TypeScript, and AWS.";

    const result = analyzeMatch(resume, jd);

    expect(result.score).toBe(100);
    expect(result.missingTokens.length).toBe(0);
    expect(result.coveredTokens.length).toBeGreaterThan(0);
  });

  it("scores 0 when there is no overlap", () => {
    const jd = "Looking for a Data Scientist with Python, Machine Learning, and Pandas.";
    const resume = "Chef with experience in cooking, baking, and managing kitchens.";

    const result = analyzeMatch(resume, jd);

    expect(result.score).toBe(0);
    expect(result.coveredTokens.length).toBe(0);
  });

  it("identifies missing and covered tokens correctly", () => {
    const jd = "Require React, TypeScript, Node.js, and Docker.";
    const resume = "Experience with React and Node.js.";

    const result = analyzeMatch(resume, jd);

    const covered = result.coveredTokens.map((t) => t.normalized);
    const missing = result.missingTokens.map((t) => t.normalized);

    expect(covered).toContain("react");
    expect(covered).not.toContain("typescript");
    expect(covered).not.toContain("docker");

    expect(missing).toContain("typescript");
    expect(missing).toContain("docker");
    expect(missing).not.toContain("react");
  });

  it("detects sections appropriately", () => {
    const jd = "Technical skills and Education are required.";
    const resume = "Education: Bachelor's in CS. Technical Skills: React.";

    const result = analyzeMatch(resume, jd);

    const eduSection = result.sectionChecklist.find((s) => s.section === "Education");
    const skillsSection = result.sectionChecklist.find(
      (s) => s.section === "Skills" || s.section === "Core Skills"
    );
    const expSection = result.sectionChecklist.find((s) => s.section === "Experience");

    expect(eduSection).toBeDefined();
    expect(eduSection?.found).toBe(true);

    expect(skillsSection).toBeDefined();
    expect(skillsSection?.found).toBe(true);

    if (expSection) {
      expect(expSection.found).toBe(false);
    }
  });
});