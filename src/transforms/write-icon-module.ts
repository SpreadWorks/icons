import { mkdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

import { isWithin } from "../config.js";
import type { GeneratedIcon } from "../types.js";

function formatNodes(nodes: GeneratedIcon["definition"]["nodes"], indent = 2): string {
  const prefix = "  ".repeat(indent);
  return nodes
    .map((node) => {
      const attrs = Object.entries(node.attrs)
        .map(([key, value]) => `${prefix}    ${JSON.stringify(key)}: ${JSON.stringify(value)},`)
        .join("\n");
      const children = node.children?.length ? `,\n${prefix}  children: [\n${formatNodes(node.children, indent + 2)}\n${prefix}  ]` : "";
      return `${prefix}{\n${prefix}  tag: ${JSON.stringify(node.tag)},\n${prefix}  attrs: {\n${attrs}\n${prefix}  }${children}\n${prefix}}`;
    })
    .join(",\n");
}

function toIdentifier(name: string): string {
  const identifier = name.replace(/-([a-zA-Z0-9])/g, (_, character: string) => character.toUpperCase());
  if (!/^[A-Za-z_$][\w$]*$/.test(identifier)) throw new Error(`"${name}" cannot be used as a TypeScript identifier.`);
  return identifier;
}

export async function writeIconModule(options: {
  icon: GeneratedIcon;
  targetDirectory: string;
  outputRelativePath: string;
}): Promise<string> {
  const targetDirectory = resolve(options.targetDirectory);
  const outputPath = resolve(targetDirectory, options.outputRelativePath);
  if (!isWithin(targetDirectory, outputPath)) throw new Error("Generated icon path must stay inside the configured target.");

  const runtimeTypePath = resolve(targetDirectory, "icon-types.js");
  let typeImport = relative(dirname(outputPath), runtimeTypePath).replaceAll("\\", "/");
  if (!typeImport.startsWith(".")) typeImport = `./${typeImport}`;
  const header = options.icon.attribution.lines.map((line) => ` * ${line}`).join("\n");
  const content = `/**\n${header}\n */\nimport type { IconDefinition } from ${JSON.stringify(typeImport)};\n\nexport const ${toIdentifier(options.icon.definition.name)}: IconDefinition = {\n  name: ${JSON.stringify(options.icon.definition.name)},\n  viewBox: ${JSON.stringify(options.icon.definition.viewBox)},\n  nodes: [\n${formatNodes(options.icon.definition.nodes)}\n  ],\n};\n`;
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, content, "utf8");
  return outputPath;
}
