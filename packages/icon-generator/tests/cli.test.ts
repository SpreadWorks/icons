import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const sourceDirectory = fileURLToPath(new URL("../src/", import.meta.url));
const tsxBinary = fileURLToPath(new URL("../node_modules/.bin/tsx", import.meta.url));

test("the CLI writes an icon beneath the configured logical target", async () => {
  const directory = await mkdtemp(join(tmpdir(), "icon-generator-cli-"));
  await writeFile(join(directory, "icons.json"), JSON.stringify({ aliases: { icons: "@icons" } }));
  await writeFile(
    join(directory, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { paths: { "@icons/*": ["./generated/icons/*"] } } }),
  );
  await writeFile(join(directory, "logo.svg"), '<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>');

  const result = spawnSync(
    tsxBinary,
    [join(sourceDirectory, "cli.ts"), "add", "--provider", "svg-file", "--file", "logo.svg", "--name", "brand-logo", "--target", "icons"],
    { cwd: directory, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  const generated = await readFile(join(directory, "generated/icons/custom/brand-logo.ts"), "utf8");
  assert.match(generated, /export const brandLogo/);
  assert.match(generated, /user-supplied SVG/);
});

test("the CLI rejects arbitrary output paths", () => {
  const result = spawnSync(
    tsxBinary,
    [join(sourceDirectory, "cli.ts"), "add", "--provider", "lucide", "--icon", "x", "--target", "icons", "--output", "elsewhere"],
    { encoding: "utf8" },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--output is not supported/);
});
