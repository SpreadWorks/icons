<!-- {{data("base.docs.langSwitcher", {labels: "relative"})}} -->
[日本語](ja/development.md) | **English**
<!-- {{/data}} -->

# Development Guide

<!-- {{data("monorepo.monorepo.apps", {labels: "development", ignoreError: true})}} -->
<!-- {{/data}} -->

## Description

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include development environment setup and testing configuration."})}} -->

This chapter explains how to work on the package locally, from preparing the Node.js and `pnpm` development environment to building the TypeScript sources and running the configured test and verification commands. It also summarizes the testing setup, which combines `node:test`-based test files with package and consumer verification scripts.
<!-- {{/text}} -->

## Content

### Environment Setup

<!-- {{text({prompt: "Describe the local development environment setup procedure."})}} -->

Use a Node.js development environment with `pnpm@8.15.9`, which is the package manager declared in `package.json`.

The package is an ES module TypeScript project. Its build script runs `tsc -p tsconfig.build.json`, compiling files from `src` into `dist`.

The development toolchain is provided through the project dependencies and devDependencies, including TypeScript, `tsx`, `esbuild`, React, React DOM, and the Node.js and React type packages.
<!-- {{/text}} -->

### Local Development Workflow

<!-- {{text({prompt: "Describe the local development procedure (start → code → test → verify)."})}} -->

There is no separate local start script in the package scripts. Local development centers on editing the package sources in `src` and then validating the results with the provided commands.

After making code changes, run `pnpm build` to compile the package with `tsc -p tsconfig.build.json`.

Run `pnpm test` to execute the TypeScript test files in `tests/**/*.test.ts`.

Before considering the work complete, run `pnpm verify`. This command runs the build, the test suite, `tests/verify-public-package.mjs`, and `tests/test-consumer.mjs` as one end-to-end verification flow.
<!-- {{/text}} -->

<!-- {{data("base.project.scripts", {header: "### Available Scripts\n", labels: "Script|Command", ignoreError: true})}} -->
### Available Scripts

| Script | Command |
| --- | --- |
| build | `tsc -p tsconfig.build.json` |
| test | `tsx --test tests/**/*.test.ts` |
| verify | `pnpm build && pnpm test && node tests/verify-public-package.mjs && node tests/test-consumer.mjs` |
| release:check | `pnpm publish --dry-run --access public` |
| prepublishOnly | `pnpm verify` |
<!-- {{/data}} -->

### Testing

<!-- {{text({prompt: "Describe the test framework and how to run tests."})}} -->

The automated test suite uses Node.js built-in testing modules. The `.test.ts` files import `test` from `node:test` and assertions from `node:assert/strict`, and they are executed through `tsx --test tests/**/*.test.ts`.

Run `pnpm test` to execute the standard test files. These tests cover configuration resolution, provider loading, runtime file generation behavior, and SVG conversion.

Run `pnpm verify` for the full validation flow. In addition to `pnpm test`, it runs `tests/verify-public-package.mjs` to check the publish manifest and packed files, and `tests/test-consumer.mjs` to install the packed package into a temporary consumer project, generate icons, type-check the result, and bundle it with esbuild.
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← Development, Testing, and Distribution](development_testing.md)
<!-- {{/data}} -->
