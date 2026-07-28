import type { IconDefinition, SvgNode } from "../types.js";

const permittedTags = new Set(["path", "circle", "rect", "line", "polyline", "polygon", "g"]);
type StackEntry = { children: SvgNode[] };

function parseAttributes(input: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const match of input.matchAll(/([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g)) {
    const [, name, rawValue] = match;
    if (name) attributes[name] = rawValue ? rawValue.replace(/^("|')|("|')$/g, "") : "";
  }
  return attributes;
}

export function svgToIconDefinition(svg: string, name: string): IconDefinition {
  const root: StackEntry = { children: [] };
  const stack: StackEntry[] = [root];
  let viewBox: string | undefined;

  for (const token of svg.match(/<!--[\s\S]*?-->|<[^>]+>/g) ?? []) {
    if (token.startsWith("<!--") || token.startsWith("<?") || token.startsWith("<!")) continue;
    if (token.startsWith("</")) {
      stack.pop();
      if (stack.length === 0) throw new Error("SVG contains an unmatched closing tag.");
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
    if (!permittedTags.has(tagName)) throw new Error(`Unsupported SVG element <${tagName}>. Convert it to supported shapes first.`);
    const node: SvgNode = { tag: tagName as SvgNode["tag"], attrs };
    stack[stack.length - 1]!.children.push(node);
    if (!selfClosing) {
      node.children = [];
      stack.push({ children: node.children });
    }
  }
  if (stack.length !== 1) throw new Error("SVG contains an unclosed element.");
  if (!viewBox) throw new Error("SVG must declare a viewBox or width and height.");
  return { name, viewBox, nodes: root.children };
}
