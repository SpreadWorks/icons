import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { GeneratedIcon } from "../types.js";

function formatValue(value: string | number): string {
  return JSON.stringify(value);
}

function formatNodes(nodes: GeneratedIcon["definition"]["nodes"], indent = 2): string {
  const prefix = "  ".repeat(indent);
  return nodes
    .map((node) => {
      const attrs = Object.entries(node.attrs)
        .map(([key, value]) => `${prefix}    ${JSON.stringify(key)}: ${formatValue(value)},`)
        .join("\n");
      const children = node.children?.length
        ? `,\n${prefix}  children: [\n${formatNodes(node.children, indent + 2)}\n${prefix}  ]`
        : "";
      return `${prefix}{\n${prefix}  tag: ${JSON.stringify(node.tag)},\n${prefix}  attrs: {\n${attrs}\n${prefix}  }${children}\n${prefix}}`;
    })
    .join(",\n");
}

export async function writeIconModule(icon: GeneratedIcon, outputPath: string): Promise<void> {
  const header = icon.attribution.lines.map((line) => ` * ${line}`).join("\n");
  const content = `/**\n${header}\n */\nimport type { IconDefinition } from "@spreadworks/icons";\n\nexport const ${toIdentifier(icon.definition.name)}: IconDefinition = {\n  name: ${JSON.stringify(icon.definition.name)},\n  viewBox: ${JSON.stringify(icon.definition.viewBox)},\n  nodes: [\n${formatNodes(icon.definition.nodes)}\n  ],\n};\n`;
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, content, "utf8");
}

function toIdentifier(name: string): string {
  const identifier = name.replace(/-([a-zA-Z0-9])/g, (_, character: string) => character.toUpperCase());
  if (!/^[A-Za-z_$][\w$]*$/.test(identifier)) throw new Error(`"${name}" cannot be used as a TypeScript identifier.`);
  return identifier;
}
