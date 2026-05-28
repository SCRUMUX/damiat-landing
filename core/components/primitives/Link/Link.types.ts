/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** Ссылка: опциональный лейбл, опциональная правая иконка (link-45deg). 3 размера (sm, md, lg). Состояния: base, hover, visited, disabled. */

export type LinkSize = 'sm' | 'md' | 'lg';

/** Interactive state — auto-managed via hover/focus/active */
export type LinkState = 'base' | 'hover' | 'visited' | 'disabled';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: LinkSize;
  state?: LinkState;
  iconRight?: React.ReactNode;
  showLabel?: boolean;
  showRightIcon?: boolean;
}