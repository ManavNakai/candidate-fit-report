"use client";

import { useState, useRef } from "react";

interface TextInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: string;
  fileInputTestId?: string;
}

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB
const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024; // should match route.ts

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(
        new Error(
          "Text extraction took too long. Try a smaller/clearer file or paste the text manually.",
        ),
      );
    }, ms);

    promise
      .then((value) => {
        clearTimeout(id);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

export default function TextInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon,
  fileInputTestId,
}: TextInputProps) {
  const charCount = value.length;
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    try {
      // Plain text files – simplest path
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = (event.target?.result as string) || "";
          if (!text.trim()) {
            setUploadError(
              "This text file appears to be empty. Please paste the text manually.",
            );
            return;
          }
          onChange(text);
        };
        reader.readAsText(file);
        return;
      }

      // Images – client-side OCR
      const isImage =
        file.type.startsWith("image/") ||
        /\.(png|jpe?g|webp|bmp|gif)$/i.test(file.name);

      if (isImage) {
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          setUploadError(
            "Image is too large to process reliably. Please upload an image under 4 MB or paste the text manually.",
          );
          return;
        }

        setIsExtracting(true);

        try {
          const { createWorker } = await import("tesseract.js");

          const worker = await createWorker("eng");
          const result = await withTimeout(
            worker.recognize(file),
            10000, // 10 seconds client-side OCR timeout
          );
          await worker.terminate();

          const text = (result?.data?.text || "").trim();

          if (!text) {
            setUploadError(
              "Could not read text from this image. Try a clearer image (good lighting, sharp text) or paste the text manually.",
            );
            return;
          }

          onChange(text);
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Something went wrong while reading the image.";
          setUploadError(message);
        } finally {
          setIsExtracting(false);
        }

        return;
      }

      // PDFs – server-side text extraction only
      if (file.type === "application/pdf") {
        if (file.size > MAX_PDF_SIZE_BYTES) {
          setUploadError(
            "This PDF is too large to process online. Please upload a PDF under 5 MB or paste the text manually.",
          );
          return;
        }

        setIsExtracting(true);

        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/extract", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(
              data?.error ||
                "Failed to extract text from the PDF. Please paste the text manually.",
            );
          }

          const text = (data?.text as string | undefined)?.trim() ?? "";

          if (!text) {
            throw new Error(
              "Could not find readable text in this PDF. If it's scanned, try uploading as an image or paste the text manually.",
            );
          }

          onChange(text);
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Something went wrong while reading the PDF.";
          setUploadError(message);
        } finally {
          setIsExtracting(false);
        }

        return;
      }

      // Everything else – unsupported
      setUploadError(
        "Unsupported file type. Please upload a PDF, image, or plain text file.",
      );
    } finally {
      // Always reset file input so the same file can be reselected
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-lg">{icon}</span>
          <label htmlFor={id} className="text-sm font-medium">
            {label}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,image/*"
            className="hidden"
            data-testid={fileInputTestId}
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isExtracting}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors disabled:opacity-50"
          >
            {isExtracting ? "Extracting..." : "Upload File"}
          </button>
        </div>
      </div>

      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setUploadError(null);
          onChange(e.target.value);
        }}
        className="w-full min-h-[150px] md:min-h-[180px] lg:min-h-[200px] resize-y
        bg-slate-800/50 backdrop-blur-sm
        border border-slate-700/60
        rounded-2xl p-4 text-sm text-slate-200
        placeholder:text-slate-500
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
        transition-all duration-200
        scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
      />

      {/* Character count + inline error */}
      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
        <span>{charCount.toLocaleString()} chars</span>
        {uploadError && (
          <span className="text-red-400 text-[11px] text-right max-w-[60%]">
            {uploadError}
          </span>
        )}
      </div>

      {/* Optional subtle extracting indicator */}
      {isExtracting && (
        <p className="mt-1 text-[11px] text-indigo-300">
          Extracting text from your file… this may take a few seconds.
        </p>
      )}
    </div>
  );
}
