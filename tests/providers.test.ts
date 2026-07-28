import assert from "node:assert/strict";
import test from "node:test";

import { loadFontAwesomeIcon } from "../src/providers/fontawesome.js";
import { loadLucideIcon } from "../src/providers/lucide.js";

test("loads Font Awesome Free and rejects unknown sources", async () => {
  const icon = await loadFontAwesomeIcon("free-solid", "chevron-right");
  assert.equal(icon.definition.viewBox, "0 0 320 512");
  assert.equal(icon.symbol, "faChevronRight");
  await assert.rejects(() => loadFontAwesomeIcon("not-a-source", "chevron-right"), /Unsupported Font Awesome source/);
});

test("loads Lucide into the common icon definition", async () => {
  const icon = await loadLucideIcon("chevron-right");
  assert.equal(icon.definition.viewBox, "0 0 24 24");
});
