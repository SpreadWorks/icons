<!-- {{data("base.docs.langSwitcher", {labels: "relative"})}} -->
[日本語](ja/stack_and_ops.md) | **English**
<!-- {{/data}} -->

# Technology Stack and Operations

<!-- {{data("monorepo.monorepo.apps", {labels: "stack_and_ops", ignoreError: true})}} -->
<!-- {{/data}} -->

## Description

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include the programming language, framework, and key tool versions."})}} -->

This project is a TypeScript-based ESM CLI package that generates owned, tree-shakeable React SVG icon source files for consumer applications. Its workflow is defined in `package.json` and centers on TypeScript, `tsx`, and esbuild, with tool versions managed there.
<!-- {{/text}} -->

## Content

### Technology Stack

<!-- {{text({prompt: "Describe the technology stack in table format with category, technology name, and version."})}} -->

| Category | Technology | Version |
| --- | --- | --- |
| Language | TypeScript | Declared in `package.json` |
| Target framework | React | Generated source targets React SVG icon modules |
| Package format | ESM CLI package (`@spreadworks/icons`) | Declared in `package.json` |
| CLI binary | `spreadworks-icons` | Declared in `package.json` |
| Build tooling | esbuild | Declared in `package.json` |
| Dev execution tooling | `tsx` | Declared in `package.json` |
| Runtime icon sources | Font Awesome packages | Declared in `package.json` |
| Runtime icon sources | Lucide | Declared in `package.json` |
<!-- {{/text}} -->

### Dependencies

<!-- {{text({prompt: "Describe the project's dependency management approach."})}} -->

Dependency management is centralized in `package.json`, which separates a small runtime surface from development tooling. Runtime dependencies are limited to upstream icon libraries from Font Awesome and Lucide for code generation, while TypeScript, `tsx`, and esbuild support build, test, and verification tasks.

The generated icon files are intended to be owned by the consumer project, so applications do not need to keep this CLI package, Font Awesome, or Lucide as runtime dependencies after generation.
<!-- {{/text}} -->

### Deployment Flow

<!-- {{text({prompt: "Describe the deployment procedure and flow."})}} -->

The package is published as a public CLI with typed ESM entry points from the `dist` directory. Before publication, the `prepublishOnly` hook runs a full verification pass so build, test, consumer verification, and release checks are completed as part of the publish workflow.

This flow helps ensure that the published package has already passed the project’s defined validation steps before release.
<!-- {{/text}} -->

### Operations Flow

<!-- {{text({prompt: "Describe the operations procedures."})}} -->

Operations are script-driven through `package.json`. The project provides scripts for compilation, test execution, consumer verification, and dry-run release checks, giving maintainers a consistent operational path for routine development and release preparation.

A full verification pass is enforced automatically before publishing through `prepublishOnly`, which supports package integrity and release quality control.
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← Tool Overview and Architecture](overview.md) | [Project Structure →](project_structure.md)
<!-- {{/data}} -->
