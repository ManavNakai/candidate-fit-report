import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume-jd-matcher.vercel.app"),
  title: {
    default: "Resume ↔ JD Matcher | Free Resume-to-Job Match Scorer",
    template: "%s | Resume ↔ JD Matcher",
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
    title: "Resume ↔ JD Matcher | Free Resume-to-Job Match Scorer",
    description:
      "Paste your resume and a job description to instantly find missing keywords, calculate a match score, and review important resume sections.",
    url: "/",
    siteName: "Resume ↔ JD Matcher",
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
    title: "Resume ↔ JD Matcher | Free Resume-to-Job Match Scorer",
    description:
      "Check resume-to-JD match score, missing keywords, and section completeness instantly.",
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
        </main>
      </body>
    </html>
  );
}
