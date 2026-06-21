"use client";

import { Mail, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-8">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
          <div className="flex flex-col gap-8 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            {/* Left: identity + contact */}
            <div className="space-y-3 text-center md:text-left">
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-100">
                  Built by: Manav Nakai
                </p>
                <a
                  href="mailto:[manavnakai123@gmail.com]"
                  className="mt-1 inline-flex max-w-full flex-wrap items-center justify-center gap-2 text-center text-sm leading-relaxed text-indigo-400 transition-colors hover:text-indigo-300 md:justify-start"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="break-all">manavnakai123@gmail.com</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <a
                  href="https://github.com/ManavNakai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                >
                  <FaGithub className="h-4 w-4" />
                  GitHub
                </a>

                <a
                  href="https://www.linkedin.com/in/manav-nakai-833482247/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col items-center gap-3 md:items-end">
              <a
                href="https://digitalheroesco.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/30 active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                Built for Digital Heroes
              </a>

              <p className="max-w-sm text-center text-xs leading-relaxed text-slate-500 md:text-right">
                Candidate Fit Report built as a free, client-side tool and deployed for
                practical real-world use.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800/80 px-6 py-4 md:px-8">
            <p className="text-center text-xs text-slate-600 md:text-left">
              © {new Date().getFullYear()} Candidate Fit Report. 100% free & client-side.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}