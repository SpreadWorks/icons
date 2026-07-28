import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { ensureRuntimeFiles } from "../src/templates/runtime.js";

test("creates runtime source once and preserves user-owned edits", async () => {
  const directory = await mkdtemp(join(tmpdir(), "icons-runtime-"));
  await ensureRuntimeFiles(directory);
  for (const file of ["Icon.tsx", "icon-types.ts", "index.ts"]) {
    assert.ok((await readFile(join(directory, file), "utf8")).length > 0);
  }

  await writeFile(join(directory, "Icon.tsx"), "// user-owned change\n");
  await ensureRuntimeFiles(directory);
  assert.equal(await readFile(join(directory, "Icon.tsx"), "utf8"), "// user-owned change\n");
});
