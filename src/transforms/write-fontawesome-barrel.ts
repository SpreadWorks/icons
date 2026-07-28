import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { isWithin } from "../config.js";

function hasExportedSymbol(content: string, symbol: string): boolean {
  const declarations = content.matchAll(/\bexport\s*\{([^}]*)\}/g);
  for (const declaration of declarations) {
    for (const specifier of declaration[1]!.split(",")) {
      const match = specifier.trim().match(/^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/);
      if (match && (match[2] ?? match[1]) === symbol) return true;
    }
  }
  return false;
}

export async function writeFontAwesomeBarrel(options: {
  targetDirectory: string;
  outputDirectory: string;
  symbol: string;
}): Promise<string> {
  const targetDirectory = resolve(options.targetDirectory);
  const barrelPath = resolve(targetDirectory, options.outputDirectory, "index.ts");
  if (!isWithin(targetDirectory, barrelPath)) throw new Error("Generated Font Awesome barrel path must stay inside the configured target.");

  let content = "";
  try {
    content = await readFile(barrelPath, "utf8");
  } catch (error: unknown) {
    if (!(error instanceof Error) || !((error as NodeJS.ErrnoException).code === "ENOENT")) throw error;
  }
  if (hasExportedSymbol(content, options.symbol)) return barrelPath;

  const exportStatement = `export { ${options.symbol} } from ${JSON.stringify(`./${options.symbol}.js`)};\n`;
  await mkdir(dirname(barrelPath), { recursive: true });
  await writeFile(barrelPath, content && !content.endsWith("\n") ? `${content}\n${exportStatement}` : `${content}${exportStatement}`, "utf8");
  return barrelPath;
}
