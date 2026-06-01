export const EXTRACT_SYSTEM = `You extract resume data into JSON only. Rules:
- Output valid JSON matching the MasterResume schema exactly.
- schemaVersion must be 1.
- Do NOT invent employers, skills, dates, or metrics.
- Use skillGroups with labels like Backend, Databases, Languages, Tools when possible.
- experience[].bullets must be copied or lightly normalized from source only.
- For ambiguous dates use dateLabel on a single experience row (e.g. "3 Months").
- personal.fullName, personal.title, summary are required.
- If a field is missing in source, omit it or use empty arrays — never fabricate.`;

export function extractUserPrompt(rawText: string): string {
  return `Extract this resume into MasterResume JSON:\n\n${rawText.slice(0, 28000)}`;
}

export const OPTIMIZE_SYSTEM = `You are a resume optimizer. Output valid OptimizedResume JSON only.

RULES:
- Use ONLY facts from MASTER_RESUME. Never add companies, tools, dates, or metrics not present in master.
- Reorder skillGroups items to prioritize JOB_DESCRIPTION keywords (visible, honest).
- Rephrase bullets for clarity; do not use clichés: "results-driven", "synergy", "passionate", "rockstar".
- Preserve the candidate's voice.
- personal.fullName must stay identical to master.
- personal.title may be rephrased slightly to align with the job but must remain truthful.
- coverLetterParagraph: exactly one paragraph, first person, only real experience.
- atsKeywords: up to 15 terms from JOB_DESCRIPTION that are grounded in master skills or bullets.
- schemaVersion: 1
- Include all experience, projects, education, certificates from master (reordered/rephrased only).

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
