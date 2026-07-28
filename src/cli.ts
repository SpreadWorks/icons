#!/usr/bin/env node
import { resolve } from "node:path";

import { findIconsConfig, resolveTargetDirectory } from "./config.js";
import { fontAwesomeOutputDirectory, loadFontAwesomeIcon } from "./providers/fontawesome.js";
import { loadLucideIcon } from "./providers/lucide.js";
import { loadSvgFileIcon } from "./providers/svg-file.js";
import { ensureRuntimeFiles } from "./templates/runtime.js";
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
  if (!args[key]) throw new Error(`--${key} is required.`);
  return args[key]!;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv[0] === "--") argv.shift();
  const [command, ...tokens] = argv;
  if (command !== "add") throw new Error('Usage: spreadworks-icons add --provider <fontawesome|lucide|svg-file> --target <target> ...');
  const args = parseArguments(tokens);
  const provider = required(args, "provider");
  const name = args.name ?? args.icon;
  if (!name) throw new Error("--icon (or --name for svg-file) is required.");

  const fontAwesomeSource = provider === "fontawesome" ? required(args, "source") : undefined;
  const icon = await (provider === "fontawesome"
    ? loadFontAwesomeIcon(fontAwesomeSource!, name)
    : provider === "lucide"
      ? loadLucideIcon(name)
      : provider === "svg-file"
        ? loadSvgFileIcon(resolve(required(args, "file")), name)
        : Promise.reject(new Error(`Unsupported provider "${provider}".`)));
  const targetDirectory = await resolveTargetDirectory({
    configPath: args.config ? resolve(args.config) : await findIconsConfig(process.cwd()),
    target: required(args, "target"),
  });
  await ensureRuntimeFiles(targetDirectory);
  const directory = provider === "fontawesome" ? `fontawesome/${fontAwesomeOutputDirectory(fontAwesomeSource!)}` : provider === "svg-file" ? "custom" : "lucide";
  const filename = provider === "fontawesome" ? icon.symbol! : name;
  const outputPath = await writeIconModule({ icon, targetDirectory, outputRelativePath: `${directory}/${filename}.ts` });
  process.stdout.write(`Generated ${outputPath}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
