# 設定とカスタマイズ

## 説明

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include the types of config files, range of configurable items, and customization points."})}} -->

この章では、CLI が読み込む 2 つの JSON ファイル `icons.json` と `tsconfig.json` を取り上げ、これらがどのように連携して、論理的なアイコンターゲットを利用側プロジェクト内の実際の出力ディレクトリへ対応付けるのかを説明します。あわせて、ツールで調整できる主な項目として、ターゲット名、パスエイリアス、プロバイダーとソースの選択、SVG 入力、そしてジェネレーターが保持するユーザー管理のランタイムファイルについて要点をまとめます。
<!-- {{/text}} -->

## 内容

### 設定ファイル

<!-- {{text({prompt: "List all configuration files this tool reads, including their locations and roles, in table format. Extract from file reading logic in the source code."})}} -->

| ファイル | 場所 | 役割 |
| --- | --- | --- |
| `icons.json` | `--config` で渡したパス、または現在の作業ディレクトリから上位へたどって見つかった最も近い `icons.json` | `aliases` を通じて論理的なアイコンターゲットを定義します。`--target` で選んだ値はここに存在している必要があります。 |
| `tsconfig.json` | 解決済みの `icons.json` と同じディレクトリ | 選択したエイリアスパターン（たとえば `@icons/*`）に対応する `compilerOptions.paths` を提供し、CLI はこれをターゲットの出力ディレクトリへ変換します。 |
<!-- {{/text}} -->

### 設定リファレンス

<!-- {{text({prompt: "Describe all configuration fields in table format. Include field name, required/optional, type, default value, and description. Extract from validation logic and default value definitions in the source code.", mode: "deep"})}} -->

| ファイル | フィールド | 必須 | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- | --- |
| `icons.json` | `aliases` | ファイル構造上は任意ですが、実際にターゲットを解決するには必要です | `Record<string, string>` | なし | 各論理ターゲット名を TypeScript のエイリアスベースに対応付けます。 |
| `icons.json` | `aliases.<target>` | `--target` で指定したターゲットには必須です | `string` | なし | そのターゲットに対応するエイリアスベースです。例: `@icons`。これがない場合、CLI はそのターゲットを受け付けません。 |
| `tsconfig.json` | `compilerOptions.paths` | ファイル構造上は任意ですが、実際にターゲットを解決するには必要です | `Record<string, string[]>` | なし | `icons.json` から読み取ったエイリアスベースに続いて参照される TypeScript のパスマッピングです。 |
| `tsconfig.json` | `compilerOptions.paths["<alias>/*"]` | `aliases.<target>` から読み取ったエイリアスには必須です | `string[]` | なし | CLI は `<alias>/*` という形式のキーを参照し、その配列の先頭要素だけを読み取ります。 |
| `tsconfig.json` | `compilerOptions.paths["<alias>/*"][0]` | 選択したターゲットには必須です | `string` | なし | `/*` で終わっている必要があります。CLI はその接尾辞を取り除き、プロジェクトルートからの相対パスとしてディレクトリを解決し、解決先がプロジェクトルート外になる場合は拒否します。 |
リゾルバーのコードは `compilerOptions.paths["<alias>"]` を読み取りません。CLI に必要なのはワイルドカード付きのエントリーだけです。
<!-- {{/text}} -->

### カスタマイズポイント

<!-- {{text({prompt: "Describe items that users can customize. Extract configurable items from the source code and include configuration examples for each.", mode: "deep"})}} -->

| カスタマイズ項目 | 変更できる内容 | 例 |
| --- | --- | --- |
| 設定ファイルの場所 | `--config` で既定以外の `icons.json` を選ぶことも、現在のディレクトリから上位への自動検索に任せることもできます。 | `spreadworks-icons add --provider lucide --icon chevron-right --target icons --config ./packages/app/icons.json` |
| 論理ターゲット名 | `aliases` の下に任意のターゲットキーを定義し、対応するキーを `--target` に渡せます。 | `{"aliases":{"icons":"@icons","admin":"@admin-icons"}}` |
| 出力ディレクトリ | 各エイリアスのワイルドカードを `tsconfig.json` を通じてプロジェクト内の任意のディレクトリへ向けられます。 | `"@admin-icons/*": ["./src/admin/icons/*"]` |
| プロバイダー | `fontawesome`、`lucide`、`svg-file` から選べます。 | `--provider svg-file` |
| Font Awesome のソース | `fontawesome` を使う場合は、対応しているソース `free-solid`、`free-brands`、`pro-light`、`pro-regular`、`pro-solid`、`pro-thin`、`pro-duotone` から 1 つ選べます。 | `--provider fontawesome --source pro-light` |
| アイコン名 | プロバイダーのアイコン名には `--icon` を使い、`svg-file` の出力名には `--name` を使います。 | `--icon chevron-right` または `--file ./design/brand-logo.svg --name brand-logo` |
| ランタイムソースの管理権 | 初回実行後は生成されたランタイムファイルを編集できます。以後の生成では既存ファイルは上書きされず、そのまま保持されます。 | 生成後に `src/icons/Icon.tsx` へ加えたローカル変更を保持できます。 |
生成されるアイコンモジュールの出力先は、プロバイダーごとの固定サブディレクトリ `fontawesome/<source>/`、`lucide/`、`custom/` です。
<!-- {{/text}} -->

### 環境変数

<!-- {{text({prompt: "List all environment variables referenced by the tool and their purposes in table format. Extract from process.env references in the source code.", mode: "deep"})}} -->

| 環境変数 | 参照箇所 | 目的 |
| --- | --- | --- |
| `None` | `src/` 配下の実行時 CLI コード | 本番用の実装では環境変数を読み取りません。 |
リポジトリに関する注記: `tests/test-consumer.mjs` では統合テストのために子プロセスへ `npm_config_dry_run=false` を渡していますが、CLI の実装自体はこの変数を直接参照していません。
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← CLIコマンドリファレンス](cli_commands.md) | [内部設計 →](internal_design.md)
<!-- {{/data}} -->
