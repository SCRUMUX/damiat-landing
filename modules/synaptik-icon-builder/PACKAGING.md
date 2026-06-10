# @ai-ds/synaptik — packaging

Companion to **@ai-ds/core**. Not included in the core npm `files` list.

## Monorepo (AICADS-PRO checkout)

```bash
npm run synaptik -- <command>
npm run synaptik:check
cd modules/synaptik-icon-builder && npm run build   # CLI dist/
```

## Consumer PRO landing (install with design system)

Install both packages from the **same git tag**:

```bash
npm install git+https://github.com/SCRUMUX/AICADS-PRO.git#v0.7.6
npm install "github:SCRUMUX/AICADS-PRO#v0.7.6&path:modules/synaptik-icon-builder"
```

Or copy the starter from `templates/consumer-pro/` in the AICADS-PRO repo.

1. Install `@ai-ds/core` + `@ai-ds/synaptik`
2. Add `synaptik.config.json` (see `synaptik.config.example.json` in AICADS-PRO root)
3. `.env` in the **product repo root** (`FAL_KEY`, vision keys)
4. `npx synaptik run --url https://yoursite` → publish → commit `outputDir`
5. Storybook: `createMainConfig({ generatedIconsDir: 'src/assets/generated-icons' })`
6. App: `icons.manifest.ts` + `GeneratedIcon` / `FeaturesBlock`

Full guide: [docs/synaptik-pro-project.md](../../docs/synaptik-pro-project.md) (in AICADS-PRO).

### Web UI

The UI (ports 3740/3742) is not in the npm tarball (Playwright weight). Options:

- Clone AICADS-PRO and run **`npm run synaptik:ui -- --workspace /path/to/product`** (variant A: shared `.env` via `SYNAPTIK_ENV_FILE` in `synaptik.local.env`), or
- `cd modules/synaptik-icon-builder/ui && npm run dev:reset` with `SYNAPTIK_WORKSPACE_ROOT` + `SYNAPTIK_ENV_FILE` set manually, or
- Use CLI only via `npx synaptik` (keys in product or shared `.env` via `loadSynaptikEnv`).

## npm pack / publish

```bash
cd modules/synaptik-icon-builder && npm run build && npm pack
```

Peer: `@ai-ds/core` (optional for CLI; required for Synaptik UI components).
