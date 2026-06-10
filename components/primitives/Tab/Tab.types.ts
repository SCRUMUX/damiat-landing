/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** Tab: appearance (brand/base/ghost/outline/ticket), size (sm/md/lg), state (base/hover/active/focus/disabled). Ticket — «билет» с обводкой сверху/сбоку без низа. */

export type TabAppearance = 'brand' | 'base' | 'ghost' | 'outline' | 'ticket';

export type TabSize = 'sm' | 'md' | 'lg';

/** Interactive state — auto-managed via hover/focus/active */
export type TabState = 'base' | 'hover' | 'active' | 'focus' | 'disabled';

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: TabAppearance;
  size?: TabSize;
  state?: TabState;
  /** Value when used inside `<Tabs>` */
  value?: string;
  iconLeft?: React.ReactNode;
  badge?: React.ReactNode;
  iconRight?: React.ReactNode;
  showLeftIcon?: boolean;
  showBadge?: boolean;
  showRightIcon?: boolean;
  disabled?: boolean;
}