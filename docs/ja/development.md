# 開発ガイド

<!-- {{data("monorepo.monorepo.apps", {labels: "development", ignoreError: true})}} -->
<!-- {{/data}} -->

## 概要

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include development environment setup and testing configuration."})}} -->

この章では、Node.js と `pnpm` の開発環境を整えるところから、TypeScript ソースのビルド、設定済みのテストおよび検証コマンドの実行まで、パッケージをローカルで扱う手順を説明します。あわせて、`node:test` ベースのテストファイルと、パッケージおよび利用側の検証スクリプトを組み合わせたテスト構成についても要点をまとめます。
<!-- {{/text}} -->

## 内容

### 環境構築

<!-- {{text({prompt: "Describe the local development environment setup procedure."})}} -->

`package.json` で宣言されているパッケージマネージャー `pnpm@8.15.9` を使用する Node.js 開発環境を用意してください。

このパッケージは ES モジュールの TypeScript プロジェクトです。ビルドスクリプトでは `tsc -p tsconfig.build.json` を実行し、`src` のファイルを `dist` にコンパイルします。

開発ツールチェーンは、TypeScript、`tsx`、`esbuild`、React、React DOM、Node.js および React の型パッケージを含む、プロジェクトの dependencies と devDependencies によって提供されます。
<!-- {{/text}} -->

### ローカル開発の流れ

<!-- {{text({prompt: "Describe the local development procedure (start → code → test → verify)."})}} -->

パッケージスクリプトには、ローカル起動専用のスクリプトはありません。ローカル開発では、`src` 内のパッケージソースを編集し、その後に用意されたコマンドで結果を確認する流れになります。

コードを変更したら、`pnpm build` を実行して、`tsc -p tsconfig.build.json` でパッケージをコンパイルします。

`pnpm test` を実行すると、`tests/**/*.test.ts` にある TypeScript のテストファイルを実行できます。

作業完了と判断する前に、`pnpm verify` を実行してください。このコマンドでは、ビルド、テストスイート、`tests/verify-public-package.mjs`、`tests/test-consumer.mjs` をまとめて実行し、エンドツーエンドの検証を行います。
<!-- {{/text}} -->

<!-- {{data("base.project.scripts", {header: "### Available Scripts\n", labels: "Script|Command", ignoreError: true})}} -->
### Available Scripts

| Script | Command |
| --- | --- |
| build | `tsc -p tsconfig.build.json` |
| test | `tsx --test tests/**/*.test.ts` |
| verify | `pnpm build && pnpm test && node tests/verify-public-package.mjs && node tests/test-consumer.mjs` |
| release:check | `pnpm verify && pnpm publish --dry-run --access public` |
| prepublishOnly | `pnpm verify` |
<!-- {{/data}} -->

### テスト

<!-- {{text({prompt: "Describe the test framework and how to run tests."})}} -->

自動テストスイートでは、Node.js 組み込みのテストモジュールを使用します。.test.ts ファイルでは `node:test` から `test` を、`node:assert/strict` からアサーションを取り込み、`tsx --test tests/**/*.test.ts` によって実行されます。

通常のテストファイルを実行するには `pnpm test` を使います。これらのテストでは、設定の解決、プロバイダーの読み込み、実行時のファイル生成動作、SVG 変換を確認します。

完全な検証を行うには `pnpm verify` を実行してください。このコマンドは `pnpm test` に加えて、`tests/verify-public-package.mjs` で公開マニフェストとパック対象ファイルを確認し、`tests/test-consumer.mjs` でパック済みパッケージを一時的な利用側プロジェクトにインストールしたうえで、アイコン生成、型チェック、esbuild によるバンドルまで実施します。
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← 開発、テスト、配布](development_testing.md)
<!-- {{/data}} -->
