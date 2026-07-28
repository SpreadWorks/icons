import assert from "node:assert/strict";
import test from "node:test";

import { svgToIconDefinition } from "../src/transforms/to-icon-definition.js";

test("converts supported SVG shape nodes", () => {
  const icon = svgToIconDefinition('<svg viewBox="0 0 24 24"><g><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></g><rect x="1" y="1" width="2" height="2"/></svg>', "sample");
  assert.equal(icon.viewBox, "0 0 24 24");
  assert.equal(icon.nodes[0]?.children?.[0]?.tag, "circle");
  assert.equal(icon.nodes[1]?.tag, "rect");
});

test("rejects unsupported SVG nodes", () => {
  assert.throws(() => svgToIconDefinition('<svg viewBox="0 0 1 1"><use href="#shape"/></svg>', "invalid"), /Unsupported SVG element/);
});
