import type { Metadata } from "next";
import Script from "next/script";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Resume Keyword Matcher | Job Description Percentage Finder",
  description:
    "Paste your resume and a job description to instantly find missing keywords, calculate a weighted match percentage, and review a resume section checklist.",
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://resume-jd-matcher.vercel.app/#webapp",
  name: "Job Description Keyword Matcher & Resume Score Tool",
  url: "https://resume-jd-matcher.vercel.app",
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