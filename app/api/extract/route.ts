import { NextResponse } from "next/server";

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
      try {
        const { createWorker } = await import("tesseract.js");

        const worker = await createWorker("eng", 1, {
          workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js",
        });

        const ocr = await worker.recognize(buffer);
        await worker.terminate();

        text= ocr.data.text || "";
      } catch (ocrError) {
        console.error("OCR error:", ocrError);
        return NextResponse.json(
          { error: "OCR failed while reading the image." },
          { status: 500 }
        );
      }
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
