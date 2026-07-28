# @company/icons

`@company/icons` is a public, tree-shakeable React icon package. It contains
only renderer code, types, and generated icon definitions; it has no Font
Awesome packages or registry credentials at install or application-build time.

## Install

```sh
npm install @company/icons react
```

## Use one icon

Import an icon from its module rather than a barrel file so bundlers can retain
only the icon your application uses.

```tsx
import { Icon } from '@company/icons'
import { chevronRight } from '@company/icons/icons/fontawesome/free-solid/chevron-right'

export function NextLink() {
  return <Icon icon={chevronRight} aria-label="Next" />
}
```

## Providers

Definitions can be generated from Font Awesome Free, Lucide, and local SVG
files by the separate `@company/icon-generator` tool. The generated TypeScript
is owned by this package and uses a provider-neutral `IconDefinition` format.

## License and attribution

The renderer is MIT-licensed; see [LICENSE](./LICENSE). Generated Font Awesome
Free definitions retain CC BY 4.0 attribution in both their source header and
[NOTICE](./NOTICE). Do not add Font Awesome Pro data to this public package.
