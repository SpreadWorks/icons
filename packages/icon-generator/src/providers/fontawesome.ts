import type { GeneratedIcon } from "../types.js";

const packages = {
  "free-solid": "@fortawesome/free-solid-svg-icons",
  "free-brands": "@fortawesome/free-brands-svg-icons",
} as const;

type FontAwesomeSource = keyof typeof packages;

function toExportName(name: string): string {
  return `fa${name
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join("")}`;
}

export async function loadFontAwesomeIcon(source: string, name: string): Promise<GeneratedIcon> {
  if (!(source in packages)) {
    throw new Error(`Unsupported Font Awesome source "${source}". Use free-solid or free-brands.`);
  }

  const module = (await import(packages[source as FontAwesomeSource])) as Record<string, unknown>;
  const definition = module[toExportName(name)] as { icon?: [number, number, unknown, unknown, string | string[]] } | undefined;
  if (!definition?.icon) throw new Error(`Font Awesome ${source} does not contain "${name}".`);

  const [width, height, , , pathData] = definition.icon;
  const paths = Array.isArray(pathData) ? pathData : [pathData];
  return {
    definition: {
      name,
      viewBox: `0 0 ${width} ${height}`,
      nodes: paths.map((d) => ({ tag: "path", attrs: { d } })),
    },
    attribution: {
      provider: "fontawesome-free",
      lines: [
        "Contains data derived from Font Awesome Free.",
        "© Fonticons, Inc. — CC BY 4.0",
        "https://creativecommons.org/licenses/by/4.0/",
        "Converted to TypeScript by @company/icon-generator.",
      ],
    },
  };
}
