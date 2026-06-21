"use client";

import type { SectionCheck } from "@/lib/types";

interface SectionChecklistProps {
  checks: SectionCheck[];
  usedRoleFallback: boolean;
  roleType?: "tech" | "non-tech";
}

const RELEVANCE_COLORS = {
  high: "text-indigo-400",
  medium: "text-slate-400",
  low: "text-slate-500",
};

export default function SectionChecklist({
  checks,
  usedRoleFallback,
  roleType,
}: SectionChecklistProps) {
  if (checks.length === 0) return null;

  return (
    <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
      <h3 className="flex items-center gap-2 text-base font-semibold text-slate-300 mb-4">
        <span>📊</span> Section Checklist 
      </h3>
      {usedRoleFallback ? (
        <p className="text-sm text-slate-400 mb-4 whitespace-pre-wrap font-sans leading-relaxed">
          The job description does not clearly indicate which resume sections it prioritizes, so this checklist is based on the sections typically expected for a{" "}
          <span className="font-medium text-indigo-300">{roleType}</span> role.
          It shows whether those sections are currently present in the resume.
        </p>
        ) : (
        <p className="text-sm text-slate-400 mb-4 whitespace-pre-wrap font-sans leading-relaxed">
          This checklist reflects the section signals identified in the job description and shows whether those expected sections are present in the resume.
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {checks.map((check) => (
          <div
            key={check.section}
            className={`
              flex items-center gap-2.5 p-3 rounded-xl border
              transition-colors duration-200
              ${
                check.found
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-red-500/5 border-red-500/20"
              }
            `}
          >
            <span className="text-lg">
              {check.found ? "✅" : "❌"}
            </span>
            <div>
              <div className={`text-sm font-medium ${check.found ? "text-emerald-400" : "text-red-400"}`}>
                {check.section}
              </div>
              <div className={`text-[10px] uppercase tracking-wider font-medium ${RELEVANCE_COLORS[check.relevance]}`}>
                {check.relevance} priority
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
