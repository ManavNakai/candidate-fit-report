"use client";

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-slate-800">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Author info */}
        <div className="text-sm text-slate-400">
          <p className="font-semibold text-slate-300">Manav Nakai</p>
          <p>
            <a
              href="mailto:YOUR_EMAIL_HERE"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              YOUR_EMAIL_HERE
            </a>
          </p>
        </div>

        {/* Built for Digital Heroes — MANDATORY BUTTON */}
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
            bg-gradient-to-r from-indigo-600 to-violet-600
            text-white text-sm font-semibold
            shadow-lg shadow-indigo-500/20
            hover:shadow-xl hover:shadow-indigo-500/30
            hover:scale-[1.03]
            active:scale-[0.98]
            transition-all duration-200"
        >
          Built for Digital Heroes
        </a>

        {/* Copyright */}
        <p className="text-xs text-slate-600 mt-2">
          © {new Date().getFullYear()} Resume ↔ JD Matcher. 100% free & client-side.
        </p>
      </div>
    </footer>
  );
}
