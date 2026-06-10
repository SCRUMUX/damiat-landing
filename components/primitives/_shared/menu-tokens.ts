/** Shared sizing tokens for dropdown / autocomplete / select menu panels. */

export type MenuSize = 'sm' | 'md' | 'lg';

/** Popover panel inner padding — must be passed directly to Popover because Radix Portal breaks CSS-var inheritance from the trigger. */
export const MENU_PANEL_PADDING = 'var(--space-dropdown-popover-inset)';

/** Per-size padding + gap for individual menu items. */
export const MENU_ITEM_CLASSES: Record<MenuSize, string> = {
  sm: 'px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)] gap-[var(--space-button-gap-sm)]',
  md: 'px-[var(--space-button-x-md)] py-[var(--space-button-y-md)] gap-[var(--space-button-gap-md)]',
  lg: 'px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)] gap-[var(--space-button-gap-lg)]',
};
