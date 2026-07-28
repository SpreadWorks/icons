# @spreadworks/icons

<!-- {{data("cli.docs.langSwitcher", {labels: "absolute"})}} -->
[日本語](docs/ja/README.md) | **English**
<!-- {{/data}} -->

`@spreadworks/icons` is a development CLI that generates React icon source
files into a consuming project. Applications import the generated files
directly, so Font Awesome, Lucide, and this CLI are not runtime dependencies.

## Install the generator

```sh
pnpm add -D @spreadworks/icons
```

## Configure the consumer project

Create `icons.json` at the consumer project root. The logical `icons` target
must point to a TypeScript path alias rather than an arbitrary CLI output path.

```json
{
  "aliases": {
    "icons": "@icons"
  }
}
```

Configure that alias and the optional Font Awesome compatibility aliases in
`tsconfig.json`.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@icons": ["./src/icons/index.ts"],
      "@icons/*": ["./src/icons/*"],
      "@fortawesome/react-fontawesome": ["./src/icons/fontawesome/FontAwesomeIcon.tsx"],
      "@fortawesome/*": ["./src/icons/fontawesome/*"]
    }
  }
}
```

## Generate icons

The first command creates the consumer-owned runtime files:

```text
src/icons/
  Icon.tsx
  icon-types.ts
  index.ts
  fontawesome/FontAwesomeIcon.tsx
  fontawesome/fontawesome-svg-core/styles.css
```

It then adds the requested icon module below the same target.

```sh
# Font Awesome Free
pnpm exec spreadworks-icons add --provider fontawesome --source free-solid --icon chevron-right --target icons

# Lucide
pnpm exec spreadworks-icons add --provider lucide --icon chevron-right --target icons

# A local SVG file
pnpm exec spreadworks-icons add --provider svg-file --file ./design/brand-logo.svg --name brand-logo --target icons
```

For a Font Awesome Pro icon, install the licensed Pro package in the consumer
project, then run the generator. The Pro package is used only during
generation; generated Pro source must remain within the license's permitted
private distribution scope.

```sh
pnpm exec spreadworks-icons add --provider fontawesome --source pro-light --icon chevron-right --target icons
```

This produces `src/icons/fontawesome/pro-light-svg-icons/faChevronRight.ts` and exports
`faChevronRight`, matching Font Awesome's module and symbol names.

## Use generated icons

Use the provider-neutral component for new code. Any generated icon definition,
including a Font Awesome definition, can be passed to `Icon`.

```tsx
import { Icon } from "@icons";
import { chevronRight } from "@icons/lucide/chevron-right";

export function NextLink() {
  return <Icon icon={chevronRight} aria-label="Next" />;
}
```

The Font Awesome-compatible component and deep imports remain available for
incremental migration. Existing application code can retain this form after the
aliases above are configured.

```tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";

export function NextLink() {
  return <FontAwesomeIcon icon={faChevronRight} size="sm" />;
}
```

Each generated Font Awesome package also has an `index.ts` barrel, so package
imports work after the relevant icons have been generated.

```tsx
import { faFile, faFileImage } from "@fortawesome/pro-light-svg-icons";
```

`FontAwesomeIcon` supports the compatibility props used by this project:
`icon`, `size`, `color`, `style`, and `flip`. The generated runtime files are
created only when absent, so later icon generation does not overwrite the
consumer's edits.

Generated consumer TypeScript uses extensionless relative imports, which are
compatible with Next.js and webpack resolution.

## License

`@spreadworks/icons` is licensed under the [MIT License](LICENSE).

Generated icon data remains subject to its upstream license. Font Awesome Free
files retain their required CC BY 4.0 attribution, and Font Awesome Pro data
must remain within the scope permitted by its license.

<!-- {{data("cli.docs.chapters", {header: "## Documentation\n", labels: "Chapter|Summary", ignoreError: true})}} -->
## Documentation

| Chapter | Summary |
| --- | --- |
| [Tool Overview and Architecture](docs/overview.md) | @spreadworks/icons is a CLI that generates owned React SVG icon source files directly into a consuming project, so ap… |
| [Technology Stack and Operations](docs/stack_and_ops.md) | This project is a TypeScript-based ESM CLI package that generates owned, tree-shakeable React SVG icon source files f… |
| [Project Structure](docs/project_structure.md) | This chapter covers four major working directories: src holds the TypeScript CLI and generation logic, dist holds the… |
| [CLI Command Reference](docs/cli_commands.md) | This CLI exposes 1 top-level command, add, and it does not define any nested subcommands. |
| [Configuration and Customization](docs/configuration.md) | This chapter covers the two JSON files the CLI reads, icons.json and tsconfig.json, and how they work together to map… |
| [Internal Design](docs/internal_design.md) | The codebase is organized around a small TypeScript src/ tree with a CLI entry point, configuration helpers, provider… |
| [Development, Testing, and Distribution](docs/development_testing.md) | This chapter covers the practical workflow for developing the @spreadworks/icons CLI locally, testing it at both unit… |
| [Development Guide](docs/development.md) | This chapter explains how to work on the package locally, from preparing the Node.js and pnpm development environment… |
<!-- {{/data}} -->
