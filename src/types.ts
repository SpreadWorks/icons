export type SvgNodeTag =
  | "path"
  | "circle"
  | "rect"
  | "line"
  | "polyline"
  | "polygon"
  | "g";

export type SvgNode = {
  tag: SvgNodeTag;
  attrs: Record<string, string | number>;
  children?: SvgNode[];
};

export type IconDefinition = {
  name: string;
  viewBox: string;
  nodes: SvgNode[];
};

export type Attribution = {
  provider: "fontawesome-free" | "lucide" | "custom";
  lines: string[];
};

export type GeneratedIcon = {
  definition: IconDefinition;
  attribution: Attribution;
};
