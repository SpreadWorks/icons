export { findIconsConfig, resolveTargetDirectory } from "./config.js";
export { loadFontAwesomeIcon } from "./providers/fontawesome.js";
export { loadLucideIcon } from "./providers/lucide.js";
export { loadSvgFileIcon } from "./providers/svg-file.js";
export { ensureRuntimeFiles } from "./templates/runtime.js";
export { svgToIconDefinition } from "./transforms/to-icon-definition.js";
export { writeFontAwesomeBarrel } from "./transforms/write-fontawesome-barrel.js";
export { writeIconModule } from "./transforms/write-icon-module.js";
export type { Attribution, GeneratedIcon, IconDefinition, SvgNode, SvgNodeTag } from "./types.js";
