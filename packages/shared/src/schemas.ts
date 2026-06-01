import { z } from "zod";

export const SCHEMA_VERSION = 1 as const;

const personalSchema = z.object({
  fullName: z.string().min(1),
  title: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
});

const skillGroupSchema = z.object({
  label: z.string().min(1),
  items: z.array(z.string().min(1)),
});

const experienceEntrySchema = z
  .object({
    company: z.string().min(1),
    role: z.string().min(1),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.union([z.string().min(1), z.literal("Present")]).optional(),
    dateLabel: z.string().optional(),
    stack: z.string().optional(),
    bullets: z.array(z.string().min(1)),
  })
  .refine((d) => Boolean(d.dateLabel || d.endDate || d.startDate), {
    message: "Experience entry needs dateLabel, endDate, or startDate",
  });

const projectEntrySchema = z.object({
  name: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  stack: z.string().optional(),
  bullets: z.array(z.string().min(1)),
});

const educationEntrySchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  details: z.array(z.string()).optional(),
});

const certificateEntrySchema = z.object({
  name: z.string().min(1),
  issuer: z.string().optional(),
  date: z.string().optional(),
});

export const MasterResumeSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  personal: personalSchema,
  summary: z.string().min(1),
  skillGroups: z.array(skillGroupSchema).min(1),
  experience: z.array(experienceEntrySchema),
  projects: z.array(projectEntrySchema).optional(),
  education: z.array(educationEntrySchema).min(1),
  certificates: z.array(certificateEntrySchema).optional(),
  _meta: z
    .object({
      extractedAt: z.string().optional(),
      source: z.enum(["pdf", "paste", "manual", "latex-import"]).optional(),
    })
    .optional(),
});

export const OptimizedResumeSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  personal: personalSchema,
  summary: z.string().min(1),
  skillGroups: z.array(skillGroupSchema).min(1),
  experience: z.array(experienceEntrySchema),
  projects: z.array(projectEntrySchema).optional(),
  education: z.array(educationEntrySchema).min(1),
  certificates: z.array(certificateEntrySchema).optional(),
  atsKeywords: z.array(z.string()).default([]),
  coverLetterParagraph: z.string().min(1),
  changesSummary: z.string().optional(),
});

export type MasterResume = z.infer<typeof MasterResumeSchema>;
export type OptimizedResume = z.infer<typeof OptimizedResumeSchema>;
export type PersonalInfo = z.infer<typeof personalSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type ProjectEntry = z.infer<typeof projectEntrySchema>;

export interface RenderOptions {
  /** Off by default — adds invisible ATS block (risky). */
  includeInvisibleAtsBlock?: boolean;
}
