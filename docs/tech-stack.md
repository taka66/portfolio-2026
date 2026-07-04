# portfolio-2026 技術スタック提案書

2026年リニューアル(コンセプト: オントロジー / 知識グラフ)の技術選定と構成。
前提: Vercel無料プラン、publicリポジトリ、完全静的(ランタイムでのAI/API呼び出しなし)。

## 1. スタック

| 領域 | 選定 | 版 | 理由 |
|---|---|---|---|
| Framework | **Next.js (App Router)** | 16.2 | 指定要件。SSG + `generateStaticParams` で全ページ事前生成。Turbopackがデフォルト |
| UI | React | 19.2 | Next 16同梱 |
| 言語 | TypeScript | 5.x | create-next-app 16 の互換ベースライン(TS6は時期尚早) |
| スタイル | Tailwind CSS v4 + グローバルCSS | 4.x | ステージ(canvas UI)はCSS変数ベースのグローバルCSS、文書的なページはTailwind |
| アニメーション | **motion** のみ | 12.x | 2025リポジトリで4ライブラリ→1に統一した方針を継承。グラフは手書きcanvas(依存ゼロ) |
| i18n | 自前(proxy + `[lang]`)| — | 2025リポジトリで実証済みの構成を移植(ja=無プレフィックス、/en) |
| フォント | IBM Plex Mono + Inter(next/font)| — | phosphor端末風のmono + 可読本文。日本語はシステムフォント(Hiragino/Yu Gothic) |
| Unit | Vitest | 4.x | オントロジーの整合性テスト(node環境、jsdom不要) |
| E2E | Playwright | 1.61 | スモーク+回帰。CIは本番ビルドに対して実行 |
| CI | GitHub Actions | — | lint / typecheck / unit / build / E2E。Node 22(Vercelと一致) |

## 2. Next 16 での注意点(2025リポジトリとの差分)

- **`middleware.ts` → `proxy.ts`**(export名も `proxy`、Node.jsランタイム)。ロケール検出・`/ja`正規化リダイレクトのロジックは2025年版から移植済み
- `next lint` は削除済み → `eslint` を直接実行
- dev は Turbopack がデフォルト(フラグ不要)

## 3. アーキテクチャ: オントロジーが単一ソース

```
src/data/ontology.ts   ← 唯一の真実(ノード33・トリプル41・パネル・パースログ)
        │
        ├─ OntologyGraph(canvas force-layout描画)
        ├─ EntityPanel(詳細パネル: ドロワー/ボトムシート)
        ├─ ParseLog(オープニングのトリプルストリーミング)
        └─ lib/jsonld.ts → schema.org Person(SEO構造化データ)
```

- **2層構造**: グラフ層(クリックする価値のあるエンティティのみ)+ インスタンス層(個々の講演・記事・イラストはパネル内)。拡張はまずインスタンス層へ
- 整合性はユニットテストで担保: 参照切れ・:fujii から到達不能なノード・ja/en欠落・画像欠落を検出
- ページ = 保存済みクエリのビュー。現状はトップのみ、`/works` 等は `?voice` などのクエリ実行結果として追加予定

## 4. 静的安全性(public repo / 無料プラン)

- ランタイムの外部API・シークレットなし。環境変数は `NEXT_PUBLIC_SITE_URL` のみ
- 全ルート `generateStaticParams` でSSG。proxy(旧middleware)はロケールルーティングのみ
- 依存は実行時5つ(next / react / react-dom / motion / negotiator+intl-localematcher)

## 5. 2025リポジトリから継承した教訓(コードに刻印済み)

1. **スクロール**: `overflow-x: clip`(hiddenはスクロールコンテナを作る)、`overscroll-behavior` はルートのみ
2. **言語切替はフルページナビゲーション**(Linkのプリフェッチがcookie前のリダイレクトをキャッシュする問題)
3. **CIのE2Eはワーカー1**(共有ランナーでのcanvas/CPU枯渇)
4. Vercel Analytics導入時は `/_vercel/` の404をコンソール検査から除外
5. canvasノードはE2Eから直接クリックできないため `window.__open(id)` フックを常設

## 6. ロードマップ

1. ✅ スキャフォールド(このリポジトリ): ステージ一式 + 品質ゲート
2. モバイル微調整、OGP画像、works/designの保存済みクエリビュー
3. LLM関連の取り組みをオントロジーに追記(input待ち)
4. sitemap/robots、Vercelデプロイ、takahirofujii.dev 切替
