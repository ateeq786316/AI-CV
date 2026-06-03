import { useEffect, useState } from "react";
import { apiClient } from "../lib/api";
import type { WorkflowStep } from "../components/ui/WorkflowSteps";

export function useWorkflowSteps() {
  const [hasProfile, setHasProfile] = useState(false);
  const [hasGeneration, setHasGeneration] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiClient.getProfile(), apiClient.listGenerations()])
      .then(([p, g]) => {
        setHasProfile(Boolean(p.profile));
        setHasGeneration(g.generations.length > 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const steps: WorkflowStep[] = [
    {
      id: "profile",
      title: "Master CV",
      description: "Upload or paste your CV once. AI extracts skills, jobs, and projects.",
      href: "/onboarding",
      done: hasProfile,
      current: !hasProfile,
    },
    {
      id: "job",
      title: "Job description",
      description: "Paste the role you're applying for. We optimize without inventing facts.",
      href: hasProfile ? "/generate" : "/onboarding",
      done: hasGeneration,
      current: hasProfile && !hasGeneration,
    },
    {
      id: "preview",
      title: "Review",
      description: "Check the tailored content and cover letter before exporting.",
      href: "/generate",
      done: hasGeneration,
      current: false,
    },
    {
      id: "download",
      title: "Download",
      description: "Get your PDF or LaTeX file. Same professional template every time.",
      href: "/dashboard",
      done: false,
      current: false,
    },
  ];

  return { steps, hasProfile, hasGeneration, loading };
}
