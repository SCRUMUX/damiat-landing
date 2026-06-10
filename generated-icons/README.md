# Generated icons (Synaptik AI Icon Builder)

Raster icons produced by `synaptik publish` or **«Опубликовать все готовые»** in the UI.

Previews before publish live only in `.synaptik/sessions/{id}/renders/` (not in this folder).

**Guide:** [docs/synaptik-icon-builder.md](../docs/synaptik-icon-builder.md)

**Storybook:** open **Generated Icons → Synaptik guide** for how to launch the generator and sync this catalog into builds.

Layout:

```
generated-icons/
  {projectSlug}/
    {iconSlug}/
      icon.png
      icon.webp
      meta.json
    Icons.stories.tsx    # Storybook: Generated Icons / {projectSlug}
    icons.manifest.ts    # App: import { iconsBySlug } from '.../icons.manifest'
  registry.json
```

Configure another output path via `synaptik.config.json` (`outputDir`) or `SYNAPTIK_ICONS_DIR` — see [docs/synaptik-icon-builder.md](../docs/synaptik-icon-builder.md#product-integration-aicads--consumer-repos).

## Git policy

**Recommended (default):** commit `generated-icons/{projectSlug}/` after `synaptik publish` so Storybook and CI (`synaptik:check`) work for all contributors.

**Never commit:** `.synaptik/` (sessions, raw screenshots).

**Optional local ignore** (if you do not want binaries in git):

```gitignore
# local only — do not commit this block to shared .gitignore unless team agrees
generated-icons/**/icon.png
generated-icons/**/icon.webp
```

Keep `registry.json`, `meta.json`, and `Icons.stories.tsx` committed if you ignore PNG/WebP.

Do not mix with SVG primitives in `components/icons/`.
