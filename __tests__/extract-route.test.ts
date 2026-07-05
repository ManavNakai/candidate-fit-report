import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../app/api/extract/route";

describe("POST /api/extract", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 when file is missing", async () => {
    const formData = new FormData();
    const req = new NextRequest("http://localhost:3000/api/extract", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeTruthy();
  });

  it("returns a failure response when extraction throws", async () => {
    const file = new File(["dummy"], "resume.pdf", {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("file", file);

    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("boom"));

    const req = new NextRequest("http://localhost:3000/api/extract", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(json.error).toBeTruthy();
  });
});