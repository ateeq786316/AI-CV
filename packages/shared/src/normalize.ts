/** Coerce messy Gemini JSON into shape expected by MasterResumeSchema. */
export function normalizeMasterResumeRaw(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") {
    return { schemaVersion: 1 };
  }

  const o = { ...(raw as Record<string, unknown>) };
  o.schemaVersion = 1;

  o.skillGroups = normalizeSkillGroups(o);
  o.experience = normalizeExperience(o.experience);
  o.projects = normalizeProjects(o.projects);
  o.education = normalizeEducation(o.education);
  o.certificates = normalizeCertificates(o.certificates);
  o.personal = normalizePersonal(o.personal);
  o.summary = typeof o.summary === "string" ? o.summary : String(o.summary ?? "");

  return o;
}

function normalizeBullets(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((b) => String(b).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n|•|·/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeSkillGroups(o: Record<string, unknown>): unknown[] {
  let groups = o.skillGroups;

  if (!Array.isArray(groups) && Array.isArray(o.skills)) {
    const flat = (o.skills as unknown[]).map(String).filter(Boolean);
    if (flat.length) {
      return [{ label: "Technical Skills", items: flat }];
    }
  }

  if (!Array.isArray(groups)) return [{ label: "Technical Skills", items: [] }];

  const normalized = groups.map((g, i) => {
    const grp = (g ?? {}) as Record<string, unknown>;
    const label = String(
      grp.label ?? grp.category ?? grp.name ?? `Skills ${i + 1}`,
    ).trim();
    let items = grp.items ?? grp.skills ?? grp.values ?? grp.keywords;
    if (typeof items === "string") {
      items = items.split(/,|;|\n/).map((s) => s.trim());
    }
    const list = Array.isArray(items)
      ? items.map(String).map((s) => s.trim()).filter(Boolean)
      : [];
    return { label, items: list };
  });

  const withItems = normalized.filter((g) => g.items.length > 0);
  if (withItems.length > 0) return withItems;

  const merged = normalized.flatMap((g) => g.items);
  if (merged.length > 0) {
    return [{ label: "Technical Skills", items: merged }];
  }

  return [{ label: "Technical Skills", items: ["See resume text"] }];
}

function normalizeExperience(value: unknown): unknown[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((e) => {
      const ex = (e ?? {}) as Record<string, unknown>;
      const company = String(
        ex.company ?? ex.employer ?? ex.organization ?? "",
      ).trim();
      const role = String(
        ex.role ?? ex.title ?? ex.position ?? ex.jobTitle ?? ex.heading ?? "",
      ).trim();
      if (!company && !role) return null;

      let bullets = normalizeBullets(
        ex.bullets ?? ex.points ?? ex.responsibilities ?? ex.descriptions,
      );
      const stack = ex.stack ? String(ex.stack) : "";
      if (!bullets.length && stack) {
        bullets = [`Worked with ${stack}`];
      }

      const entry: Record<string, unknown> = {
        company: company || "Company",
        role: role || company || "Role",
        location: ex.location ? String(ex.location) : undefined,
        startDate: ex.startDate ? String(ex.startDate) : undefined,
        endDate:
          ex.endDate === "Present"
            ? "Present"
            : ex.endDate
              ? String(ex.endDate)
              : undefined,
        dateLabel: ex.dateLabel ? String(ex.dateLabel) : undefined,
        stack: stack || undefined,
        bullets,
      };

      if (!entry.dateLabel && !entry.endDate && !entry.startDate) {
        entry.dateLabel = "Present";
      }

      return entry;
    })
    .filter(
      (e): e is Record<string, unknown> =>
        Boolean(e && (e as { bullets?: string[] }).bullets?.length),
    );
}

function normalizeProjects(value: unknown): unknown[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const projects = value
    .map((p) => {
      if (!p) return null;
      const proj = (p ?? {}) as Record<string, unknown>;
      const name = String(
        proj.name ?? proj.title ?? proj.project ?? proj.heading ?? "",
      ).trim();
      if (!name) return null;
      let bullets = normalizeBullets(
        proj.bullets ?? proj.points ?? proj.description ?? proj.details,
      );
      const stack = proj.stack ? String(proj.stack) : "";
      if (!bullets.length && stack) {
        bullets = [`Technologies: ${stack}`];
      }

      return {
        name,
        startDate: proj.startDate ? String(proj.startDate) : undefined,
        endDate: proj.endDate ? String(proj.endDate) : undefined,
        stack: stack || undefined,
        bullets,
      };
    })
    .filter((p) => Boolean(p && p.name && p.bullets.length > 0));

  return projects.length ? projects : undefined;
}

function normalizeEducation(value: unknown): unknown[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [{ degree: "Education", institution: "See resume" }];
  }
  return value.map((e) => {
    const ed = (e ?? {}) as Record<string, unknown>;
    return {
      degree: String(ed.degree ?? ed.qualification ?? "Degree").trim(),
      institution: String(
        ed.institution ?? ed.school ?? ed.university ?? "Institution",
      ).trim(),
      startDate: ed.startDate ? String(ed.startDate) : undefined,
      endDate: ed.endDate ? String(ed.endDate) : undefined,
      details: Array.isArray(ed.details)
        ? ed.details.map(String)
        : ed.gpa
          ? [String(ed.gpa)]
          : undefined,
    };
  });
}

function normalizeCertificates(value: unknown): unknown[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const certs = value
    .map((c) => {
      if (typeof c === "string") return { name: c };
      const cert = (c ?? {}) as Record<string, unknown>;
      const name = String(cert.name ?? cert.title ?? "").trim();
      if (!name) return null;
      return {
        name,
        issuer: cert.issuer ? String(cert.issuer) : undefined,
        date: cert.date ? String(cert.date) : undefined,
      };
    })
    .filter(Boolean);
  return certs.length ? certs : undefined;
}

function normalizePersonal(value: unknown): Record<string, unknown> {
  const p = (value ?? {}) as Record<string, unknown>;
  return {
    fullName: String(p.fullName ?? p.name ?? "Your Name").trim(),
    title: String(p.title ?? p.headline ?? "Professional").trim(),
    phone: p.phone ? String(p.phone) : undefined,
    email: p.email ? String(p.email) : undefined,
    github: p.github ? String(p.github) : undefined,
    linkedin: p.linkedin ? String(p.linkedin) : undefined,
    website: p.website ? String(p.website) : undefined,
    location: p.location ? String(p.location) : undefined,
  };
}
