import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TextInput from "../components/TextInput";

const createFile = (
  name: string,
  type: string,
  size: number,
  content = "file-content",
) => {
  const file = new File([content], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("TextInput upload UX", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockReset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderInput() {
    render(
      <TextInput
        id="resume"
        label="Paste your Resume"
        placeholder="Paste here..."
        value=""
        onChange={onChange}
        icon="📄"
      />,
    );
  }

  it("renders base UI correctly", () => {
    renderInput();

    expect(screen.getByText("Paste your Resume")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Paste here...")).toBeInTheDocument();
    expect(screen.getByText("Upload File")).toBeInTheDocument();
    expect(screen.getByText("0 chars")).toBeInTheDocument();
  });

  it("shows unsupported file type error", async () => {
    renderInput();

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = createFile(
      "resume.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      1000,
    );

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByText(
        "Unsupported file type. Please upload a PDF, image, or plain text file.",
      ),
    ).toBeInTheDocument();
  });

  it("shows error for oversized image", async () => {
    renderInput();

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = createFile("resume.jpg", "image/jpeg", 4 * 1024 * 1024 + 1);

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByText(
        "Image is too large to process reliably. Please upload an image under 4 MB or paste the text manually.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Extracting...")).not.toBeInTheDocument();
  });

  it("shows error for oversized PDF", async () => {
    renderInput();

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = createFile(
      "resume.pdf",
      "application/pdf",
      5 * 1024 * 1024 + 1,
    );

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByText(
        "This PDF is too large to process online. Please upload a PDF under 5 MB or paste the text manually.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Extracting...")).not.toBeInTheDocument();
  });

  it("shows error for empty text file", async () => {
    renderInput();

    class MockFileReader {
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

      readAsText() {
        this.onload?.({
          target: { result: "   " },
        } as ProgressEvent<FileReader>);
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = createFile("resume.txt", "text/plain", 100, "");

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByText(
        "This text file appears to be empty. Please paste the text manually.",
      ),
    ).toBeInTheDocument();

    expect(onChange).not.toHaveBeenCalled();
  });

  it("fills textarea for valid text file", async () => {
    renderInput();

    class MockFileReader {
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

      readAsText() {
        this.onload?.({
          target: { result: "React TypeScript Node.js" },
        } as ProgressEvent<FileReader>);
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = createFile(
      "resume.txt",
      "text/plain",
      100,
      "React TypeScript",
    );

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("React TypeScript Node.js");
    });
  });

  it("shows PDF API error message and recovers from extracting state", async () => {
    renderInput();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error:
            "Failed to extract text from the PDF. Please paste the text manually.",
        }),
      }),
    );

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = createFile("resume.pdf", "application/pdf", 1000);

    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByText("Extracting...")).toBeInTheDocument();

    expect(
      await screen.findByText(
        "Failed to extract text from the PDF. Please paste the text manually.",
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Extracting text from your file… this may take a few seconds.",
        ),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("Upload File")).toBeInTheDocument();
  });

  it("shows error when PDF extraction returns no readable text", async () => {
    renderInput();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ text: "   " }),
      }),
    );

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = createFile("resume.pdf", "application/pdf", 1000);

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      await screen.findByText(
        "Could not find readable text in this PDF. If it's scanned, try uploading as an image or paste the text manually.",
      ),
    ).toBeInTheDocument();
  });
});
