import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { writeFontAwesomeBarrel } from "../src/transforms/write-fontawesome-barrel.js";

test("creates Font Awesome barrel exports without replacing existing exports", async () => {
  const directory = await mkdtemp(join(tmpdir(), "icons-fontawesome-barrel-"));
  const barrelPath = join(directory, "fontawesome/pro-light-svg-icons/index.ts");
  await mkdir(join(directory, "fontawesome/pro-light-svg-icons"), { recursive: true });
  await writeFile(barrelPath, 'export { existingIcon as faFile } from "./existing";\n');

  await writeFontAwesomeBarrel({
    targetDirectory: directory,
    outputDirectory: "fontawesome/pro-light-svg-icons",
    symbol: "faFile",
  });
  await writeFontAwesomeBarrel({
    targetDirectory: directory,
    outputDirectory: "fontawesome/pro-light-svg-icons",
    symbol: "faFileImage",
  });

  assert.equal(
    await readFile(barrelPath, "utf8"),
    'export { existingIcon as faFile } from "./existing";\nexport { faFileImage } from "./faFileImage";\n',
  );
});
