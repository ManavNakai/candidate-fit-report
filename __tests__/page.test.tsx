import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../app/page";

vi.mock("../lib/matcher", () => ({
  analyzeMatch: () => ({
    score: 78,
    label: "Strong",
    coveredTokens: [],
    missingTokens: [],
    sectionChecklist: [],
    explanation: "Mocked explanation",
    stats: {
      totalJdTokens: 10,
      matchedCount: 8,
      missedCount: 2,
      totalWeightedScore: 8,
      maxWeightedScore: 10,
    },
    usedRoleFallback: true,
    detectedRoleType: "tech",
  }),
}));

describe("Home page", () => {
  it("enables Analyze Match when both inputs are filled", () => {
    render(<Home />);

    const textareas = screen.getAllByRole("textbox");
    const button = screen.getByRole("button", { name: /analyze match/i });

    expect(button).toBeDisabled();

    fireEvent.change(textareas[0], { target: { value: "React TypeScript" } });
    fireEvent.change(textareas[1], {
      target: { value: "Need React TypeScript" },
    });

    expect(button).not.toBeDisabled();
  });
});
