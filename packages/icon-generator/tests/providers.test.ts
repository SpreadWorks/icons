import assert from "node:assert/strict";
import test from "node:test";

import { loadFontAwesomeIcon } from "../src/providers/fontawesome.js";
import { loadLucideIcon } from "../src/providers/lucide.js";

test("loads Font Awesome Free without accepting a Pro source", async () => {
  const icon = await loadFontAwesomeIcon("free-solid", "chevron-right");
  assert.equal(icon.definition.viewBox, "0 0 320 512");
  assert.equal(icon.definition.nodes[0]?.tag, "path");
  assert.equal(icon.attribution.provider, "fontawesome-free");
  await assert.rejects(() => loadFontAwesomeIcon("pro-solid", "chevron-right"), /Unsupported Font Awesome source/);
});

test("loads Lucide SVG data into the common definition", async () => {
  const icon = await loadLucideIcon("chevron-right");
  assert.equal(icon.definition.viewBox, "0 0 24 24");
  assert.ok(icon.definition.nodes.length > 0);
  assert.equal(icon.attribution.provider, "lucide");
});
