import { NextResponse } from "next/server";
//import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";
    
    if (file.type === "application/pdf") {
      // Parse PDF
      const pdfParse = (await import("pdf-parse")).default;
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (file.type.startsWith("image/")) {
      // Parse Image via OCR
      // Tesseract.recognize takes a buffer in Node.js
      const { data } = await Tesseract.recognize(buffer, "eng");
      text = data.text;
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF or Image." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Extraction error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to extract text from file";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
