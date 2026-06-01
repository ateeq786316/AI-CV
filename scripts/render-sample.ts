import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MasterResumeSchema, OptimizedResumeSchema } from "@ai-cv/shared";
import { renderResumeTex } from "@ai-cv/latex-engine";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const seedPath = join(
  root,
  "templates/default/seeds/master-resume.ateeq.json",
);
const outDir = join(root, "templates/default/build");
mkdirSync(outDir, { recursive: true });

const master = MasterResumeSchema.parse(
  JSON.parse(readFileSync(seedPath, "utf-8")),
);

// Example: NestJS-focused reorder (what AI would output for a NestJS JD)
const optimized = OptimizedResumeSchema.parse({
  ...master,
  personal: {
    ...master.personal,
    title: "Backend Software Engineer (NestJS / Node.js)",
  },
  skillGroups: [
    {
      label: "Backend",
      items: [
        "NestJS",
        "Node.js",
        "Express.js",
        "REST APIs",
        "WebSockets",
        "JWT",
        "RBAC",
      ],
    },
    {
      label: "Databases",
      items: [
        "PostgreSQL",
        "Prisma ORM",
        "MongoDB",
        "Mongoose",
        "SQL",
      ],
    },
    {
      label: "Languages",
      items: ["TypeScript", "JavaScript", "C++"],
    },
    {
      label: "Tools",
      items: ["Git", "Postman", "VS Code"],
    },
  ],
  atsKeywords: ["NestJS", "PostgreSQL", "Prisma", "JWT", "RBAC", "WebSockets"],
  coverLetterParagraph:
    "I am a Backend Software Engineer with hands-on NestJS and Prisma experience building REST APIs, JWT authentication, and real-time features. At GeekyBugs I develop production APIs with PostgreSQL and RBAC, and I have shipped NestJS backends including an e-commerce platform with role-based access and order management.",
  changesSummary: "Prioritized NestJS and Prisma in skills; reordered backend stack for NestJS role.",
});

const preamblePath = join(root, "templates/default/preamble.tex");
const preamble = readFileSync(preamblePath, "utf-8");
const tex = renderResumeTex(optimized, {}, preamble);

const outPath = join(outDir, "main.tex");
writeFileSync(outPath, tex, "utf-8");
console.log(`Wrote ${outPath}`);
console.log("Compile with: cd templates/default/build && pdflatex main.tex");
console.log("(Copy glyphtounicode.tex from templates/default/ into build/)");
