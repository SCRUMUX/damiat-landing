/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** Accordion: открытый/закрытый (через variant state), hover, disabled. Лейбл с fill. Опционально: иконка1 слева, иконка2 слева, лейбл, badge, иконка справа (closed=chevron, open=caret-up-fill), верхний бордер. В open: бордер и иконки — color_brand_primary. */

export type AccordionState = 'open' | 'closed';

export type AccordionSize = 'sm' | 'md' | 'lg';

/** Interactive state — auto-managed via hover/focus/active */
export type AccordionInteraction = 'base' | 'hover' | 'disabled';

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  state?: AccordionState;
  size?: AccordionSize;
  interaction?: AccordionInteraction;
  iconLeft1?: React.ReactNode;
  iconLeft2?: React.ReactNode;
  badge?: React.ReactNode;
  /** @deprecated Chevron icon is now rendered internally. This prop has no effect. */
  chevron?: React.ReactNode;
  showIconLeft1?: boolean;
  showIconLeft2?: boolean;
  showBadge?: boolean;
  /** @deprecated Top accent renders automatically when open. */
  showTopBorder?: boolean;
  /** Take full width of parent container */
  fullWidth?: boolean;
  /** Uncontrolled initial open state (ignored when `state` is set). */
  defaultOpen?: boolean;
  content?: React.ReactNode;
  onToggle?: () => void;
}