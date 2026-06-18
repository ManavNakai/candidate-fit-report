"use client";

import { useEffect, useState } from "react";

interface ScoreBadgeProps {
  score: number;
  label: string;
}

export default function ScoreBadge({ score, label }: ScoreBadgeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score from 0 → target
  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * score);
      setDisplayScore(start);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }, [score]);

  // Color based on score
  const getColor = () => {
    if (score >= 70) return { ring: "stroke-emerald-500", text: "text-emerald-400", glow: "shadow-emerald-500/20", bg: "from-emerald-500/10 to-emerald-500/5" };
    if (score >= 40) return { ring: "stroke-amber-500", text: "text-amber-400", glow: "shadow-amber-500/20", bg: "from-amber-500/10 to-amber-500/5" };
    return { ring: "stroke-red-500", text: "text-red-400", glow: "shadow-red-500/20", bg: "from-red-500/10 to-red-500/5" };
  };

  const colors = getColor();

  // SVG circle math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-4 p-6 rounded-3xl bg-gradient-to-b ${colors.bg} border border-slate-700/50 shadow-xl ${colors.glow}`}>
      {/* Circular score ring */}
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-700/50"
            strokeWidth="10"
          />
          {/* Progress ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            className={colors.ring}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </svg>
        {/* Score number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold tabular-nums ${colors.text}`}>
            {displayScore}
          </span>
          <span className="text-slate-500 text-sm font-medium">/ 100</span>
        </div>
      </div>

      {/* Label */}
      <div className={`text-xl font-semibold ${colors.text}`}>
        {label} Match
      </div>
    </div>
  );
}
