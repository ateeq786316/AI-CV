const GLYPH_STUB = "% Minimal stub\n\\pdfgentounicode=1\n";

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
        {
          main: true,
          content: mainTex,
        },
        {
          path: "glyphtounicode.tex",
          content: GLYPH_STUB,
        },
      ],
    }),
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (response.ok && contentType.includes("application/pdf")) {
    return Buffer.from(await response.arrayBuffer());
  }

  const bodyText = await response.text();

  if (!response.ok) {
    let message = bodyText.slice(0, 800);
    try {
      const errJson = JSON.parse(bodyText) as { log?: string; message?: string };
      message = errJson.log ?? errJson.message ?? message;
    } catch {
      /* plain text error */
    }
    throw new CompileError(`LaTeX compile failed: ${message}`, 502);
  }

  try {
    const data = JSON.parse(bodyText) as { pdf?: string };
    if (data.pdf) {
      return Buffer.from(data.pdf, "base64");
    }
  } catch {
    /* not json */
  }

  if (bodyText.startsWith("%PDF")) {
    return Buffer.from(bodyText, "binary");
  }

  throw new CompileError(
    bodyText.slice(0, 500) || "No PDF returned from compile service",
    502,
  );
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
