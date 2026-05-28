/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** Section header: опциональная иконка слева, лейбл, badge, иконка справа. 3 размера (sm/md/lg), 4 семантических вида (base, success, warning, danger). */

export type SectionHeaderSize = 'sm' | 'md' | 'lg';

export type SectionHeaderAppearance = 'base' | 'success' | 'warning' | 'danger';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SectionHeaderSize;
  appearance?: SectionHeaderAppearance;
  iconLeft?: React.ReactNode;
  badge?: React.ReactNode;
  iconRight?: React.ReactNode;
  showLeftIcon?: boolean;
  showBadge?: boolean;
  showRightIcon?: boolean;
}