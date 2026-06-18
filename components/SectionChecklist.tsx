"use client";

import type { SectionCheck } from "@/lib/types";

interface SectionChecklistProps {
  checks: SectionCheck[];
}

const RELEVANCE_COLORS = {
  high: "text-indigo-400",
  medium: "text-slate-400",
  low: "text-slate-500",
};

export default function SectionChecklist({ checks }: SectionChecklistProps) {
  if (checks.length === 0) return null;

  return (
    <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
      <h3 className="flex items-center gap-2 text-base font-semibold text-slate-300 mb-4">
        <span>📊</span> Section Checklist
      </h3>
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
