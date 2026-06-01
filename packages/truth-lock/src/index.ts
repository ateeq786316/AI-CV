import type { MasterResume, OptimizedResume } from "@ai-cv/shared";

export interface TruthLockError {
  field: string;
  message: string;
}

export interface TruthLockResult {
  valid: boolean;
  errors: TruthLockError[];
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function collectSkillItems(resume: MasterResume | OptimizedResume): Set<string> {
  const set = new Set<string>();
  for (const g of resume.skillGroups) {
    for (const item of g.items) {
      set.add(normalize(item));
    }
  }
  return set;
}

function collectCompanies(resume: MasterResume): Set<string> {
  return new Set(resume.experience.map((e) => normalize(e.company)));
}

function collectProjectNames(resume: MasterResume): Set<string> {
  return new Set((resume.projects ?? []).map((p) => normalize(p.name)));
}

/** Ensure optimized output does not introduce new companies or skills. */
export function validateTruthLock(
  master: MasterResume,
  optimized: OptimizedResume,
): TruthLockResult {
  const errors: TruthLockError[] = [];
  const masterSkills = collectSkillItems(master);
  const masterCompanies = collectCompanies(master);
  const masterProjects = collectProjectNames(master);

  for (const job of optimized.experience) {
    if (!masterCompanies.has(normalize(job.company))) {
      errors.push({
        field: `experience.${job.company}`,
        message: `Company "${job.company}" not found in master profile.`,
      });
    }
  }

  for (const proj of optimized.projects ?? []) {
    if (!masterProjects.has(normalize(proj.name))) {
      errors.push({
        field: `projects.${proj.name}`,
        message: `Project "${proj.name}" not found in master profile.`,
      });
    }
  }

  for (const g of optimized.skillGroups) {
    for (const item of g.items) {
      if (!masterSkills.has(normalize(item))) {
        errors.push({
          field: `skillGroups.${g.label}.${item}`,
          message: `Skill "${item}" not found in master profile.`,
        });
      }
    }
  }

  for (const kw of optimized.atsKeywords) {
    const n = normalize(kw);
    const inSkills = [...masterSkills].some(
      (s) => s.includes(n) || n.includes(s),
    );
    if (!inSkills) {
      const inBullets = [...master.experience, ...(master.projects ?? [])]
        .flatMap((e) => e.bullets)
        .some((b) => normalize(b).includes(n));
      if (!inBullets) {
        errors.push({
          field: `atsKeywords.${kw}`,
          message: `ATS keyword "${kw}" has no grounding in master profile.`,
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
