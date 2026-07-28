import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { resolveTargetDirectory } from "../src/config.js";

test("resolves a logical target through icons.json and tsconfig paths", async () => {
  const directory = await mkdtemp(join(tmpdir(), "icon-generator-"));
  await writeFile(join(directory, "icons.json"), JSON.stringify({ aliases: { icons: "@icons" } }));
  await writeFile(
    join(directory, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { paths: { "@icons/*": ["./packages/icons/src/icons/*"] } } }),
  );

  assert.equal(
    await resolveTargetDirectory({ configPath: join(directory, "icons.json"), target: "icons" }),
    join(directory, "packages/icons/src/icons"),
  );
});
