import { test, expect } from "@playwright/test";

test.describe("Upload error handling", () => {
  test("shows unsupported file type error without breaking UI", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await page.getByTestId("resume-file-input").setInputFiles({
      name: "resume.docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      buffer: Buffer.from("fake-docx-content"),
    });

    await expect(
      page.getByText(
        "Unsupported file type. Please upload a PDF, image, or plain text file."
      )
    ).toBeVisible();
  });

  test("shows oversized image error and does not get stuck extracting", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const oversizedBuffer = Buffer.alloc(4 * 1024 * 1024 + 10, 1);

    await page.getByTestId("resume-file-input").setInputFiles({
      name: "huge-image.jpg",
      mimeType: "image/jpeg",
      buffer: oversizedBuffer,
    });

    await expect(
      page.getByText(
        "Image is too large to process reliably. Please upload an image under 4 MB or paste the text manually."
      )
    ).toBeVisible();

    await expect(
      page.getByText("Extracting text from your file… this may take a few seconds.")
    ).not.toBeVisible();
  });

  test("shows oversized PDF error and keeps the form usable", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const oversizedPdfBuffer = Buffer.alloc(5 * 1024 * 1024 + 10, 1);

    await page.getByTestId("jd-file-input").setInputFiles({
      name: "huge-jd.pdf",
      mimeType: "application/pdf",
      buffer: oversizedPdfBuffer,
    });

    await expect(
      page.getByText(
        "This PDF is too large to process online. Please upload a PDF under 5 MB or paste the text manually."
      )
    ).toBeVisible();

    await expect(
      page.getByText("Extracting text from your file… this may take a few seconds.")
    ).not.toBeVisible();
  });
});