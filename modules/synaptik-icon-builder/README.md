# @ai-ds/synaptik

AI-generated raster icon sets for AICADS (CLI + pipeline). **Not** bundled in `@ai-ds/core` npm package — see [PACKAGING.md](./PACKAGING.md).

## Documentation

- **Full guide:** [docs/synaptik-icon-builder.md](../../docs/synaptik-icon-builder.md)
- **Published assets:** [generated-icons/README.md](../../generated-icons/README.md)
- **Architecture:** [ARCHITECTURE.md](../../ARCHITECTURE.md#9-synaptik-ai-icon-builder-repo-only)

## Quick start

From repo root:

```bash
cd modules/synaptik-icon-builder && npm ci && cd ../..
cp .env.example .env
npx playwright install chromium
npm run synaptik -- run --url https://example.com
```

Set `SYNAPTIK_VISION_MODEL=google/gemini-2.0-flash-001` on OpenRouter for low-cost analyze. Icons use a **white** background; content is **blocks → cards** (see full guide).

## Module scripts

```bash
npm ci
npm run build    # tsc → dist/
npm run dev      # tsx src/cli/index.ts (same as root synaptik)
npm test         # build-prompt unit tests
```

## Web UI

```bash
cd ui && npm ci && npm run dev
```

Open http://localhost:3740 (API on :3742).
