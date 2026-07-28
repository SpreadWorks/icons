import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const packageDirectory = resolve("packages/icons");
const manifest = JSON.parse(await readFile(resolve(packageDirectory, "package.json"), "utf8"));
const dependencyNames = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies, ...manifest.peerDependencies });

if (dependencyNames.some((name) => /fontawesome|fortawesome|pro-/i.test(name))) {
  throw new Error("The public package must not declare Font Awesome or Pro dependencies.");
}

const result = JSON.parse(
  execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: packageDirectory, encoding: "utf8" }),
);
const files = result[0]?.files?.map((file) => file.path) ?? [];
const allowed = /^(dist\/|README\.md$|LICENSE$|NOTICE$|package\.json$)/;
const unexpected = files.filter((file) => !allowed.test(file));
if (unexpected.length) throw new Error(`Unexpected public-package files: ${unexpected.join(", ")}`);
if (files.some((file) => /(^|\/)pro([-/]|$)/i.test(file))) {
  throw new Error("The public package artifact contains a prohibited Pro path.");
}
for (const required of ["README.md", "LICENSE", "NOTICE", "dist/index.js", "dist/index.d.ts"]) {
  if (!files.includes(required)) throw new Error(`Public package artifact is missing ${required}.`);
}

process.stdout.write("Public package contents and dependency policy verified.\n");
