# `_internal/` — Implementation Substrate

> **NOT a public API.** Nothing inside this folder is exported from `@ai-ds/core`.

## Purpose

This folder is the **only** place in the repository where external behavior libraries (Radix UI, cmdk, Floating UI, sonner, vaul, etc.) may be imported. It exists to give AICADS primitives a mature accessibility/interaction engine **without** leaking those dependencies into:

- the public `@ai-ds/core/components/*` API,
- Storybook (consumers see only AICADS semantic components),
- generated Replit/AI code,
- the Figma plugin pipeline.

## The hard rule

```
@radix-ui/*    →  ONLY inside components/primitives/_internal/**
cmdk           →  ONLY inside components/primitives/_internal/**
@floating-ui/* →  ONLY inside components/primitives/_internal/**
sonner / vaul  →  ONLY inside components/primitives/_internal/**
class-variance-authority → ONLY inside components/primitives/_internal/**
```

Any AICADS primitive (`components/primitives/<Name>/<Name>.tsx`) that needs Radix-grade behavior **imports it from `_internal/`**, never from the dependency directly. This is enforced by the ESLint `no-restricted-imports` rule at the repo root.

## Folder layout (planned)

```
_internal/
  README.md                 ← this file
  floating/                 ← Radix Popover / Tooltip / HoverCard / DropdownMenu adapters
  dialog/                   ← Radix Dialog adapter (Modal + Drawer/Sheet)
  forms/                    ← Radix Checkbox/Radio/Switch/Slider/Select adapters
  command/                  ← cmdk + Radix Popover combo for Autocomplete / CommandPalette
  accordion-tabs/           ← Radix Accordion / Tabs / Collapsible / Toggle
  toast/                    ← Radix Toast or sonner provider
  form/                     ← react-hook-form + zod adapters
  shadcn-bridge.css         ← local-only --primary/--background aliases over AICADS tokens
                              (never published)
```

Each adapter exposes a minimal slot-based API consumed by AICADS primitives via `asChild` / composition. AICADS owns the DOM structure, styling, and contract semantics; `_internal/` owns the behavior.

## Publishing

This folder is **not** listed in `package.json` `exports`. It is shipped as source for type-resolution, but consumers cannot import from `@ai-ds/core/_internal/...`. The barrel of every primitive (`components/primitives/<Name>/index.ts`) only re-exports the AICADS-facing surface.

## When in doubt

If you are about to write `import ... from '@radix-ui/...'` inside a primitive — **stop**. Either:

1. Move the Radix usage into an `_internal/` adapter and consume that adapter from the primitive, or
2. Reconsider whether Radix is the right answer at all (some primitives stay fully custom — see the Component Mapping Matrix in the audit report).
