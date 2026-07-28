import { readFile } from "node:fs/promises";

import { svgToIconDefinition } from "../transforms/to-icon-definition.js";
import type { GeneratedIcon } from "../types.js";

export async function loadSvgFileIcon(file: string, name: string): Promise<GeneratedIcon> {
  return {
    definition: svgToIconDefinition(await readFile(file, "utf8"), name),
    attribution: {
      provider: "custom",
      lines: [
        "Generated from a user-supplied SVG file.",
        "Verify that the source asset may be redistributed before publishing.",
        "Converted to TypeScript by @spreadworks/icons.",
      ],
    },
  };
}
