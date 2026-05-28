/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** Alert: иконка слева (exclamation-diamond-fill), заголовок, параграф, иконка справа (close). Варианты appearance (warning, info, danger, success), variant (basic, leftBorder, topBorder, solid).  */

export type AlertAppearance = 'warning' | 'info' | 'danger' | 'success';

export type AlertVariant = 'basic' | 'leftBorder' | 'topBorder' | 'solid';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  appearance?: AlertAppearance;
  variant?: AlertVariant;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  title?: string;
  paragraph?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  showTitle?: boolean;
  showParagraph?: boolean;
  /** Called when the close button (×) is clicked. When provided, the right icon becomes a clickable close button. */
  onClose?: () => void;
  /** Whether the alert is visible. Default true. */
  open?: boolean;
}