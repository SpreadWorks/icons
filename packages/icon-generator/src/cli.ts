import { resolve } from "node:path";

import { findIconsConfig, resolveTargetDirectory } from "./config.js";
import { loadFontAwesomeIcon } from "./providers/fontawesome.js";
import { loadLucideIcon } from "./providers/lucide.js";
import { loadSvgFileIcon } from "./providers/svg-file.js";
import { writeIconModule } from "./transforms/write-icon-module.js";

type Arguments = Record<string, string | undefined>;

function parseArguments(tokens: string[]): Arguments {
  const result: Arguments = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]!;
    if (!token.startsWith("--")) throw new Error(`Unexpected argument "${token}".`);
    const key = token.slice(2);
    if (key === "output") throw new Error("--output is not supported; configure a logical target in icons.json.");
    const value = tokens[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}.`);
    result[key] = value;
    index += 1;
  }
  return result;
}

function required(args: Arguments, key: string): string {
  const value = args[key];
  if (!value) throw new Error(`--${key} is required.`);
  return value;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv[0] === "--") argv.shift();
  const [command, ...tokens] = argv;
  if (command !== "add") throw new Error('Usage: icon-generator add --provider <fontawesome|lucide|svg-file> --target <target> ...');
  const args = parseArguments(tokens);
  const provider = required(args, "provider");
  const target = required(args, "target");
  const name = args.name ?? args.icon;
  if (!name) throw new Error("--icon (or --name for svg-file) is required.");

  const generated = await (provider === "fontawesome"
    ? loadFontAwesomeIcon(required(args, "source"), name)
    : provider === "lucide"
      ? loadLucideIcon(name)
      : provider === "svg-file"
        ? loadSvgFileIcon(resolve(required(args, "file")), name)
        : Promise.reject(new Error(`Unsupported provider "${provider}".`)));
  const outputDirectory = await resolveTargetDirectory({
    configPath: args.config ? resolve(args.config) : await findIconsConfig(process.cwd()),
    target,
  });
  const source = provider === "fontawesome" ? required(args, "source") : provider;
  const directory = provider === "fontawesome" ? `fontawesome/${source}` : provider === "svg-file" ? "custom" : "lucide";
  const output = resolve(outputDirectory, `${directory}/${name}.ts`);
  await writeIconModule(generated, output);
  process.stdout.write(`Generated ${output}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
