import { execFileSync } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";

const consumerDirectory = await mkdtemp(join(tmpdir(), "spreadworks-icons-consumer-"));
const packageDirectory = resolve("packages/icons");
const packed = JSON.parse(
  execFileSync("npm", ["pack", "--json", "--pack-destination", consumerDirectory, "--ignore-scripts"], {
    cwd: packageDirectory,
    encoding: "utf8",
    env: { ...process.env, npm_config_dry_run: "false" },
  }),
);
const tarball = join(consumerDirectory, packed[0].filename);

await writeFile(
  join(consumerDirectory, "package.json"),
  JSON.stringify({ name: "icons-consumer-smoke-test", private: true, type: "module" }),
);
await writeFile(
  join(consumerDirectory, "bundle-entry.ts"),
  'import { chevronRight } from "@spreadworks/icons/icons/fontawesome/free-solid/chevron-right"; export { chevronRight };',
);
execFileSync(
  "npm",
  [
    "install",
    "--ignore-scripts",
    "--no-package-lock",
    tarball,
    "react@^18.3.1",
    "@types/react@^18.3.0",
    "typescript@^5.6.0",
  ],
  { cwd: consumerDirectory, stdio: "inherit" },
);

await writeFile(
  join(consumerDirectory, "index.tsx"),
  [
    'import { Icon } from "@spreadworks/icons";',
    'import { chevronRight } from "@spreadworks/icons/icons/fontawesome/free-solid/chevron-right";',
    "",
    "export const nextIcon = <Icon icon={chevronRight} aria-label=\"Next\" />;",
  ].join("\n"),
);
await writeFile(
  join(consumerDirectory, "tsconfig.json"),
  JSON.stringify({
    compilerOptions: {
      strict: true,
      noEmit: true,
      jsx: "react-jsx",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      skipLibCheck: true,
    },
  }),
);
execFileSync(join(consumerDirectory, "node_modules/.bin/tsc"), ["-p", "tsconfig.json"], {
  cwd: consumerDirectory,
  stdio: "inherit",
});
const bundle = await build({
  entryPoints: [join(consumerDirectory, "bundle-entry.ts")],
  bundle: true,
  format: "esm",
  minify: true,
  platform: "browser",
  write: false,
});
const bundledCode = bundle.outputFiles[0]?.text ?? "";
if (!bundledCode.includes("chevron-right") || bundledCode.includes("xmark")) {
  throw new Error("A one-icon consumer bundle did not retain only the requested icon module.");
}
execFileSync(
  process.execPath,
  [
    "--input-type=module",
    "--eval",
    'import { Icon } from "@spreadworks/icons"; import { chevronRight } from "@spreadworks/icons/icons/fontawesome/free-solid/chevron-right"; if (typeof Icon !== "function" || chevronRight.name !== "chevron-right") process.exit(1);',
  ],
  { cwd: consumerDirectory, stdio: "inherit" },
);

process.stdout.write("Packed package installs, type-checks, imports, and tree-shakes from a standalone consumer.\n");
