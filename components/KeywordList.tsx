"use client";

import type { Token } from "@/lib/types";

interface KeywordListProps {
  title: string;
  tokens: Token[];
  variant: "covered" | "missing";
  icon: string;
}

/** Maps token categories to readable labels */
const CATEGORY_LABELS: Record<string, string> = {
  programming_language: "Language",
  framework: "Framework",
  tool: "Tool",
  cloud: "Cloud",
  database: "Database",
  methodology: "Method",
  soft_skill: "Soft Skill",
  role: "Role",
  education: "Education",
  certification: "Cert.",
  general: "",
  customer_success: "Customer Success",
  account_management: "Accounts",
  sales: "Sales",
  marketing: "Marketing",
  operations: "Operations",
  recruiting: "Recruiting",
  business_analysis: "Business Analysis",
};

export default function KeywordList({
  title,
  tokens,
  variant,
  icon,
}: KeywordListProps) {
  const isCovered = variant === "covered";

  if (tokens.length === 0) {
    return (
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
        <h3 className="flex items-center gap-2 text-base font-semibold text-slate-300 mb-3">
          <span>{icon}</span> {title}
        </h3>
        <p className="text-slate-500 text-sm italic">
          {isCovered ? "No matching keywords found." : "No missing keywords — great coverage!"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
      <h3 className="flex items-center gap-2 text-base font-semibold text-slate-300 mb-1">
        <span>{icon}</span> {title}
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        {tokens.length} keyword{tokens.length !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {tokens.map((token, i) => {
          const categoryLabel = CATEGORY_LABELS[token.category] || "";
          return (
            <span
              key={`${token.normalized}-${i}`}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                animate-fadeSlideIn
                ${
                  isCovered
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }
              `}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {token.normalized}
              {categoryLabel && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-normal ${
                    isCovered
                      ? "bg-emerald-500/15 text-emerald-500/70"
                      : "bg-red-500/15 text-red-500/70"
                  }`}
                >
                  {categoryLabel}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
