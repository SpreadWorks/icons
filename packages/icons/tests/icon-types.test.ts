import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Icon } from "../src/Icon.js";
import { chevronRight } from "../src/icons/fontawesome/free-solid/chevron-right.js";

test("a generated icon uses the provider-neutral definition", () => {
  assert.equal(chevronRight.name, "chevron-right");
  assert.equal(chevronRight.viewBox, "0 0 320 512");
  assert.deepEqual(chevronRight.nodes[0]?.tag, "path");
});

test("the renderer supports every node in the common SVG model", () => {
  const markup = renderToStaticMarkup(
    createElement(Icon, {
      title: "Shape sample",
      icon: {
        name: "shape-sample",
        viewBox: "0 0 24 24",
        nodes: [
          { tag: "path", attrs: { d: "M1 1", "stroke-linecap": "round" } },
          { tag: "circle", attrs: { cx: 3, cy: 3, r: 2 } },
          { tag: "rect", attrs: { x: 1, y: 1, width: 2, height: 2 } },
          { tag: "line", attrs: { x1: 1, y1: 1, x2: 2, y2: 2 } },
          { tag: "polyline", attrs: { points: "1,1 2,2" } },
          { tag: "polygon", attrs: { points: "1,1 2,2 3,1" } },
          { tag: "g", attrs: { fill: "none" }, children: [{ tag: "path", attrs: { d: "M2 2" } }] },
        ],
      },
    }),
  );

  for (const tag of ["path", "circle", "rect", "line", "polyline", "polygon", "g"]) {
    assert.match(markup, new RegExp(`<${tag}`));
  }
  assert.match(markup, /<title>Shape sample<\/title>/);
  assert.match(markup, /stroke-linecap="round"/);
});
