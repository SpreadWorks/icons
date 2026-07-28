<!-- {{data("base.docs.langSwitcher", {labels: "relative"})}} -->
[日本語](ja/development_testing.md) | **English**
<!-- {{/data}} -->

# Development, Testing, and Distribution

## Description

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include local development environment setup, testing strategy, and release flow."})}} -->

This chapter covers the practical workflow for developing the `@spreadworks/icons` CLI locally, testing it at both unit and package-consumer levels, and preparing a verified npm release.
It combines environment setup, everyday execution paths, automated validation, and the publish checks defined in the project metadata.
<!-- {{/text}} -->

## Content

### Local Development Setup

```bash
git clone <repository>
cd <project>
npm link          # Register as global command
<command> help    # Verify installation
```

<!-- {{text({prompt: "Explain how to run the tool itself during development and how changes are immediately reflected."})}} -->

The package exposes the `spreadworks-icons` command through `dist/cli.js`, so a linked global command runs the built output rather than the TypeScript source.
For direct development work, run the CLI entry point with `tsx`, for example `pnpm exec tsx src/cli.ts add --provider lucide --icon chevron-right --target icons`.
Because `tsx` executes the source files directly, rerunning the command picks up code changes immediately.
If you are testing the linked command instead, rebuild first with `pnpm build` so that `dist/cli.js` reflects the latest source changes.
<!-- {{/text}} -->

### Branch Strategy and Commit Conventions

<!-- {{text({prompt: "Describe branch management and commit message format. Extract from merge settings and commit conventions in the source code."})}} -->

Git is configured with a single tracked branch: local `main` pulls from `origin` and merges against `refs/heads/main`.
No additional branch rules or alternate tracked branches are defined in the repository config.
Recent commit subjects use short plain-English summary lines such as `Consolidate icons into a single generator` and `Support release dry-run verification`.
Those messages are written in sentence case and do not use Conventional Commit prefixes such as `feat:` or `fix:`.
<!-- {{/text}} -->

### Testing

<!-- {{text({prompt: "Describe the testing strategy, framework used, and how to run tests. Extract from the test directory structure and test runner configuration in the source code.", mode: "deep"})}} -->

The test suite uses the Node.js built-in test runner (`node:test`) and is executed through `tsx` with the `pnpm test` script: `tsx --test tests/**/*.test.ts`.
Unit tests are organized by behavior in `tests/config.test.ts`, `tests/providers.test.ts`, `tests/runtime.test.ts`, and `tests/svg-to-icon-definition.test.ts`.
These tests cover target-directory resolution, provider loading, runtime file generation behavior, and SVG-to-icon conversion validation.
The broader verification flow is `pnpm verify`, which runs `pnpm build`, the unit tests, `tests/verify-public-package.mjs`, and `tests/test-consumer.mjs`.
`verify-public-package.mjs` checks the publish manifest and packed file list, while `test-consumer.mjs` installs the packed tarball into a temporary consumer project, runs the CLI, type-checks the generated code, and bundles a sample entry with esbuild.
<!-- {{/text}} -->

### Release Flow

```bash
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0
npm publish         # Publish to npm registry
```

<!-- {{text({prompt: "Describe the release procedure. Derive from publish settings and npm scripts in the source code."})}} -->

Releases are intended for the public npm registry defined in `publishConfig.registry`, with public access set by `publishConfig.access`.
Before publishing, run `pnpm verify` to build the package, execute the unit tests, validate the packed artifact, and run the consumer smoke test.
For a full rehearsal, `pnpm release:check` runs that verification chain and then performs `pnpm publish --dry-run --access public`.
When `npm publish` is used for the actual release, the `prepublishOnly` script automatically runs `pnpm verify` first.
Only the files listed in `files` are published: `dist`, `README.md`, `LICENSE`, and `NOTICE`.
<!-- {{/text}} -->

### Technology Stack and Dependencies

<!-- {{text({prompt: "Describe the programming language, runtime version requirements, and dependency policy. Extract from package.json."})}} -->

The package is an ES module package (`"type": "module"`) built from TypeScript sources, with `typescript` listed in `devDependencies` and compiled by the `build` script.
`package.json` does not declare an `engines` field, so it does not enforce a specific Node.js or npm runtime version through the manifest.
The project does pin its package manager to `pnpm@8.15.9` with the `packageManager` field.
Runtime dependencies are kept narrow and focused on icon source libraries: `@fortawesome/free-brands-svg-icons`, `@fortawesome/free-solid-svg-icons`, and `lucide-static`.
Tooling and development-only packages, including `tsx`, `esbuild`, `typescript`, `react`, `react-dom`, and the type packages, are kept in `devDependencies` rather than `dependencies`. 
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← Internal Design](internal_design.md) | [Development Guide →](development.md)
<!-- {{/data}} -->
