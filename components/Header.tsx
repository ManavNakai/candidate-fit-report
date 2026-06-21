"use client";

import React from "react";

const steps = [
  { icon: "📄", text: "Paste your resume text" },
  { icon: "📋", text: "Paste the job description" },
  { icon: "✨", text: "Click \"Analyze Match\"" },
  { icon: "📊", text: "Review your score & missing keywords" },
];

export default function Header() {
  return (
    <header className="text-center mb-10 md:mb-14">
      {/* Logo / Title */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
          🎯
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
          Candidate Fit Report
        </h1>
      </div>

      {/* Tagline */}
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
        See how well your resume matches any job description — instantly, privately, and free.
      </p>

      {/* How to use steps */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-2">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-slate-700/50 text-sm text-slate-300">
              <span className="text-lg">{step.icon}</span>
              <span>{step.text}</span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-slate-600 hidden md:inline text-lg">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </header>
  );
}
