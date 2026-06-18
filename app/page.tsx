"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import TextInput from "@/components/TextInput";
import AnalyzeButton from "@/components/AnalyzeButton";
import ResultsPanel from "@/components/ResultsPanel";
import Footer from "@/components/Footer";
import { analyzeMatch } from "@/lib/matcher";
import type { MatchResult } from "@/lib/types";

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canAnalyze = resumeText.trim().length > 0 && jdText.trim().length > 0;

  const handleAnalyze = useCallback(() => {
    if (!canAnalyze) return;

    setError("");
    setLoading(true);
    setResult(null);

    // Simulate a small delay for perceived UX (the actual computation is instant)
    setTimeout(() => {
      try {
        const matchResult = analyzeMatch(resumeText, jdText);
        setResult(matchResult);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please check your inputs and try again."
        );
      } finally {
        setLoading(false);
      }
    }, 600);
  }, [resumeText, jdText, canAnalyze]);

  return (
    <>
      <Header />

      {/* Input Section */}
      <section aria-label="Input fields" className="grid md:grid-cols-2 gap-6">
        <TextInput
          id="resume-input"
          label="Paste your Resume"
          placeholder="Paste the full text of your resume here…&#10;&#10;Include your skills, experience, education, projects, and certifications for the best analysis."
          value={resumeText}
          onChange={(val) => {
            setResumeText(val);
            setResult(null);
          }}
          icon="📄"
        />
        <TextInput
          id="jd-input"
          label="Paste the Job Description"
          placeholder="Paste the full job description here…&#10;&#10;Include the responsibilities, qualifications, required skills, and any other relevant details."
          value={jdText}
          onChange={(val) => {
            setJdText(val);
            setResult(null);
          }}
          icon="📋"
        />
      </section>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Validation hint */}
      {!canAnalyze && (resumeText.length > 0 || jdText.length > 0) && (
        <div className="mt-4 text-center text-sm text-slate-500">
          {resumeText.length === 0
            ? "⬆️ Paste your resume text to get started."
            : "⬆️ Paste the job description to continue."}
        </div>
      )}

      {/* Analyze Button */}
      <AnalyzeButton
        onClick={handleAnalyze}
        disabled={!canAnalyze}
        loading={loading}
      />

      {/* Results */}
      {result && <ResultsPanel result={result} />}

      {/* Footer */}
      <Footer />
    </>
  );
}
