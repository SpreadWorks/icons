import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

import { svgToIconDefinition } from "../transforms/to-icon-definition.js";
import type { GeneratedIcon } from "../types.js";

const require = createRequire(import.meta.url);

export async function loadLucideIcon(name: string): Promise<GeneratedIcon> {
  const filename = require.resolve(`lucide-static/icons/${name}.svg`);
  const svg = await readFile(filename, "utf8");

  return {
    definition: svgToIconDefinition(svg, name),
    attribution: {
      provider: "lucide",
      lines: [
        "Contains data derived from Lucide.",
        "Lucide is licensed under the ISC License.",
        "Converted to TypeScript by @company/icon-generator.",
      ],
    },
  };
}
