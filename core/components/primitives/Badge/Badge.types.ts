/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** Badge: appearance (brand, base, ghost, outline + success, warning, danger, info). 3 размера. Smallest typography. Symbol/short text only. Light/dark via color tokens. */

export type BadgeAppearance = 'brand' | 'base' | 'ghost' | 'outline' | 'success' | 'warning' | 'danger' | 'info';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  appearance?: BadgeAppearance;
  size?: BadgeSize;
}