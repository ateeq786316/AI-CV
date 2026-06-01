/** Escape text for LaTeX body (not URL hrefs). */
export function escapeLatex(value: string): string {
  const replacements: [RegExp, string][] = [
    [/\\/g, "\\textbackslash{}"],
    [/&/g, "\\&"],
    [/%/g, "\\%"],
    [/\$/g, "\\$"],
    [/#/g, "\\#"],
    [/_/g, "\\_"],
    [/{/g, "\\{"],
    [/}/g, "\\}"],
    [/~/g, "\\textasciitilde{}"],
    [/\^/g, "\\textasciicircum{}"],
  ];

  let out = value;
  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/** Normalize email/github/linkedin for \\href — keep URL-safe chars unescaped. */
export function hrefUrl(value: string): string {
  return value.replace(/\s/g, "");
}
