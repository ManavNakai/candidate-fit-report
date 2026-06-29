import { test, expect } from "@playwright/test";

test("analyze flow works end to end", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.getByLabel(/paste your resume/i).fill("React TypeScript Node.js AWS");
  await page.getByLabel(/paste the job description/i).fill(
    "Looking for React TypeScript Node.js AWS"
  );

  const analyzeButton = page.getByRole("button", { name: /analyze match/i });

  await expect(analyzeButton).toBeEnabled();
  await analyzeButton.click();

  await expect(
    page.getByText(/excellent match|strong match|moderate match|weak match/i).first()
  ).toBeVisible();
});