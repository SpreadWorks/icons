import { createElement, type SVGProps } from "react";

import type { IconDefinition, SvgNode } from "./icon-types.js";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  icon: IconDefinition;
  title?: string;
};

const reactAttributeNames: Record<string, string> = {
  class: "className",
  "clip-path": "clipPath",
  "fill-rule": "fillRule",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
};

function toReactAttributes(attrs: SvgNode["attrs"]): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(attrs).map(([name, value]) => [reactAttributeNames[name] ?? name, value]),
  );
}

function renderNode(node: SvgNode, key: string): React.ReactElement {
  return createElement(
    node.tag,
    { ...toReactAttributes(node.attrs), key },
    node.children?.map((child, index) => renderNode(child, `${key}-${index}`)),
  );
}

export function Icon({ icon, title, ...props }: IconProps): React.ReactElement {
  const accessibleName = title ?? props["aria-label"];
  const accessibilityProps = accessibleName
    ? { role: "img" as const }
    : { "aria-hidden": true, focusable: false };

  return createElement(
    "svg",
    {
      ...accessibilityProps,
      ...props,
      viewBox: icon.viewBox,
      xmlns: "http://www.w3.org/2000/svg",
    },
    title ? createElement("title", undefined, title) : undefined,
    ...icon.nodes.map((node, index) => renderNode(node, String(index))),
  );
}
