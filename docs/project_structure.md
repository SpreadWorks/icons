<!-- {{data("base.docs.langSwitcher", {labels: "relative"})}} -->
[日本語](ja/project_structure.md) | **English**
<!-- {{/data}} -->

# Project Structure

<!-- {{data("monorepo.monorepo.apps", {labels: "project_structure", ignoreError: true})}} -->
<!-- {{/data}} -->

## Description

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include the number of major directories and their roles."})}} -->

This chapter covers four major working directories: `src` holds the TypeScript CLI and generation logic, `dist` holds the compiled package output, `docs` holds the documentation set, and `tests` holds automated verification. Additional top-level folders such as `specs`, `.senti`, and `.tmp` are also present alongside those main directories.
<!-- {{/text}} -->

## Content

### Directory Layout

<!-- {{data("base.structure.tree")}} -->
<!-- {{/data}} -->

<!-- {{data("base.structure.directories", {header: "### Directory Responsibilities\n", labels: "Directory|Files|Role", ignoreError: true})}} -->
<!-- {{/data}} -->

### Shared Libraries

<!-- {{text({prompt: "List the shared libraries with class name, file path, and responsibility in table format."})}} -->

The package does not define TypeScript `class` declarations; its shared library surface is exposed through exported functions.

| Name | File Path | Responsibility |
| --- | --- | --- |
| `findIconsConfig` | `src/config.ts` | Searches upward from a starting directory to locate `icons.json`. |
| `resolveTargetDirectory` | `src/config.ts` | Resolves a logical target from `icons.json` and `tsconfig.json` to an output directory inside the consuming project. |
| `loadFontAwesomeIcon` | `src/providers/fontawesome.ts` | Loads a Font Awesome icon package entry, converts it to the common icon structure, and attaches attribution text. |
| `loadLucideIcon` | `src/providers/lucide.ts` | Reads a Lucide SVG file and converts it to the common icon structure. |
| `loadSvgFileIcon` | `src/providers/svg-file.ts` | Reads a user-supplied SVG file and converts it to the common icon structure. |
| `svgToIconDefinition` | `src/transforms/to-icon-definition.ts` | Parses supported SVG elements into the shared `IconDefinition` shape. |
| `ensureRuntimeFiles` | `src/templates/runtime.ts` | Creates the generated runtime files once and preserves existing user-owned edits. |
| `writeIconModule` | `src/transforms/write-icon-module.ts` | Writes the final icon module into the configured target directory with attribution and path safety checks. |
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← Technology Stack and Operations](stack_and_ops.md) | [CLI Command Reference →](cli_commands.md)
<!-- {{/data}} -->
