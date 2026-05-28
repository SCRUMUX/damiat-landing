import React from 'react';

/**
 * @UI/EmptyState
 * Пустое состояние с иконкой, заголовком, описанием и CTA.
 * Оси: size (sm/md/lg) × appearance (base/info/success/warning/danger) × layout (vertical/horizontal).
 * Boolean props: showIcon, showCta, showSecondary.
 */

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export type EmptyStateAppearance = 'base' | 'info' | 'success' | 'warning' | 'danger';

/** vertical — icon + text + actions stacked; horizontal — icon on left, content on right */
export type EmptyStateLayout = 'vertical' | 'horizontal';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: EmptyStateSize;
  appearance?: EmptyStateAppearance;
  layout?: EmptyStateLayout;

  /** Icon node (will be sized automatically based on size) */
  icon?: React.ReactNode;

  /** Primary title text */
  title?: string;
  /** Secondary description text */
  description?: string;

  /** Primary CTA button instance */
  ctaButton?: React.ReactNode;
  /** Secondary action button instance */
  secondaryButton?: React.ReactNode;

  showIcon?: boolean;
  showCta?: boolean;
  showSecondary?: boolean;
}
