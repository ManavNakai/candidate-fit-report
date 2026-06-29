// app/api/extract/route.ts
import { NextResponse } from "next/server";

const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Ensure Node.js runtime (needed for pdf-parse / Buffer)
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Please choose a file to upload." },
        { status: 400 }
      );
    }

    // Only handle PDFs on the server.
    // Images are handled via client-side OCR (Tesseract) in the browser.
    if (file.type !== "application/pdf") {
      if (file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            error:
              "Image files are processed in your browser. If extraction fails, try a smaller/clearer image or paste the text manually.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload a PDF, image, or plain text file.",
        },
        { status: 400 }
      );
    }

    // Size limit for PDFs to keep the function fast and avoid timeouts
    if (file.size > MAX_PDF_SIZE_BYTES) {
      return NextResponse.json(
        {
          error:
            "This PDF is too large. Please upload a smaller PDF (under 5 MB) or paste the text manually.",
        },
        { status: 413 } // Payload Too Large
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const pdfParse = (await import("pdf-parse")).default;
    const pdfData = await pdfParse(buffer);
    const text = (pdfData.text || "").trim();

    if (!text) {
      return NextResponse.json(
        {
          error:
            "Could not find readable text in this PDF. If it's a scanned document, try uploading it as an image (for browser OCR) or paste the text manually.",
        },
        { status: 422 } // Unprocessable Entity
      );
    }

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Extraction error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to extract text from file.";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}