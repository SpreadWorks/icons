import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { resolveTargetDirectory } from "../src/config.js";

test("resolves a user project's logical icon target", async () => {
  const directory = await mkdtemp(join(tmpdir(), "icons-config-"));
  await writeFile(join(directory, "icons.json"), JSON.stringify({ aliases: { icons: "@icons" } }));
  await writeFile(join(directory, "tsconfig.json"), JSON.stringify({ compilerOptions: { paths: { "@icons/*": ["./src/icons/*"] } } }));
  assert.equal(await resolveTargetDirectory({ configPath: join(directory, "icons.json"), target: "icons" }), join(directory, "src/icons"));
});
