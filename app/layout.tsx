import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Resume ↔ JD Matcher | Free Resume-to-Job Match Scorer",
  description:
    "Instantly see how well your resume matches any job description. Get a match score, discover missing keywords, and improve your application — 100% free and private.",
  keywords: [
    "resume matcher",
    "job description matcher",
    "resume score",
    "ATS checker",
    "keyword matcher",
    "resume optimizer",
    "job application tool",
  ],
  authors: [{ name: "Manav Nakai" }],
  openGraph: {
    title: "Resume ↔ JD Matcher",
    description:
      "Free tool to score how well your resume matches a job description. Find missing keywords instantly.",
    type: "website",
    locale: "en_US",
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
