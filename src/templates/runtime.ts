import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const files: Record<string, string> = {
  "icon-types.ts": `export type SvgNodeTag =
  | "path"
  | "circle"
  | "rect"
  | "line"
  | "polyline"
  | "polygon"
  | "g";

export type SvgNode = {
  tag: SvgNodeTag;
  attrs: Record<string, string | number>;
  children?: SvgNode[];
};

export type IconDefinition = {
  name: string;
  viewBox: string;
  nodes: SvgNode[];
};
`,
  "Icon.tsx": `import { createElement, type SVGProps } from "react";

import type { IconDefinition, SvgNode } from "./icon-types.js";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  icon: IconDefinition;
  title?: string;
};

const reactAttributeNames: Record<string, string> = {
  class: "className",
  "clip-path": "clipPath",
  "fill-rule": "fillRule",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
};

function renderNode(node: SvgNode, key: string): React.ReactElement {
  const attrs: Record<string, string | number> = {};
  for (const name in node.attrs) attrs[reactAttributeNames[name] ?? name] = node.attrs[name]!;
  return createElement(node.tag, { ...attrs, key }, node.children?.map((child, index) => renderNode(child, \`\${key}-\${index}\`)));
}

export function Icon({ icon, title, ...props }: IconProps): React.ReactElement {
  const accessibility = title ?? props["aria-label"] ? { role: "img" as const } : { "aria-hidden": true, focusable: false };
  return createElement(
    "svg",
    { ...accessibility, ...props, viewBox: icon.viewBox, xmlns: "http://www.w3.org/2000/svg" },
    title ? createElement("title", undefined, title) : undefined,
    ...icon.nodes.map((node, index) => renderNode(node, String(index))),
  );
}
`,
  "index.ts": `export { Icon, type IconProps } from "./Icon.js";
export type { IconDefinition, SvgNode, SvgNodeTag } from "./icon-types.js";
`,
};

/** Creates editable runtime source once; existing user-owned files are preserved. */
export async function ensureRuntimeFiles(targetDirectory: string): Promise<void> {
  await mkdir(targetDirectory, { recursive: true });
  await Promise.all(
    Object.entries(files).map(async ([relativePath, content]) => {
      try {
        await writeFile(resolve(targetDirectory, relativePath), content, { encoding: "utf8", flag: "wx" });
      } catch (error: unknown) {
        if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error;
      }
    }),
  );
}
