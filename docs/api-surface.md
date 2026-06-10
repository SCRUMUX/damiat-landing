# Frozen public API surface

Phase 10 task 10.10 introduced a frozen API contract for `@ai-ds/core`. Any
change to a public export of `src/index.ts` must be accompanied by an updated
`etc/ai-ds-core.api.md` snapshot, otherwise CI fails.

## Stack

| Layer       | Tool                                                                     |
| ----------- | ------------------------------------------------------------------------ |
| Snapshotter | [`@microsoft/api-extractor`](https://api-extractor.com)                  |
| Compiler    | `tsc -p tsconfig.api.json` (emits .d.ts only, into `.api-temp/`)         |
| Snapshot    | [`etc/ai-ds-core.api.md`](../etc/ai-ds-core.api.md) — checked into git    |

## Local workflow

```bash
# Refresh the snapshot after intentionally changing the public API
npm install --save-dev @microsoft/api-extractor typescript
npm run api:extract
git add etc/ai-ds-core.api.md
git commit -m "api: bump surface (X added / Y removed)"
```

## CI gate

The recommended invocation in `.github/workflows/ci.yml` is:

```yaml
- run: npm run api:check
```

`api:check` runs api-extractor in **diff mode** — it fails (exit ≠ 0) if the
freshly generated report differs from the committed `etc/ai-ds-core.api.md`.
This makes any unintentional public-surface change visible at PR-review time.

## What counts as a "public" change?

Anything reachable from `src/index.ts`:

- Adding or removing an `export { ... }`.
- Changing the shape of an exported type / interface.
- Changing the signature of an exported function or component.
- Re-exporting from `components/index.ts`, `behaviors/index.ts`, etc.

Implementation-internal types (under `components/primitives/_internal/`) are
never re-exported and therefore are not part of this contract.
