# CLIコマンドリファレンス

## 説明

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include the total number of commands and subcommand structure."})}} -->

このCLIには最上位コマンドとして `add` が1つだけ用意されており、入れ子のサブコマンドは定義されていません。このコマンドは、利用側プロジェクトの `icons.json` と `tsconfig.json` から解決した対象ディレクトリに、Reactで扱いやすい TypeScript のアイコンモジュールを生成します。
<!-- {{/text}} -->

## 内容

### コマンド一覧

<!-- {{text({prompt: "List all commands in table format. Include command name, description, and key options. Extract comprehensively from command definitions and routing in the source code.", mode: "deep"})}} -->

| コマンド | 説明 | 主なオプション |
| --- | --- | --- |
| `add` | 対応するプロバイダーから1つのアイコンを読み込み、設定済みの対象ディレクトリを解決し、共有ランタイムファイルが未作成なら生成したうえで、生成済みアイコンモジュールを書き込みます。 | 必須: `--provider <fontawesome|lucide|svg-file>`, `--target <target>`。共通の任意指定: `--config <path>`。Font Awesome: `--source <free-solid|free-brands|pro-light|pro-regular|pro-solid|pro-thin|pro-duotone>`, `--icon <name>`。Lucide: `--icon <name>`。SVG file: `--file <path>`, `--name <name>`。CLIは `--name` または `--icon` をアイコン名として扱うため、`--icon` も使用できます。 |
<!-- {{/text}} -->

### グローバルオプション

<!-- {{text({prompt: "Describe global options shared by all commands in table format. Extract from argument parsing logic in the source code.", mode: "deep"})}} -->

| オプション | 説明 | 備考 |
| --- | --- | --- |
| なし | このCLIには、すべてのコマンドで共通して使えるグローバルオプションは定義されていません。 | すべての対応フラグはコマンドごとに定義されています。パーサーはコマンド名の前に単独の `--` があっても受け付けますが、オプションとしては扱いません。 |
| 引数形式 | 長い形式のオプションは `--key value` の形で渡す必要があります。 | 短縮フラグ、値を伴わない真偽値フラグ、コマンド後ろの位置引数には対応していません。 |
| 非対応フラグ | `--output` は常に拒否されます。 | 代わりに `icons.json` で論理ターゲットを設定するよう案内されます。 |
<!-- {{/text}} -->

### コマンド詳細

<!-- {{text({prompt: "Describe each command's usage, options, and examples in detail. Create a #### subsection for each command. Extract from argument definitions and help messages in the source code.", mode: "deep"})}} -->

#### `add`
使用法: `spreadworks-icons add --provider <fontawesome|lucide|svg-file> --target <target> [options]`

このコマンドは、選択したプロバイダーからアイコンを読み込み、利用側プロジェクトの `icons.json` と `tsconfig.json` から出力先ディレクトリを解決し、初回利用時には共有ランタイムファイルを作成したうえで、生成済みアイコンモジュールを書き込みます。`--config` を省略すると、CLIは現在の作業ディレクトリから上位方向へ `icons.json` を探索します。

| オプション | 必須 | 対象 | 詳細 |
| --- | --- | --- | --- |
| `--provider <fontawesome|lucide|svg-file>` | はい | すべての実行 | アイコンの取得元プロバイダーを選択します。これ以外の値を指定すると、未対応プロバイダーとして失敗します。 |
| `--target <target>` | はい | すべての実行 | `icons.json` の `aliases.<target>` を参照し、その後 `tsconfig.json` の `${alias}/*` パスマッピングを解決します。解決後のディレクトリは、プロジェクトルート内に収まっている必要があります。 |
| `--config <path>` | いいえ | すべての実行 | 親ディレクトリを探索する代わりに、明示的な `icons.json` のパスを使用します。 |
| `--icon <name>` | `fontawesome` と `lucide` では必須 | Font Awesome, Lucide | アイコン名を指定します。Font Awesome では、CLIが `chevron-right` のような kebab-case 名を `faChevronRight` のようなエクスポート名に変換します。 |
| `--source <free-solid|free-brands|pro-light|pro-regular|pro-solid|pro-thin|pro-duotone>` | `fontawesome` では必須 | Font Awesome | 生成時にインポートする Font Awesome パッケージを選択します。書き込まれるファイルは `fontawesome/<source>/` 配下に配置されます。 |
| `--file <path>` | `svg-file` では必須 | SVG file | 解決済みファイルパスから、ユーザー指定のSVGファイルを読み込み、生成したモジュールを `custom/` 配下に書き込みます。 |
| `--name <name>` | `svg-file` では必須 | SVG file | 生成されるエクスポート名とファイル名を設定します。CLIはまず `--name` を使い、なければ `--icon` を使うため、ここでは `--icon` も受け付けます。 |

このコマンドは、プロバイダーごとに異なる出力パスへ書き込みます。Font Awesome のアイコンは `fontawesome/<source>/<symbol>.ts`、Lucide のアイコンは `lucide/<name>.ts`、SVG file のアイコンは `custom/<name>.ts` に出力されます。`Icon.tsx`、`icon-types.ts`、`index.ts`、`fontawesome/FontAwesomeIcon.tsx`、`fontawesome/fontawesome-svg-core/styles.css` などのランタイム補助ファイルは、まだ存在しない場合にのみ作成されます。

例:
```sh
pnpm exec spreadworks-icons add --provider fontawesome --source free-solid --icon chevron-right --target icons
pnpm exec spreadworks-icons add --provider lucide --icon chevron-right --target icons
pnpm exec spreadworks-icons add --provider svg-file --file ./design/brand-logo.svg --name brand-logo --target icons
pnpm exec spreadworks-icons add --provider fontawesome --source pro-light --icon chevron-right --target icons
```
<!-- {{/text}} -->

### 終了コードと出力

<!-- {{text({prompt: "Define exit codes and describe stdout/stderr conventions in table format. Extract from process.exit() calls and output patterns in the source code.", mode: "deep"})}} -->

| 条件 | 終了コード | ストリーム | 出力 |
| --- | --- | --- | --- |
| アイコン生成に成功 | `0` | `stdout` | `Generated <outputPath>` 形式の1行を出力します。 |
| 処理済みのエラーが発生 | `1` | `stderr` | エラーメッセージに改行を付けて出力します。 |
| 無効なコマンド名 | `1` | `stderr` | `Usage: spreadworks-icons add --provider <fontawesome|lucide|svg-file> --target <target> ...` を出力します。 |
| 無効または不完全な引数 | `1` | `stderr` | 想定外の引数、オプション値の欠落、必須オプションの不足、未対応の `--output` など、具体的な解析エラーを報告します。 |
| 設定またはプロバイダー解決の失敗 | `1` | `stderr` | `icons.json` の欠落、対象エイリアスやパスマッピングの不足、未対応のプロバイダーや Font Awesome のソース、見つからないアイコン、読み取れないファイル、不正なSVG内容、無効な生成識別子など、根本原因のメッセージを報告します。 |
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← プロジェクト構成](project_structure.md) | [設定とカスタマイズ →](configuration.md)
<!-- {{/data}} -->
