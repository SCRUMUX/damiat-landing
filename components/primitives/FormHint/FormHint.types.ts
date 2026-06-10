/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** Helper text под полем ввода. 3 размера (sm/md/lg), 4 вида (base, success, warning, danger). Опционально иконка слева. */

export type FormHintSize = 'sm' | 'md' | 'lg';

export type FormHintAppearance = 'base' | 'success' | 'warning' | 'danger';

export interface FormHintProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: FormHintSize;
  appearance?: FormHintAppearance;
  icon?: React.ReactNode;
  showIcon?: boolean;
}