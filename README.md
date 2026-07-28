# Spreadworks icons

This workspace separates a public, reusable icon package from its private
generation tool:

- [`@spreadworks/icons`](./packages/icons) contains the React renderer, public
  types, and generated icon modules. It has no Font Awesome dependency or
  token at application build time.
- [`@spreadworks/icon-generator`](./packages/icon-generator) imports provider data
  only while updating icon modules. It resolves the configured logical target
  in `icons.json`; it never accepts an arbitrary output path.

## Generate an icon

The destination is configured in the consuming project, rather than embedded
in the generator:

```json
{
  "aliases": { "icons": "@icons" }
}
```

```json
{
  "compilerOptions": {
    "paths": { "@icons/*": ["./packages/icons/src/icons/*"] }
  }
}
```

```sh
pnpm --filter @spreadworks/icon-generator run generate -- add \
  --provider fontawesome --source free-solid --icon chevron-right --target icons
pnpm --filter @spreadworks/icon-generator run generate -- add \
  --provider lucide --icon chevron-right --target icons
pnpm --filter @spreadworks/icon-generator run generate -- add \
  --provider svg-file --file ./design/brand-logo.svg --name brand-logo --target icons
```

Run `pnpm verify` before release. It builds and tests both packages, verifies
the public artifact through `npm pack --dry-run`, and rejects Font Awesome or
Pro dependencies from the public manifest.

Run `pnpm release:check` to perform the same verification plus an npm public
publish dry run. After authenticating to npmjs with publish permission for the
`@spreadworks` scope, publish with `pnpm --filter @spreadworks/icons publish --access public`.
