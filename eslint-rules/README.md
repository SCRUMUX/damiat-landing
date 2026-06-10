# Local ESLint Rules

This directory hosts AICADS-specific ESLint rules that enforce the architectural
contracts described in [../ARCHITECTURE.md](../ARCHITECTURE.md).

## Available rules

| Rule                    | Severity | What it forbids                                                                                                |
| ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `no-hardcoded-tokens`   | error    | Numeric literals in `style={{ padding\|gap\|... }}`, Tailwind arbitrary values without `var(...)`, hex colors. |
| `no-size-in-find-classes` | error  | Passing `size` to `findClasses()` / `findRuleClasses()` in `components/primitives/` (use `SIZE_CLASSES` instead). |

## How it is wired

The rules are loaded into ESLint via the `--rulesdir` CLI flag in the root
`lint` script (see [package.json](../package.json)):

```bash
npm run lint
```

The rule name in `.eslintrc.cjs` is the bare file name without the `.js`
suffix, e.g. `'no-hardcoded-tokens': 'error'`.

**Note:** ESLint's legacy `--rulesdir` only loads `*.js` files. Because the
repo root is `"type": "module"`, this directory includes a local
`package.json` with `"type": "commonjs"` so rule modules can use
`module.exports`.

## Allowlist

`no-hardcoded-tokens` reads `config/css-variables/tokens.css` at rule init and
builds a set of allowed `var(--space-*) / var(--radius-*) / var(--size-*)`
identifiers. Any inline value that does **not** resolve to a known token is
flagged.

If you need to introduce a new size or spacing value, add it to the spec
(`ai-ds-spec.json`) and regenerate `tokens.css` first.
