# Candidate Fit Report 🎯

A free, fast, fully client-side web app that compares your resume against a job description and gives you an actionable match report. It calculates a weighted match score, highlights missing vs. covered keywords, and checks whether your resume includes the sections the job description cares about (like Education, Projects, or Soft Skills).

> Perfect for students, job seekers, and developers who want to quickly tailor their resume before hitting “Apply”.

---

## 🚀 Live Link

**[View the live app on Vercel](https://candidate-fit-report.vercel.app)**

---

## ✨ Features

- **Instant & Private Analysis**  
  Runs 100% in your browser. Your resume and JD never leave your machine — no servers, no paid APIs.

- **Weighted Scoring Algorithm**  
  Emphasizes hard skills, programming languages, and tools over generic filler words, using a built-in dictionary of ~200+ tech terms.

- **Visual Keyword Breakdown**  
  See at a glance which keywords you already cover (✅) and which important ones are missing (❌).

- **Section Awareness Checklist**  
  Detects whether the job description emphasizes sections like Education, Projects, or Soft Skills and checks if your resume mentions them.

- **Zero Cost, Zero Setup**  
  Built entirely with free-tier tools and runs in any modern browser.

---

## 🧱 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Hosting:** [Vercel](https://vercel.com/)

---

## ⚙️ How It Works

1. **Tokenization**  
   Text from both the resume and job description is normalized, split into tokens, and cleaned (lowercased, stopwords removed, plus extraction of multi-word phrases).

2. **Matching**  
   The tool compares tokens from your resume against those from the job description to find overlaps and gaps.

3. **Weighting**  
   Tokens are weighted by importance — for example, concrete skills like `React`, `TypeScript`, or `PostgreSQL` count more than generic soft-skill words.

4. **Scoring & Explanation**  
   A final score from 0–100 is generated, alongside a human-readable explanation, covered/missing keyword lists, and a section checklist.

---

## 🧑‍💻 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ManavNakai/candidate-fit-report
   cd candidate-fit-report
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Running Tests

This project uses Vitest for fast, zero-config unit tests.

```bash
npm run test
```

---

## 👤 Author

**Manav Nakai**

- Email: [manavnakai123@gmail.com](mailto:manavnakai123@gmail.com)
- LinkedIn: [Manav Nakai](https://www.linkedin.com/in/manav-nakai-833482247/)
- Built as a trial project for: [Digital Heroes](https://digitalheroesco.com)

If you find this useful, feel free to ⭐ the repo or open an issue with ideas for improving the matching logic.
