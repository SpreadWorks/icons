# 技術スタックと運用

<!-- {{data("monorepo.monorepo.apps", {labels: "stack_and_ops", ignoreError: true})}} -->
<!-- {{/data}} -->

## 説明

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include the programming language, framework, and key tool versions."})}} -->

このプロジェクトは、TypeScript ベースの ESM CLI パッケージであり、利用側アプリケーション向けに、所有可能で tree-shakeable な React SVG アイコンのソースファイルを生成します。ワークフローは `package.json` で定義されており、TypeScript、`tsx`、esbuild を中心に構成され、各ツールのバージョン管理もそこで行われます。
<!-- {{/text}} -->

## 内容

### 技術スタック

<!-- {{text({prompt: "Describe the technology stack in table format with category, technology name, and version."})}} -->

| カテゴリ | 技術 | バージョン |
| --- | --- | --- |
| 言語 | TypeScript | `package.json` に記載 |
| 対象フレームワーク | React | 生成されるソースは React SVG アイコンモジュールを対象とします |
| パッケージ形式 | ESM CLI パッケージ (`@spreadworks/icons`) | `package.json` に記載 |
| CLI バイナリ | `spreadworks-icons` | `package.json` に記載 |
| ビルドツール | esbuild | `package.json` に記載 |
| 開発時実行ツール | `tsx` | `package.json` に記載 |
| 実行時のアイコンソース | Font Awesome packages | `package.json` に記載 |
| 実行時のアイコンソース | Lucide | `package.json` に記載 |
<!-- {{/text}} -->

### 依存関係

<!-- {{text({prompt: "Describe the project's dependency management approach."})}} -->

依存関係の管理は `package.json` に集約されており、実行時に必要な最小限の構成と開発用ツール群が分けられています。実行時依存は、コード生成に使う Font Awesome と Lucide の上流アイコンライブラリに限定されており、TypeScript、`tsx`、esbuild はビルド、テスト、検証作業を支えます。

生成されたアイコンファイルは利用側プロジェクトが保有する前提のため、生成後のアプリケーションでは、この CLI パッケージ、Font Awesome、Lucide を実行時依存として保持し続ける必要はありません。
<!-- {{/text}} -->

### デプロイの流れ

<!-- {{text({prompt: "Describe the deployment procedure and flow."})}} -->

このパッケージは、`dist` ディレクトリから型付き ESM エントリポイントを備えた公開 CLI として公開されます。公開前には `prepublishOnly` フックが完全な検証を実行するため、ビルド、テスト、利用側での検証、リリースチェックが公開ワークフローの一部として完了します。

この流れにより、公開されるパッケージはリリース前に、プロジェクトで定義された検証手順をすでに通過している状態を保てます。
<!-- {{/text}} -->

### 運用の流れ

<!-- {{text({prompt: "Describe the operations procedures."})}} -->

運用は `package.json` のスクリプトによって進められます。このプロジェクトでは、コンパイル、テスト実行、利用側での検証、リリースのドライランチェック用のスクリプトが用意されており、日常的な開発やリリース準備で一貫した運用手順を取れます。

完全な検証は、公開前に `prepublishOnly` によって自動的に強制されるため、パッケージの完全性とリリース品質の管理に役立ちます。
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← ツール概要とアーキテクチャ](overview.md) | [プロジェクト構成 →](project_structure.md)
<!-- {{/data}} -->
