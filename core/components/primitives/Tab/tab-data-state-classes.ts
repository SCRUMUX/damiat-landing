import type { TabAppearance } from './Tab.types';

/**
 * Static Radix `data-state` classes for Tab inside `<Tabs />`.
 *
 * MUST be literal strings — Tailwind JIT cannot see classes built via
 * template literals at runtime (`data-[state=active]:${c}`). Sourced from
 * Tab.contract.json appearance × state rules.
 *
 * inactive → contract `state: "base"` (unselected tab)
 * active   → contract `state: "active"` (selected tab)
 *
 * Brand inactive intentionally uses muted/transparent styling — NOT the filled
 * primary pill — so only the selected tab reads as "primary".
 */
export const TAB_IN_TABS_CLASSES: Record<TabAppearance, string> = {
  brand: [
    'data-[state=active]:bg-[var(--color-brand-pressed)]',
    'data-[state=active]:text-[var(--color-text-on-brand)]',
    'data-[state=active]:[--icon-color:var(--color-icon-on-brand)]',
    'data-[state=active]:border-[var(--color-brand-primary)]',
    'data-[state=inactive]:bg-transparent',
    'data-[state=inactive]:text-[var(--color-text-muted)]',
    'data-[state=inactive]:[--icon-color:var(--color-icon-on-base)]',
    'data-[state=inactive]:border-transparent',
    'border border-solid rounded-pill',
  ].join(' '),

  base: [
    'data-[state=active]:bg-[var(--color-surface-3)]',
    'data-[state=active]:text-[var(--color-brand-primary)]',
    'data-[state=active]:[--icon-color:var(--color-icon-on-base)]',
    'data-[state=active]:border-[var(--color-border-strong)]',
    'data-[state=inactive]:bg-[var(--color-surface-1)]',
    'data-[state=inactive]:text-[var(--color-text-primary)]',
    'data-[state=inactive]:[--icon-color:var(--color-icon-on-base)]',
    'data-[state=inactive]:border-[var(--color-border-base)]',
    'border border-solid border-b',
  ].join(' '),

  ghost: [
    'data-[state=active]:bg-[var(--color-bg-muted)]',
    'data-[state=active]:text-[var(--color-text-primary)]',
    'data-[state=active]:[--icon-color:var(--color-icon-on-ghost)]',
    'data-[state=active]:border-[var(--color-border-strong)]',
    'data-[state=inactive]:bg-transparent',
    'data-[state=inactive]:text-[var(--color-text-primary)]',
    'data-[state=inactive]:[--icon-color:var(--color-icon-on-ghost)]',
    'data-[state=inactive]:border-transparent',
    'border border-solid',
  ].join(' '),

  outline: [
    'data-[state=active]:bg-[var(--color-surface-2)]',
    'data-[state=active]:text-[var(--color-brand-primary)]',
    'data-[state=active]:[--icon-color:var(--color-icon-on-outline)]',
    'data-[state=active]:border-[var(--color-border-strong)]',
    'data-[state=inactive]:bg-[var(--color-bg-base)]',
    'data-[state=inactive]:text-[var(--color-brand-primary)]',
    'data-[state=inactive]:[--icon-color:var(--color-icon-on-outline)]',
    'data-[state=inactive]:border-[var(--color-border-base)]',
    'border border-solid border-b-0',
  ].join(' '),

  ticket: [
    'rounded-t-[var(--radius-default)]',
    'border border-solid border-b-0',
    '-mb-px relative z-[1]',
    'data-[state=active]:bg-[var(--color-surface-1)]',
    'data-[state=active]:text-[var(--color-brand-primary)]',
    'data-[state=active]:[--icon-color:var(--color-icon-on-base)]',
    'data-[state=active]:border-[var(--color-border-base)]',
    'data-[state=inactive]:bg-[var(--color-surface-2)]',
    'data-[state=inactive]:text-[var(--color-text-secondary)]',
    'data-[state=inactive]:[--icon-color:var(--color-icon-on-base)]',
    'data-[state=inactive]:border-[var(--color-border-base)]',
  ].join(' '),
};
