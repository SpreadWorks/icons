<!-- {{data("base.docs.langSwitcher", {labels: "relative"})}} -->
[日本語](ja/cli_commands.md) | **English**
<!-- {{/data}} -->

# CLI Command Reference

## Description

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include the total number of commands and subcommand structure."})}} -->

This CLI exposes 1 top-level command, `add`, and it does not define any nested subcommands. The command generates React-friendly TypeScript icon modules into the target directory resolved from `icons.json` and `tsconfig.json` in the consuming project.
<!-- {{/text}} -->

## Content

### Command List

<!-- {{text({prompt: "List all commands in table format. Include command name, description, and key options. Extract comprehensively from command definitions and routing in the source code.", mode: "deep"})}} -->

| Command | Description | Key options |
| --- | --- | --- |
| `add` | Loads one icon from a supported provider, resolves the configured target directory, creates the shared runtime files if they do not already exist, and writes the generated icon module. | Required: `--provider <fontawesome|lucide|svg-file>`, `--target <target>`. Common optional: `--config <path>`. Font Awesome: `--source <free-solid|free-brands|pro-light|pro-regular|pro-solid|pro-thin|pro-duotone>`, `--icon <name>`. Lucide: `--icon <name>`. SVG file: `--file <path>`, `--name <name>`; `--icon` is also accepted because the CLI uses `--name` or `--icon` as the icon name. |
<!-- {{/text}} -->

### Global Options

<!-- {{text({prompt: "Describe global options shared by all commands in table format. Extract from argument parsing logic in the source code.", mode: "deep"})}} -->

| Option | Description | Notes |
| --- | --- | --- |
| None | The CLI does not define shared global options. | All supported flags are command-specific. The parser accepts a standalone leading `--` before the command name, but it is not treated as an option. |
| Argument format | Long options must be passed as `--key value`. | Short flags, boolean flags without values, and positional arguments after the command are not implemented. |
| Unsupported flag | `--output` is always rejected. | The CLI instructs users to configure a logical target in `icons.json` instead. |
<!-- {{/text}} -->

### Command Details

<!-- {{text({prompt: "Describe each command's usage, options, and examples in detail. Create a #### subsection for each command. Extract from argument definitions and help messages in the source code.", mode: "deep"})}} -->

#### `add`
Usage: `spreadworks-icons add --provider <fontawesome|lucide|svg-file> --target <target> [options]`

This command loads an icon from the selected provider, resolves the output directory from the consuming project's `icons.json` and `tsconfig.json`, creates shared runtime files on first use, and writes the generated icon module. If `--config` is omitted, the CLI searches upward from the current working directory for `icons.json`.

| Option | Required | Applies to | Details |
| --- | --- | --- | --- |
| `--provider <fontawesome|lucide|svg-file>` | Yes | All runs | Selects the icon source provider. Any other value fails with an unsupported provider error. |
| `--target <target>` | Yes | All runs | Looks up `aliases.<target>` in `icons.json`, then resolves the `${alias}/*` path mapping from `tsconfig.json`. The resolved directory must stay inside the project root. |
| `--config <path>` | No | All runs | Uses an explicit `icons.json` path instead of searching parent directories. |
| `--icon <name>` | Yes for `fontawesome` and `lucide` | Font Awesome, Lucide | Supplies the icon name. For Font Awesome, the CLI converts kebab-case names such as `chevron-right` to export names such as `faChevronRight`. |
| `--source <free-solid|free-brands|pro-light|pro-regular|pro-solid|pro-thin|pro-duotone>` | Yes for `fontawesome` | Font Awesome | Selects the Font Awesome package to import during generation. The written file is placed under `fontawesome/<source>/`. |
| `--file <path>` | Yes for `svg-file` | SVG file | Reads a user-supplied SVG file from the resolved file path and writes the generated module under `custom/`. |
| `--name <name>` | Yes for `svg-file` | SVG file | Sets the generated export and filename. The CLI also accepts `--icon` here because it uses `--name` first and falls back to `--icon`. |

The command writes provider-specific output paths: Font Awesome icons are written as `fontawesome/<source>/<symbol>.ts`, Lucide icons as `lucide/<name>.ts`, and SVG file icons as `custom/<name>.ts`. Runtime support files such as `Icon.tsx`, `icon-types.ts`, `index.ts`, `fontawesome/FontAwesomeIcon.tsx`, and `fontawesome/fontawesome-svg-core/styles.css` are created only if they do not already exist.

Examples:
```sh
pnpm exec spreadworks-icons add --provider fontawesome --source free-solid --icon chevron-right --target icons
pnpm exec spreadworks-icons add --provider lucide --icon chevron-right --target icons
pnpm exec spreadworks-icons add --provider svg-file --file ./design/brand-logo.svg --name brand-logo --target icons
pnpm exec spreadworks-icons add --provider fontawesome --source pro-light --icon chevron-right --target icons
```
<!-- {{/text}} -->

### Exit Codes and Output

<!-- {{text({prompt: "Define exit codes and describe stdout/stderr conventions in table format. Extract from process.exit() calls and output patterns in the source code.", mode: "deep"})}} -->

| Condition | Exit code | Stream | Output |
| --- | --- | --- | --- |
| Icon generation succeeds | `0` | `stdout` | Writes a single line in the form `Generated <outputPath>`. |
| Any handled error occurs | `1` | `stderr` | Writes the error message followed by a newline. |
| Invalid command name | `1` | `stderr` | Prints `Usage: spreadworks-icons add --provider <fontawesome|lucide|svg-file> --target <target> ...`. |
| Invalid or incomplete arguments | `1` | `stderr` | Reports the specific parsing error, such as an unexpected argument, a missing option value, a missing required option, or unsupported `--output`. |
| Configuration or provider lookup failure | `1` | `stderr` | Reports the underlying message, including missing `icons.json`, missing target aliases or path mappings, unsupported providers or Font Awesome sources, missing icons, unreadable files, invalid SVG content, or invalid generated identifiers. |
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← Project Structure](project_structure.md) | [Configuration and Customization →](configuration.md)
<!-- {{/data}} -->
