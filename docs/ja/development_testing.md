# 開発、テスト、配布

## 概要

<!-- {{text({prompt: "Write a 1-2 sentence overview of this chapter. Include local development environment setup, testing strategy, and release flow."})}} -->

この章では、`@spreadworks/icons` CLI をローカルで開発し、ユニットテストとパッケージ利用者の両方の観点から検証し、確認済みの npm リリースを準備するための実践的な手順を説明します。
環境構築、日常的な実行方法、自動検証、そしてプロジェクトのメタデータで定義された公開前チェックをまとめて扱います。
<!-- {{/text}} -->

## 内容

### ローカル開発環境のセットアップ

```bash
git clone <repository>
cd <project>
npm link          # Register as global command
<command> help    # Verify installation
```

<!-- {{text({prompt: "Explain how to run the tool itself during development and how changes are immediately reflected."})}} -->

このパッケージは `dist/cli.js` を通じて `spreadworks-icons` コマンドを公開しているため、`npm link` で登録したグローバルコマンドは TypeScript のソースではなくビルド済みの出力を実行します。
開発中に直接動作確認する場合は、CLI のエントリーポイントを `tsx` で実行します。たとえば `pnpm exec tsx src/cli.ts add --provider lucide --icon chevron-right --target icons` のように実行できます。
`tsx` はソースファイルをそのまま実行するため、コマンドを再実行するだけでコードの変更がすぐに反映されます。
一方、リンクしたコマンドを使って確認する場合は、`dist/cli.js` に最新の変更が反映されるよう、先に `pnpm build` で再ビルドしてください。
<!-- {{/text}} -->

### ブランチ戦略とコミットの慣例

<!-- {{text({prompt: "Describe branch management and commit message format. Extract from merge settings and commit conventions in the source code."})}} -->

Git では追跡対象のブランチが 1 つだけ設定されており、ローカルの `main` は `origin` から pull し、`refs/heads/main` に対してマージするようになっています。
リポジトリ設定には、追加のブランチルールや別の追跡ブランチは定義されていません。
最近のコミット件名には、`Consolidate icons into a single generator` や `Support release dry-run verification` のような、短い平易な英語の要約行が使われています。
これらのメッセージは文頭のみ大文字の通常文で書かれており、`feat:` や `fix:` のような Conventional Commit の接頭辞は使っていません。
<!-- {{/text}} -->

### テスト

<!-- {{text({prompt: "Describe the testing strategy, framework used, and how to run tests. Extract from the test directory structure and test runner configuration in the source code.", mode: "deep"})}} -->

テストスイートには Node.js 組み込みのテストランナー（`node:test`）を使用しており、`pnpm test` スクリプトから `tsx --test tests/**/*.test.ts` を実行します。
ユニットテストは振る舞いごとに `tests/config.test.ts`、`tests/providers.test.ts`、`tests/runtime.test.ts`、`tests/svg-to-icon-definition.test.ts` に整理されています。
これらのテストでは、ターゲットディレクトリの解決、プロバイダーの読み込み、実行時のファイル生成の挙動、SVG からアイコン定義への変換の妥当性を確認します。
より広い検証フローとして `pnpm verify` が用意されており、`pnpm build`、ユニットテスト、`tests/verify-public-package.mjs`、`tests/test-consumer.mjs` を順に実行します。
`verify-public-package.mjs` では公開対象のマニフェストとパッケージ化されるファイル一覧を確認し、`test-consumer.mjs` では生成した tarball を一時的な利用側プロジェクトにインストールして CLI を実行し、生成コードの型チェックと、サンプルエントリーの esbuild によるバンドルまで行います。
<!-- {{/text}} -->

### リリース手順

```bash
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0
npm publish         # Publish to npm registry
```

<!-- {{text({prompt: "Describe the release procedure. Derive from publish settings and npm scripts in the source code."})}} -->

リリース先は `publishConfig.registry` で指定された公開 npm レジストリで、アクセス設定は `publishConfig.access` により public に設定されています。
公開前には `pnpm verify` を実行し、パッケージのビルド、ユニットテスト、パッケージ化成果物の検証、利用側のスモークテストを行います。
一連の手順を通しで確認するには、`pnpm release:check` を実行します。これにより検証フロー全体を実行したうえで、`pnpm publish --dry-run --access public` まで行われます。
実際のリリースで `npm publish` を使う場合は、`prepublishOnly` スクリプトによって事前に `pnpm verify` が自動実行されます。
公開されるのは `files` に列挙されたファイルのみで、対象は `dist`、`README.md`、`LICENSE`、`NOTICE` です。
<!-- {{/text}} -->

### 技術スタックと依存関係

<!-- {{text({prompt: "Describe the programming language, runtime version requirements, and dependency policy. Extract from package.json."})}} -->

このパッケージは ES モジュール形式のパッケージ（`"type": "module"`）で、TypeScript のソースから構築されています。`typescript` は `devDependencies` に含まれており、`build` スクリプトでコンパイルされます。
`package.json` には `engines` フィールドが定義されていないため、マニフェスト上では特定の Node.js や npm の実行時バージョンは強制していません。
一方で、使用するパッケージマネージャーは `packageManager` フィールドにより `pnpm@8.15.9` に固定されています。
実行時依存関係は最小限に絞られており、主にアイコンソースのライブラリである `@fortawesome/free-brands-svg-icons`、`@fortawesome/free-solid-svg-icons`、`lucide-static` が含まれます。
`tsx`、`esbuild`、`typescript`、`react`、`react-dom`、各種型パッケージなどのツール類や開発専用パッケージは、`dependencies` ではなく `devDependencies` に配置されています。 
<!-- {{/text}} -->

---

<!-- {{data("base.docs.nav")}} -->
[← 内部設計](internal_design.md) | [開発ガイド →](development.md)
<!-- {{/data}} -->
