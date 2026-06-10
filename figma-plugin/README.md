# Figma plugin — AICADS code generator

This plugin emits **AICADS semantic JSX** from Figma designs. The emitted
imports look like:

```tsx
import { Button } from '@ai-ds/core/components/Button';
import { Checkbox } from '@ai-ds/core/components/Checkbox';
```

## Stable public surface

The plugin targets the public AICADS API only — it does **not** depend on
the implementation engine of any primitive. Each primitive's internals
(Radix UI / cmdk / vaul / sonner / custom) are encapsulated in
`components/primitives/_internal/`. As of `v0.4.0` the following form,
overlay and navigation primitives use Radix UI under the hood:

| AICADS primitive | Behavior engine |
|---|---|
| `Popover`, `Dropdown`, `Autocomplete` | `@radix-ui/react-popover` + cmdk |
| `Tooltip` | `@radix-ui/react-tooltip` |
| `Modal`, `CommandPalette` | `@radix-ui/react-dialog` |
| `Drawer` | `vaul` |
| `Checkbox` | `@radix-ui/react-checkbox` |
| `RadioButton` / `RadioGroup` | `@radix-ui/react-radio-group` |
| `Switch` | `@radix-ui/react-switch` |
| `Slider`, `RangeSlider` | `@radix-ui/react-slider` |
| `Select` | `@radix-ui/react-select` |
| `Accordion` | `@radix-ui/react-accordion` |
| `Tab`, `Tabs`, `TabList`, `TabPanel` | `@radix-ui/react-tabs` |
| `Toaster` | `sonner` |

**The plugin output does not change** — it still emits AICADS components,
props and tokens. Only the runtime behavior has been hardened.

## AI manifest

See [`ai-manifest.json`](../ai-manifest.json) at the repo root for the
machine-readable mapping `<primitive> → { role, engine, contract }`. This
file is the canonical source for any external AI tool generating AICADS
code: it lists every available component and the design-system contract
that drives its tokenized styling.

The manifest is also exported via package.json:

```ts
import manifest from '@ai-ds/core/manifest' assert { type: 'json' };
```

## Validation against `ai-manifest.json`

As of v0.5.0 the plugin validates every spec it receives against the
canonical AICADS manifest. The valid set of component roles is embedded
into the plugin bundle at build time by
[`scripts/embed-figma-manifest.mjs`](../scripts/embed-figma-manifest.mjs)
between the `AICADS_MANIFEST_BEGIN` / `AICADS_MANIFEST_END` markers in
`figma-ai-ds-code.js` (so the plugin does not require `networkAccess`).

**Refresh the embedded snapshot after editing `ai-manifest.json`:**

```bash
npm run figma:embed-manifest
```

**Behavior at runtime:**

- The plugin computes a known-role set from `AICADS_MANIFEST.components`
  and validates each `spec.components[*].name` before generation.
- Unknown names trigger:
  - `figma.notify(...)` toast,
  - `console.warn('[AICADS]', ...)`,
  - a log line in the plugin UI.
- By default the plugin **continues** generation after the warning
  (forward-compatible mode).
- The **"Strict AICADS validation"** checkbox in the UI flips the
  behavior to **abort generation** when any unknown role is found —
  useful for CI / hand-off checks where the spec must be 100% aligned
  with the AICADS surface.

## Files

| File | Purpose |
|---|---|
| `figma-ai-ds-manifest.json` | Figma plugin manifest (`api`, `main`, `ui`) |
| `figma-ai-ds-code.js` | Plugin code (Figma sandbox) — emits AICADS JSX |
| `figma-ai-ds-ui.html` | Plugin UI |
