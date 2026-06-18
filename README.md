# Resume ↔ JD Matcher 🎯

A free, fast, and entirely client-side web application that compares your resume to a job description. It calculates a weighted match score, identifies missing and covered keywords, and checks if your resume contains the sections that the job description emphasizes.

**[View the Live Demo on Vercel]** *(Replace this with your Vercel URL after deploying)*

Built as a trial task for Digital Heroes / Digital Marketing Heroes.

---

## Features

- **Instant & Private Analysis**: Runs 100% in your browser. No data is sent to external servers or paid APIs.
- **Weighted Scoring Algorithm**: Emphasizes hard skills, programming languages, and tools over generic filler words. Built-in dictionary of ~200+ tech terms.
- **Visual Keyword Breakdown**: Easily see which keywords you have covered (✅) and which ones you are missing (❌).
- **Section Checklist**: Detects if the job description asks for Education, Projects, or Soft Skills, and checks if your resume includes them.
- **Zero Cost**: Built completely with free-tier tools.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Hosting**: [Vercel](https://vercel.com/)

---

## How It Works

1. **Tokenization**: We extract keywords from both your Resume and the Job Description. Text is normalized, stopwords are removed, and multi-word phrases (n-grams) are extracted.
2. **Matching**: We compare your resume's tokens against the JD's tokens.
3. **Weighting**: Tokens are weighted based on importance (e.g., "React" has a higher weight than general soft skills).
4. **Scoring**: A final score from 0-100 is generated along with a plain English explanation of the results.

---

## Local Development

> **Note for Windows Users**: Ensure your parent directory name does not contain the `&` character, as this breaks Node.js command execution.

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

We use Vitest for zero-config, fast unit testing.
```bash
npm run test
```

---

## Author

**Manav Nakai**
- Email: YOUR_EMAIL_HERE
- [Digital Heroes](https://digitalheroesco.com)
