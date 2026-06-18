"use client";

import type { MatchResult } from "@/lib/types";
import ScoreBadge from "./ScoreBadge";
import KeywordList from "./KeywordList";
import SectionChecklist from "./SectionChecklist";

interface ResultsPanelProps {
  result: MatchResult;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <section
      id="results-panel"
      className="animate-slideUp space-y-6 mt-8"
      aria-label="Analysis Results"
    >
      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">
          Results
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>

      {/* Score */}
      <div className="flex justify-center">
        <ScoreBadge score={result.score} label={result.label} />
      </div>

      {/* Keyword lists */}
      <div className="grid md:grid-cols-2 gap-6">
        <KeywordList
          title="Covered Keywords"
          tokens={result.coveredTokens}
          variant="covered"
          icon="✅"
        />
        <KeywordList
          title="Missing Keywords"
          tokens={result.missingTokens}
          variant="missing"
          icon="❌"
        />
      </div>

      {/* Section checklist */}
      <SectionChecklist checks={result.sectionChecklist} />

      {/* Explanation */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
        <h3 className="flex items-center gap-2 text-base font-semibold text-slate-300 mb-3">
          <span>💡</span> How This Score Is Computed
        </h3>
        <pre className="text-sm text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
          {result.explanation}
        </pre>
      </div>

      {/* Quick stats bar */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <StatPill
          label="JD Keywords"
          value={result.stats.totalJdTokens.toString()}
          color="text-indigo-400"
        />
        <StatPill
          label="Matched"
          value={result.stats.matchedCount.toString()}
          color="text-emerald-400"
        />
        <StatPill
          label="Missing"
          value={result.stats.missedCount.toString()}
          color="text-red-400"
        />
        <StatPill
          label="Weighted Score"
          value={`${result.stats.totalWeightedScore.toFixed(1)} / ${result.stats.maxWeightedScore.toFixed(1)}`}
          color="text-violet-400"
        />
      </div>
    </section>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl px-4 py-2 border border-slate-700/50">
      <span className="text-slate-500 text-xs">{label}</span>
      <span className={`font-semibold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}
