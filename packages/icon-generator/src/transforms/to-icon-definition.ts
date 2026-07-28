import type { IconDefinition, SvgNode } from "../types.js";

const permittedTags = new Set(["path", "circle", "rect", "line", "polyline", "polygon", "g"]);

type StackEntry = { node?: SvgNode; children: SvgNode[] };

function parseAttributes(input: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;

  for (const match of input.matchAll(pattern)) {
    const [, name, rawValue] = match;
    if (!name) continue;
    const value = rawValue ? rawValue.replace(/^("|')|("|')$/g, "") : "";
    attributes[name] = value;
  }

  return attributes;
}

/** Converts the supported, shape-only subset of SVG into an IconDefinition. */
export function svgToIconDefinition(svg: string, name: string): IconDefinition {
  const tags = svg.match(/<!--[\s\S]*?-->|<[^>]+>/g) ?? [];
  const root: StackEntry = { children: [] };
  const stack: StackEntry[] = [root];
  let viewBox: string | undefined;

  for (const token of tags) {
    if (token.startsWith("<!--") || token.startsWith("<?") || token.startsWith("<!")) continue;
    if (token.startsWith("</")) {
      const closed = stack.pop();
      if (!closed || stack.length === 0) throw new Error("SVG contains an unmatched closing tag.");
      continue;
    }

    const match = /^<([A-Za-z][\w:-]*)([\s\S]*?)\/?\s*>$/.exec(token);
    if (!match) throw new Error(`Cannot parse SVG token: ${token}`);
    const [, tagName, attributeText] = match;
    const attrs = parseAttributes(attributeText);
    const selfClosing = /\/\s*>$/.test(token);

    if (tagName === "svg") {
      viewBox = attrs.viewBox ?? (attrs.width && attrs.height ? `0 0 ${attrs.width} ${attrs.height}` : undefined);
      if (!selfClosing) stack.push({ children: stack[stack.length - 1]!.children });
      continue;
    }

    if (!permittedTags.has(tagName)) {
      throw new Error(`Unsupported SVG element <${tagName}>. Convert it to supported shapes first.`);
    }

    const node: SvgNode = { tag: tagName as SvgNode["tag"], attrs };
    stack[stack.length - 1]!.children.push(node);
    if (!selfClosing) {
      const children: SvgNode[] = [];
      node.children = children;
      stack.push({ node, children });
    }
  }

  if (stack.length !== 1) throw new Error("SVG contains an unclosed element.");
  if (!viewBox) throw new Error("SVG must declare a viewBox or width and height.");

  return { name, viewBox, nodes: root.children };
}
