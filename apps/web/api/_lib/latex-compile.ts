const GLYPH_STUB = "% Minimal stub\\n\\pdfgentounicode=1\\n";

export async function compilePdfFromTex(mainTex: string): Promise<Buffer> {
  if (process.env.LATEX_COMPILE_ENABLED === "false") {
    throw new CompileError("PDF compile disabled", 501);
  }

  const response = await fetch("https://latex.ytotech.com/builds/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      compiler: "pdflatex",
      resources: [
        { path: "main.tex", content: mainTex },
        { path: "glyphtounicode.tex", content: GLYPH_STUB },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new CompileError(`LaTeX compile failed: ${errText.slice(0, 500)}`, 502);
  }

  const data = (await response.json()) as {
    pdf?: string;
    status?: string;
    log?: string;
  };

  if (data.pdf) {
    return Buffer.from(data.pdf, "base64");
  }

  throw new CompileError(data.log ?? "No PDF returned from compile service", 502);
}

export class CompileError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "CompileError";
  }
}
