# @spreadworks/icons

`@spreadworks/icons` は、利用先プロジェクトへ React アイコンのソース
ファイルを生成する開発用 CLI です。アプリケーションは生成済みのファイルを
直接 import するため、Font Awesome、Lucide、この CLI は実行時依存になりません。

## ジェネレーターをインストールする

```sh
pnpm add -D @spreadworks/icons
```

## 利用先プロジェクトを設定する

利用先プロジェクトのルートに `icons.json` を作成します。論理ターゲットの
`icons` は、任意の CLI 出力パスではなく TypeScript の path alias を指す必要があります。

```json
{
  "aliases": {
    "icons": "@icons"
  }
}
```

`tsconfig.json` では、この alias と必要に応じて Font Awesome 互換用 alias を設定します。

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@icons": ["./src/icons/index.ts"],
      "@icons/*": ["./src/icons/*"],
      "@fortawesome/react-fontawesome": ["./src/icons/fontawesome/FontAwesomeIcon.tsx"],
      "@fortawesome/*": ["./src/icons/fontawesome/*"]
    }
  }
}
```

## アイコンを生成する

最初のコマンドは、利用先プロジェクトが所有するランタイムファイルを作成します。

```text
src/icons/
  Icon.tsx
  icon-types.ts
  index.ts
  fontawesome/FontAwesomeIcon.tsx
  fontawesome/fontawesome-svg-core/styles.css
```

その後、指定したアイコンのモジュールを同じターゲット配下に追加します。

```sh
# Font Awesome Free
pnpm exec spreadworks-icons add --provider fontawesome --source free-solid --icon chevron-right --target icons

# Lucide
pnpm exec spreadworks-icons add --provider lucide --icon chevron-right --target icons

# ローカル SVG ファイル
pnpm exec spreadworks-icons add --provider svg-file --file ./design/brand-logo.svg --name brand-logo --target icons
```

Font Awesome Pro のアイコンは、利用先プロジェクトにライセンス済みの Pro パッケージを
インストールしてから生成します。Pro パッケージは生成時にだけ使われ、生成した Pro の
ソースは Font Awesome ライセンスで許可された非公開の配布範囲に留める必要があります。

```sh
pnpm exec spreadworks-icons add --provider fontawesome --source pro-light --icon chevron-right --target icons
```

この例では `src/icons/fontawesome/pro-light-svg-icons/faChevronRight.ts` が作成され、
Font Awesome のモジュール名・シンボル名と同じ `faChevronRight` を export します。

## 生成したアイコンを使う

新規コードではプロバイダー非依存のコンポーネントを使います。Font Awesome を含む、
任意の生成済みアイコン定義を `Icon` に渡せます。

```tsx
import { Icon } from "@icons";
import { chevronRight } from "@icons/lucide/chevron-right";

export function NextLink() {
  return <Icon icon={chevronRight} aria-label="次へ" />;
}
```

段階的な移行のため、Font Awesome 互換コンポーネントと深い import も使用できます。
上記の alias を設定すれば、既存のアプリケーションコードは次の形式のまま使えます。

```tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";

export function NextLink() {
  return <FontAwesomeIcon icon={faChevronRight} size="sm" />;
}
```

`FontAwesomeIcon` は、このプロジェクトで使う互換 props である `icon`、`size`、
`color`、`style`、`flip` をサポートします。ランタイムファイルは存在しないときだけ
作成されるため、以後のアイコン生成で利用者による編集が上書きされることはありません。

## ライセンス

`@spreadworks/icons` は [MIT License](LICENSE) で提供します。

生成したアイコンデータには、上流のライセンスが引き続き適用されます。Font Awesome
Free のファイルには CC BY 4.0 で必要な帰属表示が残り、Font Awesome Pro のデータは
ライセンスで許可された範囲内に留める必要があります。
