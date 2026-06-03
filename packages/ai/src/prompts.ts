const MASTER_RESUME_SHAPE = `{
  "schemaVersion": 1,
  "personal": { "fullName": "...", "title": "...", "email": "...", "phone": "..." },
  "summary": "one paragraph string",
  "skillGroups": [
    { "label": "Backend", "items": ["Node.js", "NestJS"] }
  ],
  "experience": [
    {
      "company": "GeekyBugs",
      "role": "Backend Intern",
      "location": "Lahore",
      "startDate": "Sep 2025",
      "endDate": "Present",
      "stack": "NestJS, Prisma",
      "bullets": ["bullet one", "bullet two"]
    }
  ],
  "projects": [
    { "name": "Project Name", "startDate": "2024", "endDate": "2025", "stack": "...", "bullets": ["..."] }
  ],
  "education": [{ "degree": "B.Sc. ...", "institution": "...", "endDate": "2025", "details": ["CGPA: 3.3"] }],
  "certificates": [{ "name": "...", "issuer": "...", "date": "2024" }]
}`;

export const EXTRACT_SYSTEM = `You extract resume data into JSON only.

CRITICAL — every skillGroups[i] MUST have "items" as a string array (never omit items).
Every experience[i] MUST have "company", "role", and "bullets" (string array).
Every projects[i] MUST have "name" and "bullets" (string array).

Rules:
- schemaVersion: 1
- Do NOT invent employers, skills, dates, or metrics
- Copy bullets from source; use [] only if section truly empty
- For vague dates use dateLabel (e.g. "3 Months")
- personal.fullName and personal.title are required

Output shape:
${MASTER_RESUME_SHAPE}`;

export function extractUserPrompt(rawText: string): string {
  return `Extract this resume into MasterResume JSON. Follow the shape exactly.\n\n${rawText.slice(0, 28000)}`;
}

export const OPTIMIZE_SYSTEM = `You are a resume optimizer. Output valid OptimizedResume JSON only.

CRITICAL — same rules as MasterResume:
- skillGroups[].items must be string arrays
- experience[].role, experience[].company, experience[].bullets required
- projects[].name and projects[].bullets required

RULES:
- Use ONLY facts from MASTER_RESUME. Never add companies, tools, dates, or metrics not present in master.
- Reorder skillGroups items to prioritize JOB_DESCRIPTION keywords (visible, honest).
- Rephrase bullets for clarity; do not use clichés: "results-driven", "synergy", "passionate", "rockstar".
- Preserve the candidate's voice.
- personal.fullName must stay identical to master.
- coverLetterParagraph: exactly one paragraph, first person, only real experience.
- atsKeywords: up to 15 terms from JOB_DESCRIPTION grounded in master skills or bullets.
- schemaVersion: 1

MODES:
- safe: minimal rewording, reorder only
- balanced: clearer bullets + skill prioritization
- ats_assist: stronger keyword alignment in visible skills and bullets (still no new facts)`;

export function optimizeUserPrompt(
  masterJson: string,
  jobDescription: string,
  mode: string,
  fallbackProfile?: string,
): string {
  return `MASTER_RESUME:
${masterJson}

JOB_DESCRIPTION:
${jobDescription.slice(0, 12000)}

MODE: ${mode}
${fallbackProfile ? `FALLBACK_PROFILE: ${fallbackProfile}` : ""}

Return OptimizedResume JSON only.`;
}
