import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile("package.json", "utf8"));
const dependencyNames = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies, ...manifest.peerDependencies });
if (manifest.name !== "@spreadworks/icons" || manifest.version !== "0.2.1" || manifest.private) {
  throw new Error("The publish manifest must describe @spreadworks/icons@0.2.1.");
}
if (dependencyNames.some((name) => /pro-/i.test(name))) {
  throw new Error("The generator must not declare a Font Awesome Pro dependency.");
}

const result = JSON.parse(execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { encoding: "utf8" }));
const files = result[0]?.files?.map((file) => file.path) ?? [];
const allowed = /^(dist\/|README\.md$|LICENSE$|NOTICE$|package\.json$)/;
const unexpected = files.filter((file) => !allowed.test(file));
if (unexpected.length) throw new Error(`Unexpected package files: ${unexpected.join(", ")}`);
for (const required of ["README.md", "LICENSE", "NOTICE", "dist/cli.js", "dist/index.js", "dist/index.d.ts"]) {
  if (!files.includes(required)) throw new Error(`Published package is missing ${required}.`);
}

process.stdout.write("Published generator artifact verified.\n");
