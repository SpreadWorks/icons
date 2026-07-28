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
| [Tool Overview and Architecture](docs/overview.md) | Architecture and generated-source workflow. |
| [Technology Stack and Operations](docs/stack_and_ops.md) | Dependencies, package contents, and release operations. |
| [Project Structure](docs/project_structure.md) | Source, tests, documentation, and build output. |
| [CLI Command Reference](docs/cli_commands.md) | `spreadworks-icons add` options and examples. |
| [Configuration and Customization](docs/configuration.md) | `icons.json`, `tsconfig.json`, and generation targets. |
| [Internal Design](docs/internal_design.md) | Providers, transforms, runtime templates, and output writing. |
| [Development, Testing, and Distribution](docs/development_testing.md) | Local development, tests, and publishing. |
| [Development Guide](docs/development.md) | Build and verification commands. |
<!-- {{/data}} -->
