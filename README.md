# @spreadworks/icons

`@spreadworks/icons` is a CLI that generates React icon source code into your
project. Your application imports those generated files directly; it does not
depend on this package, Font Awesome, or Lucide at runtime.

## Generate an icon

Install the CLI as a development dependency:

```sh
pnpm add -D @spreadworks/icons
```

The destination is configured in the consuming project:

```json
{
  "aliases": { "icons": "@icons" }
}
```

```json
{
  "compilerOptions": {
    "paths": { "@icons/*": ["./src/icons/*"] }
  }
}
```

```sh
pnpm exec spreadworks-icons add --provider fontawesome --source free-solid --icon chevron-right --target icons
pnpm exec spreadworks-icons add --provider lucide --icon chevron-right --target icons
pnpm exec spreadworks-icons add --provider svg-file --file ./design/brand-logo.svg --name brand-logo --target icons
```

The first command creates `src/icons/Icon.tsx`, `icon-types.ts`, and `index.ts`
as well as the requested icon module. Those files belong to your repository;
the CLI does not overwrite the runtime files once created.

Run `pnpm verify` before release. `pnpm release:check` also performs an npm
public publish dry run.
