# takahirofujii.dev (2026)

Takahiro Fujii のポートフォリオ。本人を知識グラフ(オントロジー)として表現する。

- コンセプトと技術選定: [docs/tech-stack.md](docs/tech-stack.md)
- データの単一ソース: [src/data/ontology.ts](src/data/ontology.ts)(グラフ・詳細パネル・schema.org を全て駆動)

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Quality gates

```bash
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # vitest (ontology integrity)
npm run test:e2e   # playwright (initial: npx playwright install chromium)
```

CI (GitHub Actions) runs all of the above plus a production build on every push/PR.

## i18n

`ja` (default, unprefixed) / `en` (`/en`). Locale routing lives in `src/proxy.ts`.
