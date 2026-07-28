import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

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
  "Icon.tsx": `import { createElement, forwardRef, type SVGProps } from "react";

import type { IconDefinition, SvgNode } from "./icon-types";

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

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ icon, title, ...props }, ref): React.ReactElement {
  const accessibility = title ?? props["aria-label"] ? { role: "img" as const } : { "aria-hidden": true, focusable: false };
  return createElement(
    "svg",
    { ...accessibility, ...props, ref, fill: "currentColor", viewBox: icon.viewBox, xmlns: "http://www.w3.org/2000/svg" },
    title ? createElement("title", undefined, title) : undefined,
    ...icon.nodes.map((node, index) => renderNode(node, String(index))),
  );
});
`,
  "fontawesome/FontAwesomeIcon.tsx": `import { forwardRef, type CSSProperties, type SVGProps } from "react";

import { Icon } from "../Icon";
import type { IconDefinition } from "../icon-types";

export type FontAwesomeIconProps = Omit<SVGProps<SVGSVGElement>, "children" | "color"> & {
  icon: IconDefinition;
  color?: string;
  size?: string;
  flip?: "horizontal" | "vertical" | "both";
};

const sizeInEm: Record<string, string> = {
  xs: "0.75em",
  sm: "0.875em",
  md: "1em",
  lg: "1.333333em",
  large: "1.5em",
  xl: "1.5em",
  "2xl": "2em",
};

function resolveSize(size?: string): string | undefined {
  if (!size) return undefined;
  if (sizeInEm[size]) return sizeInEm[size];
  const multiplier = /^(\\d+(?:\\.\\d+)?)x$/.exec(size);
  return multiplier ? \`\${multiplier[1]}em\` : undefined;
}

function flipTransform(flip?: FontAwesomeIconProps["flip"]): string | undefined {
  if (flip === "horizontal") return "scaleX(-1)";
  if (flip === "vertical") return "scaleY(-1)";
  if (flip === "both") return "scale(-1)";
  return undefined;
}

export const FontAwesomeIcon = forwardRef<SVGSVGElement, FontAwesomeIconProps>(function FontAwesomeIcon(
  { icon, color, size, flip, style, ...props },
  ref,
) {
  const dimension = resolveSize(size);
  const transform = [style?.transform, flipTransform(flip)].filter(Boolean).join(" ") || undefined;
  const compatibilityStyle: CSSProperties = {
    display: "inline-block",
    verticalAlign: "-0.125em",
    ...style,
    ...(dimension ? { width: dimension, height: dimension } : {}),
    ...(transform ? { transform } : {}),
  };
  return <Icon ref={ref} icon={icon} color={color} style={compatibilityStyle} {...props} />;
});
`,
  "fontawesome/fontawesome-svg-core/styles.css": `/* Legacy import target. FontAwesomeIcon applies its supported styles directly. */
`,
  "index.ts": `export { Icon, type IconProps } from "./Icon";
export type { IconDefinition, SvgNode, SvgNodeTag } from "./icon-types";
`,
};

/** Creates editable runtime source once; existing user-owned files are preserved. */
export async function ensureRuntimeFiles(targetDirectory: string): Promise<void> {
  await mkdir(targetDirectory, { recursive: true });
  await Promise.all(
    Object.entries(files).map(async ([relativePath, content]) => {
      try {
        const outputPath = resolve(targetDirectory, relativePath);
        await mkdir(dirname(outputPath), { recursive: true });
        await writeFile(outputPath, content, { encoding: "utf8", flag: "wx" });
      } catch (error: unknown) {
        if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error;
      }
    }),
  );
}
