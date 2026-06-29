import type { Metadata } from "next";
import Script from "next/script";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Candidate Fit Report | Resume and Job Description Analysis",
  description:
    "Resume and Job Description Analysis. Instantly compare your resume with a job description, review your fit score, identify missing keywords, and improve your application — privately and free.",
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://candidate-fit-report.vercel.app/#webapp",
  name: "Job Description Keyword Matcher & Resume Score Tool",
  url:"https://candidate-fit-report.vercel.app",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  description:
    "A client-side utility to extract meaningful keywords from job descriptions, check their presence in a resume, and compute a weighted matching percentage.",
  featureList: [
    "Job Description Keyword Extraction",
    "Resume Keyword Match Checking",
    "Weighted Resume Match Percentage",
    "Resume Section Completeness Checklist",
    "Role-aware section prioritization",
    "Candidate Fit Report",
    "Resume and Job Description Keyword Matcher",
    "Resume and Job Description Analyzer",
    "Resume and Job Description Comparer",
  ],
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD",
  },
};

export default function Page() {
  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}