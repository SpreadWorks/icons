<!-- {{data("base.docs.langSwitcher", {labels: "relative"})}} -->
[日本語](ja/configuration.md) | **English**
<!-- {{/data}} -->

# Configuration and Customization

## Description

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include the types of config files, range of configurable items, and customization points."})}} -->

This chapter covers the two JSON files the CLI reads, `icons.json` and `tsconfig.json`, and how they work together to map a logical icon target to a real output directory inside a consumer project. It also summarizes the main customization points exposed by the tool: target naming, path aliasing, provider and source selection, SVG input, and the user-owned runtime files that the generator preserves.
<!-- {{/text}} -->

## Content

### Configuration Files

<!-- {{text({prompt: "List all configuration files this tool reads, including their locations and roles, in table format. Extract from file reading logic in the source code."})}} -->

| File | Location | Role |
| --- | --- | --- |
| `icons.json` | Either the path passed with `--config`, or the nearest `icons.json` found by walking upward from the current working directory | Defines logical icon targets through `aliases`; the selected `--target` must exist here. |
| `tsconfig.json` | The same directory as the resolved `icons.json` | Provides the `compilerOptions.paths` entry for the selected alias pattern (for example, `@icons/*`), which the CLI converts into the target output directory. |
<!-- {{/text}} -->

### Configuration Reference

<!-- {{text({prompt: "Describe all configuration fields in table format. Include field name, required/optional, type, default value, and description. Extract from validation logic and default value definitions in the source code.", mode: "deep"})}} -->

| File | Field | Required | Type | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `icons.json` | `aliases` | Optional in the file shape, but required in practice to resolve any target | `Record<string, string>` | None | Maps each logical target name to a TypeScript alias base. |
| `icons.json` | `aliases.<target>` | Required for the target named by `--target` | `string` | None | Alias base for that target, such as `@icons`. If it is missing, the CLI rejects the target. |
| `tsconfig.json` | `compilerOptions.paths` | Optional in the file shape, but required in practice to resolve any target | `Record<string, string[]>` | None | TypeScript path mappings consulted after the alias base is read from `icons.json`. |
| `tsconfig.json` | `compilerOptions.paths["<alias>/*"]` | Required for the alias read from `aliases.<target>` | `string[]` | None | The CLI looks up the key formed as `<alias>/*` and reads only its first array element. |
| `tsconfig.json` | `compilerOptions.paths["<alias>/*"][0]` | Required for the selected target | `string` | None | Must end with `/*`. The CLI removes that suffix, resolves the directory relative to the project root, and rejects paths that resolve outside the project root. |
The resolver code does not read `compilerOptions.paths["<alias>"]`; only the wildcard entry is required by the CLI.
<!-- {{/text}} -->

### Customization Points

<!-- {{text({prompt: "Describe items that users can customize. Extract configurable items from the source code and include configuration examples for each.", mode: "deep"})}} -->

| Customization point | What you can change | Example |
| --- | --- | --- |
| Config file location | Select a non-default `icons.json` with `--config`, or rely on automatic upward search from the current directory. | `spreadworks-icons add --provider lucide --icon chevron-right --target icons --config ./packages/app/icons.json` |
| Logical target names | Define any target keys under `aliases`, then pass the matching key to `--target`. | `{"aliases":{"icons":"@icons","admin":"@admin-icons"}}` |
| Output directory | Point each alias wildcard to any in-project directory through `tsconfig.json`. | `"@admin-icons/*": ["./src/admin/icons/*"]` |
| Provider | Choose `fontawesome`, `lucide`, or `svg-file`. | `--provider svg-file` |
| Font Awesome source | When using `fontawesome`, choose one supported source: `free-solid`, `free-brands`, `pro-light`, `pro-regular`, `pro-solid`, `pro-thin`, or `pro-duotone`. | `--provider fontawesome --source pro-light` |
| Icon naming | Use `--icon` for provider icon names, or `--name` for `svg-file` output names. | `--icon chevron-right` or `--file ./design/brand-logo.svg --name brand-logo` |
| Runtime source ownership | Edit the generated runtime files after the first run; later generations preserve existing files instead of overwriting them. | Keep local changes in `src/icons/Icon.tsx` after generation. |
Generated icon modules are written to fixed provider-specific subdirectories: `fontawesome/<source>/`, `lucide/`, and `custom/`.
<!-- {{/text}} -->

### Environment Variables

<!-- {{text({prompt: "List all environment variables referenced by the tool and their purposes in table format. Extract from process.env references in the source code.", mode: "deep"})}} -->

| Environment variable | Where referenced | Purpose |
| --- | --- | --- |
| `None` | Runtime CLI code under `src/` | The production implementation does not read any environment variables. |
Repository note: `tests/test-consumer.mjs` passes `npm_config_dry_run=false` to child processes for integration testing, but the CLI implementation does not inspect that variable directly.
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← CLI Command Reference](cli_commands.md) | [Internal Design →](internal_design.md)
<!-- {{/data}} -->
