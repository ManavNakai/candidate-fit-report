import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://candidate-fit-report.vercel.app"),
  title: {
    default: "Candidate Fit Report | Resume and Job Description Analysis",
    template: "%s | Candidate Fit Report",
  },
  description:
    "Instantly see how well your resume matches any job description. Find missing keywords, compare resume content with JD terms, and review a smart resume section checklist — free and private.",
  keywords: [
    "resume matcher",
    "job description matcher",
    "resume score",
    "ATS checker",
    "keyword matcher",
    "resume optimizer",
    "job application tool",
    "resume keyword matcher",
    "job description percentage finder",
    "resume optimization tool",
    "resume keyword scanner",
    "Candidate Fit Report",
    "resume match score",
  "job match score",
  "ATS resume scanner",
  "ATS resume checker",
  "resume checker",
  "resume analysis tool",
  "resume analyzer",
  "resume screening tool",
  "job description analyzer",
  "job description analysis tool",
  "resume vs job description",
  "resume to job description match",
  "resume job match",
  "CV matcher",
  "CV score checker",
  "CV keyword scanner",
  "CV optimization tool",
  "ATS score checker",
  "ATS compatibility checker",
  "ATS match score",
  "keyword gap analysis",
  "missing keywords finder",
  "resume keyword analysis",
  "job keyword finder",
  "resume tailoring tool",
  "resume tailoring assistant",
  "resume alignment checker",
  "job fit checker",
  "candidate fit checker",
  "candidate match score",
  "job application optimizer",
  "resume improvement tool",
  "resume targeting tool",
  "job-specific resume checker",
  "resume relevance score",
  "resume fit analysis",
  "keyword match checker",
  "job posting keyword matcher",
  "resume job scanner",
  "resume review tool",
  "instant ATS scan",
  "job match report",
  "resume gap analysis",
  "resume skill match",
  "JD match score",
  "resume comparison tool",
  "resume tailoring report",
  "application match checker",
  "job application match score",
  "resume success score"
  ],
  authors: [{ name: "Manav Nakai" }],
  creator: "Manav Nakai",
  publisher: "Manav Nakai",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Candidate Fit Report | Resume and Job Description Analysis",
    description:
      "Paste your resume and a job description to instantly find missing keywords, calculate a match score, and review important resume sections.",
    url: "/",
    siteName: "Candidate Fit Report",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/previews/weightage-score-ui.png",
        width: 1200,
        height: 630,
        alt: "Resume to job description keyword match score dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Candidate Fit Report | Resume and Job Description Analysis",
    description:
      "Check resume-to-JD match score, missing keywords, and section completeness instantly. Generate Candidate Fit Report",
    images: ["/previews/weightage-score-ui.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  );
}
