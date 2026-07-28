import type { GeneratedIcon } from "../types.js";

const packages = {
  "free-solid": "@fortawesome/free-solid-svg-icons",
  "free-brands": "@fortawesome/free-brands-svg-icons",
  "pro-light": "@fortawesome/pro-light-svg-icons",
  "pro-regular": "@fortawesome/pro-regular-svg-icons",
  "pro-solid": "@fortawesome/pro-solid-svg-icons",
  "pro-thin": "@fortawesome/pro-thin-svg-icons",
  "pro-duotone": "@fortawesome/pro-duotone-svg-icons",
} as const;

type FontAwesomeSource = keyof typeof packages;

export function fontAwesomeOutputDirectory(source: string): string {
  if (!(source in packages)) {
    throw new Error(`Unsupported Font Awesome source "${source}".`);
  }

  return packages[source as FontAwesomeSource].replace("@fortawesome/", "");
}

function toExportName(name: string): string {
  return `fa${name
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join("")}`;
}

export async function loadFontAwesomeIcon(source: string, name: string): Promise<GeneratedIcon> {
  const outputDirectory = fontAwesomeOutputDirectory(source);
  const module = (await import(`@fortawesome/${outputDirectory}`)) as Record<string, unknown>;
  const definition = module[toExportName(name)] as { icon?: [number, number, unknown, unknown, string | string[]] } | undefined;
  if (!definition?.icon) throw new Error(`Font Awesome ${source} does not contain "${name}".`);

  const [width, height, , , pathData] = definition.icon;
  const symbol = toExportName(name);
  const isPro = source.startsWith("pro-");
  return {
    definition: {
      name,
      viewBox: `0 0 ${width} ${height}`,
      nodes: (Array.isArray(pathData) ? pathData : [pathData]).map((d) => ({ tag: "path", attrs: { d } })),
    },
    symbol,
    attribution: isPro
      ? {
          provider: "custom",
          lines: [
            "Contains data derived from Font Awesome Pro.",
            "Do not redistribute this file outside the scope permitted by your Font Awesome license.",
            "Converted to TypeScript by @spreadworks/icons.",
          ],
        }
      : {
          provider: "fontawesome-free",
          lines: [
            "Contains data derived from Font Awesome Free.",
            "© Fonticons, Inc. — CC BY 4.0",
            "https://creativecommons.org/licenses/by/4.0/",
            "Converted to TypeScript by @spreadworks/icons.",
          ],
        },
  };
}
