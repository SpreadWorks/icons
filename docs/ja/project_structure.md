# プロジェクト構成

<!-- {{data("monorepo.monorepo.apps", {labels: "project_structure", ignoreError: true})}} -->
<!-- {{/data}} -->

## 説明

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include the number of major directories and their roles."})}} -->

この章では、主に 4 つの作業ディレクトリーを扱います。`src` には TypeScript 製の CLI と生成ロジック、`dist` にはコンパイル済みパッケージの出力、`docs` にはドキュメント一式、`tests` には自動検証が含まれます。これらの主要ディレクトリーに加えて、`specs`、`.senti`、`.tmp` などのトップレベル フォルダーも配置されています。
<!-- {{/text}} -->

## 内容

### ディレクトリー構成

<!-- {{data("base.structure.tree")}} -->
<!-- {{/data}} -->

<!-- {{data("base.structure.directories", {header: "### Directory Responsibilities\n", labels: "Directory|Files|Role", ignoreError: true})}} -->
<!-- {{/data}} -->

### 共通ライブラリー

<!-- {{text({prompt: "List the shared libraries with class name, file path, and responsibility in table format."})}} -->

このパッケージでは TypeScript の `class` 宣言は定義しておらず、共通ライブラリーの機能はエクスポートされた関数を通じて提供されています。

| 名前 | ファイル パス | 役割 |
| --- | --- | --- |
| `findIconsConfig` | `src/config.ts` | 開始ディレクトリーから上位へたどり、`icons.json` を探します。 |
| `resolveTargetDirectory` | `src/config.ts` | `icons.json` と `tsconfig.json` に基づいて論理的な出力先を解決し、利用側プロジェクト内の出力ディレクトリーを決定します。 |
| `loadFontAwesomeIcon` | `src/providers/fontawesome.ts` | Font Awesome のアイコン パッケージ エントリーを読み込み、共通のアイコン構造へ変換し、出典テキストを付加します。 |
| `loadLucideIcon` | `src/providers/lucide.ts` | Lucide の SVG ファイルを読み込み、共通のアイコン構造へ変換します。 |
| `loadSvgFileIcon` | `src/providers/svg-file.ts` | ユーザーが指定した SVG ファイルを読み込み、共通のアイコン構造へ変換します。 |
| `svgToIconDefinition` | `src/transforms/to-icon-definition.ts` | 対応している SVG 要素を解析し、共通の `IconDefinition` 形式に変換します。 |
| `ensureRuntimeFiles` | `src/templates/runtime.ts` | 生成されるランタイム ファイルを初回のみ作成し、既存のユーザー管理の編集内容は保持します。 |
| `writeIconModule` | `src/transforms/write-icon-module.ts` | 出典情報とパス安全性の確認を行ったうえで、最終的なアイコン モジュールを設定済みの出力先ディレクトリーに書き込みます。 |
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← 技術スタックと運用](stack_and_ops.md) | [CLIコマンドリファレンス →](cli_commands.md)
<!-- {{/data}} -->
