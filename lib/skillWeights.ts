// ============================================================
// Weighted skill / keyword dictionary
// Maps normalized terms → { category, weight }
// Higher weight = more important for match scoring
// ============================================================

import type { TokenCategory } from "./types";

interface SkillEntry {
  category: TokenCategory;
  weight: number;
}

export const SKILL_CONCEPT_KEYS: Record<string, string> = {
  // html family
  html: "html",
  html5: "html",

  // css family
  css: "css",
  css3: "css",

  // Node.js family
  node: "node.js",
  nodejs: "node.js",
  "node.js": "node.js",

  // React family
  react: "react.js",
  reactjs: "react.js",
  "react.js": "react.js",

  // Express family
  express: "express.js",
  expressjs: "express.js",
  "express.js": "express.js",

  // Nest family
  nest: "nest.js",
  nestjs: "nest.js",
  "nest.js": "nest.js",

  // Next family
  next: "next.js",
  nextjs: "next.js",
  "next.js": "next.js",

  // Nuxt family
  nuxt: "nuxt.js",
  nuxtjs: "nuxt.js",
  "nuxt.js": "nuxt.js",

  // Angular family
  angular: "angular",
  angularjs: "angular",
  "angular.js": "angular",

  // Vue family
  vue: "vue.js",
  vuejs: "vue.js",
  "vue.js": "vue.js",

  // Svelte family
  svelte: "svelte",
  sveltejs: "svelte",
  "svelte.js": "svelte",

  // jQuery family
  jquery: "jquery",
  "jquery.js": "jquery",

  // Frontend/backend spelling variants
  frontend: "frontend",
  "front-end": "frontend",
  backend: "backend",
  "back-end": "backend",
  "front end": "frontend",
  "back end": "backend",

  // Microservices spelling variants
  microservices: "microservices",
  "micro-services": "microservices",

  // REST/RESTful APIs
  restful: "rest api",
  rest: "rest api",
  "rest api": "rest api",
  "rest api's": "rest api",
  "rest apis": "rest api",
  "restful apis": "rest api",
  "restful api": "rest api",

  // GraphQL APIs
  graphql: "graphql",
  "graphql api": "graphql",
  "graphql api's": "graphql",
  "graphql apis": "graphql",

  // Problem solving
  "problem solving": "problem-solving",
  "problem-solving": "problem-solving",

  //stack
  "full stack": "full-stack",
  "full-stack": "full-stack",
  fullstack: "full-stack",
  "full stack developer": "full-stack",
  "full stack engineer": "full-stack",

  // Spring Family
  spring: "spring",
  "spring boot": "spring",

  // .NET Family
  ".net": ".net",
  dotnet: ".net",

  // TypeScript Family
  typescript: "typescript",
  "type script": "typescript",
  ts: "typescript",

  // C# Family
  "c#": "c#",
  csharp: "c#",

  // C++ Family
  "c++": "c++",
  cpp: "c++",

  // Python family
  python: "python",
  python3: "python",
  py: "python",

  // Django family
  django: "django",
  "django rest framework": "django",

  // FastAPIfamily
  fastapi: "fastapi",
  "fast api": "fastapi",

  // Flask family
  flask: "flask",

  // Ruby on Rails famil
  rails: "ruby on rails",
  "ruby on rails": "ruby on rails",

  //javascript family
  javascript: "javascript",
  "java script": "javascript",
  js: "javascript",

  // tailwind family
  tailwindcss: "tailwind",
  "tailwind css": "tailwind",
  tailwind: "tailwind",

  //aws family
  aws: "aws",
  "amazon web services": "aws",

  //gcp family
  gcp: "gcp",
  "google cloud": "gcp",
  "google cloud platform": "gcp",

  //azure family
  azure: "azure",
  "microsoft azure": "azure",

  //docker family
  docker: "docker",
  "docker compose": "docker",
  "docker desktop": "docker",

  //kubernetes family
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  "k8s cluster": "kubernetes",

  //mongodb family
  mongodb: "mongodb",
  "mongo db": "mongodb",
  mongo: "mongodb",
  "mongo db cluster": "mongodb",

  //mysql family
  mysql: "mysql",
  "my sql": "mysql",
  "my sql cluster": "mysql",

  //postgresql family
  postgresql: "postgresql",
  "postgre sql": "postgresql",
  postgre: "postgresql",
  "postgre sql cluster": "postgresql",

  //oracle family
  oracle: "oracle",
  "oracle db": "oracle",
  "oracle db cluster": "oracle",

  //sql server family
  "sql server": "sql server",
  "sql-server": "sql server",
  sqlserver: "sql server",
  "sql server cluster": "sql server",

  //firebase family
  firebase: "firebase",
  "firebase db": "firebase",
  "firebase database": "firebase",

  //redis family
  redis: "redis",
  "redis db": "redis",
  "redis database": "redis",

  //dynamodb family
  dynamodb: "dynamodb",
  "dynamo db": "dynamodb",
  dynamo: "dynamodb",
  "dynamo db cluster": "dynamodb",

  //cloudfront family
  cloudfront: "cloudfront",
  cf: "cloudfront",

  //netlify family
  netlify: "netlify",
  "netlify db": "netlify",
  "netlify database": "netlify",
  "netlify cluster": "netlify",

  //vercel family
  vercel: "vercel",
  "vercel db": "vercel",
  "vercel database": "vercel",
  "vercel cluster": "vercel",

  //bitbucket family
  bitbucket: "bitbucket",
  "bitbucket db": "bitbucket",
  "bitbucket database": "bitbucket",
  "bitbucket cluster": "bitbucket",

  //gitlab family
  gitlab: "gitlab",
  "gitlab db": "gitlab",
  "gitlab database": "gitlab",
  "gitlab cluster": "gitlab",

  //azure devops family
  "azure devops": "azure devops",
  "azure-devops": "azure devops",
  "azure devops db": "azure devops",
  "azure devops database": "azure devops",
  "azure devops cluster": "azure devops",

  //circleci family
  circleci: "circleci",
  "circleci db": "circleci",
  "circleci database": "circleci",
  "circleci cluster": "circleci",

  //github actions family
  "github actions": "github actions",
  "github-actions": "github actions",
  "github actions db": "github actions",
  "github actions database": "github actions",
  "github actions cluster": "github actions",

  // ci/cd family
  "ci/cd": "ci/cd",
  "ci-cd": "ci/cd",
  cicd: "ci/cd",

  algorithm: "algorithms",
  algorithms: "algorithms",

  "data structure": "data structures",
  "data structures": "data structures",

  "github copilot": "github copilot",
  copilot: "github copilot",

  api: "api",
  apis: "api",
  "api integration": "api",
  "api integrations": "api",

  "openai api": "openai api",
  "openai apis": "openai api",

  integration: "integration",
  "third party libraries": "third-party libraries",
  "third-party libraries": "third-party libraries",
  "third-party library": "third-party libraries",
  "third party library": "third-party libraries",
  chatgpt: "chatgpt",
  tabnine: "tabnine",
  performance: "performance",
  reliability: "reliability",
  maintainability: "maintainability",
  android: "android",
  ios: "ios",

  "ai/ml": "ai/ml",
  "ai ml": "ai/ml",
  ai: "ai/ml",
  "artificial intelligence": "ai/ml",
  ml: "ai/ml",
  "machine learning": "ai/ml",

  testing: "testing",
  "software testing": "testing",
  "unit testing": "testing",
  "integration testing": "testing",
  "end to end testing": "testing",
  "e2e testing": "testing",
  "ui testing": "testing",
  "software quality assurance": "quality assurance",
  "quality assurance": "quality assurance",
  qa: "quality assurance",
  "qa testing": "quality assurance",

  "code review": "code review",
  "code reviews": "code review",

  // ── Shared high-value non-tech terms ─────────────────────
  "stakeholder management": "stakeholder management",
  "stakeholder managements": "stakeholder management",
  stakeholders: "stakeholder management",
  "stakeholder engagement": "stakeholder management",

  "cross-functional": "cross functional",
  crossfunctional: "cross functional",
  "cross functional": "cross functional",

  reporting: "reporting",

  "kpi tracking": "kpi tracking",
  kpi: "kpi tracking",
  kpis: "kpi tracking",
  "kpi reporting": "kpi tracking",

  forecasting: "forecasting",
  forecast: "forecasting",
  forecasts: "forecasting",

  "process improvement": "process improvement",
  "continuous improvement": "process improvement",
  "process improvements": "process improvement",

  "process optimization": "process optimization",
  "process optimisation": "process optimization",
  optimization: "process optimization",
  optimisation: "process optimization",

  // ── Customer success / account management ───────────────
  "customer success": "customer success",
  "customer success manager": "customer success",
  csm: "customer success",

  "account management": "account management",
  "account manager": "account management",
  "client management": "account management",

  "account health": "account health",
  "customer health": "account health",

  "business reviews": "business reviews",
  "quarterly business reviews": "business reviews",
  qbr: "business reviews",
  qbrs: "business reviews",

  crm: "crm",
  "crm tools": "crm",

  // ── Sales / business development ────────────────────────

  "business development": "business development",
  bizdev: "business development",
  "new business development": "business development",

  "lead generation": "lead generation",
  "lead gen": "lead generation",
  prospecting: "lead generation",

  negotiation: "negotiation",
  negotiating: "negotiation",

  "pipeline management": "pipeline management",
  pipeline: "pipeline management",
  "sales pipeline": "pipeline management",

  "revenue growth": "revenue growth",
  "grow revenue": "revenue growth",

  "b2b sales": "b2b sales",
  b2b: "b2b sales",

  // ── Marketing ───────────────────────────────────────────

  "marketing strategy": "marketing strategy",
  "go to market strategy": "marketing strategy",

  "campaign management": "campaign management",
  campaigns: "campaign management",

  "social media marketing": "social media marketing",
  "social marketing": "social media marketing",

  "competitive analysis": "competitive analysis",
  "competitor analysis": "competitive analysis",

  "go-to-market": "go to market",
  gtm: "go to market",
  "go to market": "go to market",

  "google analytics": "google analytics",
  ga4: "google analytics",

  // ── Operations / project / program ──────────────────────
  "program management": "program management",
  "programme management": "program management",

  "resource allocation": "resource allocation",
  "resource planning": "resource allocation",

  "operational efficiency": "operational efficiency",
  "operations efficiency": "operational efficiency",

  "vendor management": "vendor management",
  "supplier management": "vendor management",

  compliance: "compliance",
  compliant: "compliance",

  // ── Recruiting / HR ─────────────────────────────────────
  "talent acquisition": "talent acquisition",
  recruiting: "talent acquisition",
  recruiter: "talent acquisition",

  sourcing: "sourcing",
  "candidate sourcing": "sourcing",

  screening: "screening",
  "candidate screening": "screening",

  interviewing: "interviewing",
  interviews: "interviewing",

  // ── Business analyst / strategy / product-adjacent ─────
  "business analysis": "business analysis",
  "business analyst": "business analysis",

  "requirements gathering": "requirements gathering",
  "requirement gathering": "requirements gathering",
  "requirements elicitation": "requirements gathering",

  dashboards: "dashboards",
  dashboard: "dashboards",

  "strategic planning": "strategic planning",
  strategy: "strategic planning",

  "root cause analysis": "root cause analysis",
  rca: "root cause analysis",
};

/** Curated dictionary of weighted skills, tools, and terms. */
export const SKILL_WEIGHTS: Record<string, SkillEntry> = {
  // ── Core CS / SDE concepts ─────────────────────────────────
  algorithms: { category: "concept", weight: 2.5 },
  algorithm: { category: "concept", weight: 2.5 },
  "data structures": { category: "concept", weight: 2.5 },
  "data structure": { category: "concept", weight: 2.5 },
  "software development": { category: "concept", weight: 2.0 },
  "software products": { category: "concept", weight: 1.5 },
  "object-oriented programming": { category: "concept", weight: 2.0 },
  "object oriented programming": { category: "concept", weight: 2.0 },
  oop: { category: "concept", weight: 2.0 },
  oops: { category: "concept", weight: 2.0 },
  "ai-assisted coding": { category: "concept", weight: 1.5 },
  "ai/ml": { category: "concept", weight: 2.0 },
  "ai/ml apis": { category: "concept", weight: 2.0 },
  ai: { category: "concept", weight: 2.0 },
  "artificial intelligence": { category: "concept", weight: 2.0 },
  ml: { category: "concept", weight: 2.0 },
  "machine learning": { category: "concept", weight: 2.0 },
  "deep learning": { category: "concept", weight: 2.0 },
  "prompt engineering": { category: "concept", weight: 2.0 },
  automation: { category: "concept", weight: 2.0 },
  analytics: { category: "concept", weight: 2.0 },
  "personalized learning": { category: "concept", weight: 1.5 },
  "content curation": { category: "concept", weight: 1.5 },
  edtech: { category: "concept", weight: 1.5 },
  integration: { category: "concept", weight: 2.0 },
  reliability: { category: "concept", weight: 2.0 },
  maintainability: { category: "concept", weight: 2.0 },
  security: { category: "concept", weight: 2.0 },
  "security vulnerabilities": { category: "concept", weight: 2.0 },

  // ── Programming Languages ──────────────────────────────────
  javascript: { category: "programming_language", weight: 2.5 },
  typescript: { category: "programming_language", weight: 2.5 },
  python: { category: "programming_language", weight: 2.5 },
  java: { category: "programming_language", weight: 2.5 },
  "c++": { category: "programming_language", weight: 2.5 },
  "c#": { category: "programming_language", weight: 2.5 },
  csharp: { category: "programming_language", weight: 2.5 },
  go: { category: "programming_language", weight: 2.5 },
  golang: { category: "programming_language", weight: 2.5 },
  rust: { category: "programming_language", weight: 2.5 },
  ruby: { category: "programming_language", weight: 2.5 },
  php: { category: "programming_language", weight: 2.5 },
  swift: { category: "programming_language", weight: 2.5 },
  kotlin: { category: "programming_language", weight: 2.5 },
  scala: { category: "programming_language", weight: 2.5 },
  r: { category: "programming_language", weight: 2.5 },
  matlab: { category: "programming_language", weight: 2.5 },
  perl: { category: "programming_language", weight: 2.0 },
  lua: { category: "programming_language", weight: 2.0 },
  dart: { category: "programming_language", weight: 2.5 },
  elixir: { category: "programming_language", weight: 2.0 },
  haskell: { category: "programming_language", weight: 2.0 },
  sql: { category: "programming_language", weight: 2.5 },
  html: { category: "programming_language", weight: 2.0 },
  css: { category: "programming_language", weight: 2.0 },
  html5: { category: "programming_language", weight: 2.0 },
  css3: { category: "programming_language", weight: 2.0 },
  sass: { category: "programming_language", weight: 2.0 },
  scss: { category: "programming_language", weight: 2.0 },
  bash: { category: "programming_language", weight: 2.0 },
  shell: { category: "programming_language", weight: 2.0 },
  powershell: { category: "programming_language", weight: 2.0 },
  solidity: { category: "programming_language", weight: 2.5 },

  // ── Frameworks & Libraries ─────────────────────────────────
  react: { category: "framework", weight: 2.5 },
  reactjs: { category: "framework", weight: 2.5 },
  "react.js": { category: "framework", weight: 2.5 },
  nextjs: { category: "framework", weight: 2.5 },
  next: { category: "framework", weight: 2.5 },
  "next.js": { category: "framework", weight: 2.5 },
  node: { category: "framework", weight: 2.5 },
  nodejs: { category: "framework", weight: 2.5 },
  "node.js": { category: "framework", weight: 2.5 },
  angular: { category: "framework", weight: 2.5 },
  angularjs: { category: "framework", weight: 2.5 },
  "angular.js": { category: "framework", weight: 2.5 },
  vue: { category: "framework", weight: 2.5 },
  vuejs: { category: "framework", weight: 2.5 },
  "vue.js": { category: "framework", weight: 2.5 },
  svelte: { category: "framework", weight: 2.5 },
  sveltejs: { category: "framework", weight: 2.5 },
  "svelte.js": { category: "framework", weight: 2.5 },
  nuxt: { category: "framework", weight: 2.0 },
  nuxtjs: { category: "framework", weight: 2.0 },
  "nuxt.js": { category: "framework", weight: 2.0 },
  gatsby: { category: "framework", weight: 2.0 },
  remix: { category: "framework", weight: 2.0 },
  express: { category: "framework", weight: 2.5 },
  expressjs: { category: "framework", weight: 2.5 },
  "express.js": { category: "framework", weight: 2.5 },
  nest: { category: "framework", weight: 2.5 },
  nestjs: { category: "framework", weight: 2.5 },
  "nest.js": { category: "framework", weight: 2.5 },
  fastapi: { category: "framework", weight: 2.5 },
  django: { category: "framework", weight: 2.5 },
  flask: { category: "framework", weight: 2.5 },
  "ruby on rails": { category: "framework", weight: 2.5 },
  rails: { category: "framework", weight: 2.5 },
  laravel: { category: "framework", weight: 2.5 },
  "spring boot": { category: "framework", weight: 2.5 },
  spring: { category: "framework", weight: 2.5 },
  ".net": { category: "framework", weight: 2.5 },
  dotnet: { category: "framework", weight: 2.5 },
  flutter: { category: "framework", weight: 2.5 },
  "react native": { category: "framework", weight: 2.5 },
  tailwind: { category: "framework", weight: 2.0 },
  tailwindcss: { category: "framework", weight: 2.0 },
  "tailwind css": { category: "framework", weight: 2.0 },
  bootstrap: { category: "framework", weight: 1.5 },
  jquery: { category: "framework", weight: 1.5 },
  redux: { category: "framework", weight: 2.0 },
  graphql: { category: "framework", weight: 2.0 },
  "socket.io": { category: "framework", weight: 2.0 },
  tensorflow: { category: "framework", weight: 2.5 },
  pytorch: { category: "framework", weight: 2.5 },
  keras: { category: "framework", weight: 2.0 },
  pandas: { category: "framework", weight: 2.0 },
  numpy: { category: "framework", weight: 2.0 },
  scikit: { category: "framework", weight: 2.0 },
  "scikit-learn": { category: "framework", weight: 2.0 },
  opencv: { category: "framework", weight: 2.0 },
  hadoop: { category: "framework", weight: 2.0 },
  spark: { category: "framework", weight: 2.5 },
  kafka: { category: "framework", weight: 2.5 },
  "openai api": { category: "framework", weight: 2.5 },
  "openai apis": { category: "framework", weight: 2.5 },

  // ── DevOps / Tools ─────────────────────────────────────────
  docker: { category: "tool", weight: 2.5 },
  kubernetes: { category: "tool", weight: 2.5 },
  k8s: { category: "tool", weight: 2.5 },
  terraform: { category: "tool", weight: 2.5 },
  ansible: { category: "tool", weight: 2.0 },
  jenkins: { category: "tool", weight: 2.0 },
  git: { category: "tool", weight: 2.0 },
  github: { category: "tool", weight: 1.5 },
  gitlab: { category: "tool", weight: 1.5 },
  bitbucket: { category: "tool", weight: 1.5 },
  jira: { category: "tool", weight: 1.5 },
  confluence: { category: "tool", weight: 1.5 },
  figma: { category: "tool", weight: 2.0 },
  webpack: { category: "tool", weight: 2.0 },
  vite: { category: "tool", weight: 2.0 },
  npm: { category: "tool", weight: 1.5 },
  yarn: { category: "tool", weight: 1.5 },
  pnpm: { category: "tool", weight: 1.5 },
  postman: { category: "tool", weight: 1.5 },
  swagger: { category: "tool", weight: 1.5 },
  nginx: { category: "tool", weight: 2.0 },
  apache: { category: "tool", weight: 1.5 },
  linux: { category: "tool", weight: 2.0 },
  unix: { category: "tool", weight: 2.0 },
  elasticsearch: { category: "tool", weight: 2.0 },
  kibana: { category: "tool", weight: 1.5 },
  grafana: { category: "tool", weight: 1.5 },
  prometheus: { category: "tool", weight: 1.5 },
  datadog: { category: "tool", weight: 1.5 },
  splunk: { category: "tool", weight: 1.5 },
  sentry: { category: "tool", weight: 1.5 },
  vercel: { category: "tool", weight: 2.0 },
  netlify: { category: "tool", weight: 1.5 },
  heroku: { category: "tool", weight: 1.5 },
  copilot: { category: "tool", weight: 2.0 },
  "github copilot": { category: "tool", weight: 2.5 },
  chatgpt: { category: "tool", weight: 2.0 },
  tabnine: { category: "tool", weight: 2.0 },
  "third-party libraries": { category: "concept", weight: 2.0 },
  android: { category: "tool", weight: 2.0 },
  ios: { category: "tool", weight: 2.0 },

  // ── Cloud ──────────────────────────────────────────────────
  aws: { category: "cloud", weight: 2.5 },
  "amazon web services": { category: "cloud", weight: 2.5 },
  azure: { category: "cloud", weight: 2.5 },
  gcp: { category: "cloud", weight: 2.5 },
  "google cloud": { category: "cloud", weight: 2.5 },
  s3: { category: "cloud", weight: 2.0 },
  ec2: { category: "cloud", weight: 2.0 },
  lambda: { category: "cloud", weight: 2.0 },
  cloudfront: { category: "cloud", weight: 1.5 },
  cloudflare: { category: "cloud", weight: 1.5 },
  firebase: { category: "cloud", weight: 2.0 },
  supabase: { category: "cloud", weight: 2.0 },

  // ── Databases ──────────────────────────────────────────────
  mysql: { category: "database", weight: 2.5 },
  postgresql: { category: "database", weight: 2.5 },
  postgres: { category: "database", weight: 2.5 },
  mongodb: { category: "database", weight: 2.5 },
  redis: { category: "database", weight: 2.5 },
  sqlite: { category: "database", weight: 2.0 },
  dynamodb: { category: "database", weight: 2.0 },
  cassandra: { category: "database", weight: 2.0 },
  neo4j: { category: "database", weight: 2.0 },
  oracle: { category: "database", weight: 2.0 },
  couchdb: { category: "database", weight: 1.5 },
  firestore: { category: "database", weight: 2.0 },
  prisma: { category: "database", weight: 2.0 },
  sequelize: { category: "database", weight: 1.5 },
  mongoose: { category: "database", weight: 1.5 },

  // ── Methodologies & Practices ──────────────────────────────
  agile: { category: "methodology", weight: 1.5 },
  scrum: { category: "methodology", weight: 1.5 },
  kanban: { category: "methodology", weight: 1.5 },
  "ci/cd": { category: "methodology", weight: 2.0 },
  cicd: { category: "methodology", weight: 2.0 },
  devops: { category: "methodology", weight: 2.0 },
  microservices: { category: "methodology", weight: 2.0 },
  "micro-services": { category: "methodology", weight: 2.0 },
  restful: { category: "methodology", weight: 2.0 },
  rest: { category: "methodology", weight: 2.0 },
  "rest api": { category: "methodology", weight: 2.0 },
  "rest api's": { category: "methodology", weight: 2.0 },
  "rest apis": { category: "methodology", weight: 2.0 },
  "restful apis": { category: "methodology", weight: 2.0 },
  "restful api": { category: "methodology", weight: 2.0 },
  api: { category: "methodology", weight: 2.0 },
  apis: { category: "methodology", weight: 2.0 },
  tdd: { category: "methodology", weight: 1.5 },
  bdd: { category: "methodology", weight: 1.5 },
  "test driven": { category: "methodology", weight: 1.5 },
  "object oriented": { category: "methodology", weight: 1.5 },
  "design patterns": { category: "methodology", weight: 1.5 },
  "data science": { category: "methodology", weight: 2.5 },
  "data engineering": { category: "methodology", weight: 2.5 },
  "data analysis": { category: "methodology", weight: 2.0 },
  "data analytics": { category: "methodology", weight: 2.0 },
  "natural language processing": { category: "methodology", weight: 2.5 },
  nlp: { category: "methodology", weight: 2.5 },
  "computer vision": { category: "methodology", weight: 2.5 },
  blockchain: { category: "methodology", weight: 2.0 },
  cybersecurity: { category: "methodology", weight: 2.0 },
  "web development": { category: "methodology", weight: 1.5 },
  "full stack": { category: "methodology", weight: 2.0 },
  fullstack: { category: "methodology", weight: 2.0 },
  "full-stack": { category: "methodology", weight: 2.0 },
  frontend: { category: "methodology", weight: 2.0 },
  "front-end": { category: "methodology", weight: 2.0 },
  backend: { category: "methodology", weight: 2.0 },
  "back-end": { category: "methodology", weight: 2.0 },
  responsive: { category: "methodology", weight: 1.5 },
  accessibility: { category: "methodology", weight: 1.5 },
  seo: { category: "methodology", weight: 1.5 },
  performance: { category: "methodology", weight: 1.5 },
  optimization: { category: "methodology", weight: 1.5 },
  scalability: { category: "methodology", weight: 1.5 },
  architecture: { category: "methodology", weight: 1.5 },
  "system design": { category: "methodology", weight: 2.0 },
  testing: { category: "methodology", weight: 2.0 },
  "software testing": { category: "methodology", weight: 2.0 },
  "unit testing": { category: "methodology", weight: 2.0 },
  "integration testing": { category: "methodology", weight: 2.0 },
  "quality assurance": { category: "methodology", weight: 2.0 },
  qa: { category: "methodology", weight: 2.0 },
  "software quality assurance": { category: "methodology", weight: 2.0 },
  "qa testing": { category: "methodology", weight: 2.0 },
  "e2e testing": { category: "methodology", weight: 2.0 },
  "ui testing": { category: "methodology", weight: 2.0 },
  "code review": { category: "methodology", weight: 2.0 },
  "code reviews": { category: "methodology", weight: 2.0 },
  "code quality": { category: "methodology", weight: 2.0 },
  debugging: { category: "methodology", weight: 2.0 },
  "debugging techniques": { category: "methodology", weight: 2.0 },

  // ── Soft Skills ────────────────────────────────────────────
  leadership: { category: "soft_skill", weight: 1.0 },
  communication: { category: "soft_skill", weight: 1.0 },
  collaboration: { category: "soft_skill", weight: 1.0 },
  teamwork: { category: "soft_skill", weight: 1.0 },
  "problem solving": { category: "soft_skill", weight: 1.0 },
  "problem-solving": { category: "soft_skill", weight: 1.0 },
  analytical: { category: "soft_skill", weight: 1.0 },
  creative: { category: "soft_skill", weight: 1.0 },
  innovative: { category: "soft_skill", weight: 1.0 },
  proactive: { category: "soft_skill", weight: 1.0 },
  mentoring: { category: "soft_skill", weight: 1.0 },
  mentorship: { category: "soft_skill", weight: 1.0 },

  // ── Role / Seniority Terms ─────────────────────────────────
  senior: { category: "role", weight: 1.5 },
  junior: { category: "role", weight: 1.5 },
  lead: { category: "role", weight: 1.5 },
  principal: { category: "role", weight: 1.5 },
  staff: { category: "role", weight: 1.5 },
  manager: { category: "role", weight: 1.5 },
  director: { category: "role", weight: 1.5 },
  architect: { category: "role", weight: 1.5 },
  intern: { category: "role", weight: 1.5 },
  associate: { category: "role", weight: 1.5 },

  // ── Education ──────────────────────────────────────────────
  "bachelor's": { category: "education", weight: 1.5 },
  bachelors: { category: "education", weight: 1.5 },
  "master's": { category: "education", weight: 1.5 },
  masters: { category: "education", weight: 1.5 },
  phd: { category: "education", weight: 1.5 },
  doctorate: { category: "education", weight: 1.5 },
  mba: { category: "education", weight: 1.5 },
  "computer science": { category: "education", weight: 1.5 },
  "information technology": { category: "education", weight: 1.5 },
  engineering: { category: "education", weight: 1.5 },
  mathematics: { category: "education", weight: 1.5 },
  statistics: { category: "education", weight: 1.5 },

  // ── Certifications ─────────────────────────────────────────
  "aws certified": { category: "certification", weight: 2.0 },
  "azure certified": { category: "certification", weight: 2.0 },
  "google certified": { category: "certification", weight: 2.0 },
  pmp: { category: "certification", weight: 1.5 },
  "scrum master": { category: "certification", weight: 1.5 },
  cissp: { category: "certification", weight: 1.5 },
  comptia: { category: "certification", weight: 1.5 },

  // ── Non-Tech / Business Keywords ───────────────────────────

  // Shared high-value non-tech terms
  "stakeholder management": { category: "general", weight: 2.0 },
  "cross-functional": { category: "general", weight: 1.5 },
  reporting: { category: "operations", weight: 1.5 },
  "kpi tracking": { category: "operations", weight: 1.5 },
  forecasting: { category: "business_analysis", weight: 1.5 },
  "process improvement": { category: "operations", weight: 1.5 },
  "process optimization": { category: "operations", weight: 1.5 },

  // Customer success / account management
  "customer success": { category: "customer_success", weight: 2.5 },
  "account management": { category: "account_management", weight: 2.5 },
  "account health": { category: "account_management", weight: 2.0 },
  "business reviews": { category: "customer_success", weight: 2.0 },
  crm: { category: "tool", weight: 2.0 },

  // Sales / account / business development
  sales: { category: "sales", weight: 2.0 },
  "business development": { category: "sales", weight: 2.5 },
  "lead generation": { category: "sales", weight: 2.0 },
  negotiation: { category: "soft_skill", weight: 1.5 },
  "pipeline management": { category: "sales", weight: 2.0 },
  "revenue growth": { category: "sales", weight: 2.0 },
  "b2b sales": { category: "sales", weight: 2.0 },

  // Marketing
  marketing: { category: "marketing", weight: 2.0 },
  "marketing strategy": { category: "marketing", weight: 2.5 },
  "campaign management": { category: "marketing", weight: 2.5 },
  "digital marketing": { category: "marketing", weight: 2.5 },
  "content marketing": { category: "marketing", weight: 2.5 },
  "email marketing": { category: "marketing", weight: 2.0 },
  "social media marketing": { category: "marketing", weight: 2.0 },
  "market research": { category: "marketing", weight: 2.0 },
  "competitive analysis": { category: "marketing", weight: 2.0 },
  "go-to-market": { category: "marketing", weight: 2.0 },
  "product marketing": { category: "marketing", weight: 2.5 },
  "google analytics": { category: "tool", weight: 2.0 },

  // Operations / project / program
  "program management": { category: "operations", weight: 2.5 },
  "project management": { category: "operations", weight: 2.5 },
  "risk management": { category: "operations", weight: 2.0 },
  "resource allocation": { category: "operations", weight: 2.0 },
  "operational efficiency": { category: "operations", weight: 2.0 },
  "vendor management": { category: "operations", weight: 2.0 },
  compliance: { category: "operations", weight: 1.5 },
  logistics: { category: "operations", weight: 1.5 },

  // Recruiting / HR
  "talent acquisition": { category: "recruiting", weight: 2.5 },
  sourcing: { category: "recruiting", weight: 2.0 },
  screening: { category: "recruiting", weight: 2.0 },
  interviewing: { category: "recruiting", weight: 2.0 },
  "candidate experience": { category: "recruiting", weight: 2.0 },
  "offer negotiation": { category: "recruiting", weight: 2.0 },

  // Business analyst / strategy / product-adjacent
  "business analysis": { category: "business_analysis", weight: 2.5 },
  "requirements gathering": { category: "business_analysis", weight: 2.5 },
  "stakeholder analysis": { category: "business_analysis", weight: 2.0 },
  dashboards: { category: "tool", weight: 1.5 },
  "strategic planning": { category: "business_analysis", weight: 2.0 },
  "decision support": { category: "business_analysis", weight: 2.0 },
  "root cause analysis": { category: "business_analysis", weight: 2.0 },
  "customer feedback": { category: "customer_success", weight: 2.0 },
};
