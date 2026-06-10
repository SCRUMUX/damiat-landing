import React from 'react';
import type { EmptyStateProps, EmptyStateSize } from './EmptyState.types';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/EmptyState.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<EmptyStateSize, string> = {
  sm: 'px-[var(--space-inset-m)] py-[var(--space-inset-m)] min-w-[var(--space-container-compact-min)] max-w-[var(--space-container-compact-max)] [--icon-size:var(--space-empty-state-icon-sm)] [--icon-wrap-size:var(--space-empty-state-icon-wrapper-sm)]',
  md: 'px-[var(--space-inset-l)] py-[var(--space-inset-l)] min-w-[var(--space-container-content-min)] max-w-[var(--space-container-content-max)] [--icon-size:var(--space-empty-state-icon-md)] [--icon-wrap-size:var(--space-empty-state-icon-wrapper-md)]',
  lg: 'px-[var(--space-inset-xl)] py-[var(--space-inset-xl)] min-w-[var(--space-container-wide-min)] max-w-[var(--space-container-wide-max)] [--icon-size:var(--space-empty-state-icon-lg)] [--icon-wrap-size:var(--space-empty-state-icon-wrapper-lg)]',
};

const GAP_CLASSES: Record<EmptyStateSize, string> = {
  sm: 'gap-[var(--space-empty-state-gap-sm)] [--text-block-gap:var(--space-empty-state-text-gap-sm)] [--actions-gap:var(--space-empty-state-actions-gap-sm)]',
  md: 'gap-[var(--space-empty-state-gap-md)] [--text-block-gap:var(--space-empty-state-text-gap-md)] [--actions-gap:var(--space-empty-state-actions-gap-md)]',
  lg: 'gap-[var(--space-empty-state-gap-lg)] [--text-block-gap:var(--space-empty-state-text-gap-lg)] [--actions-gap:var(--space-empty-state-actions-gap-lg)]',
};

const TITLE_CLASS: Record<EmptyStateSize, string> = {
  sm: 'text-style-body-strong',
  md: 'text-style-h4',
  lg: 'text-style-h3',
};

const DESC_CLASS: Record<EmptyStateSize, string> = {
  sm: 'text-style-body-sm',
  md: 'text-style-body',
  lg: 'text-style-body-lg',
};

interface IconFrameProps {
  node: React.ReactNode;
}

const IconFrame: React.FC<IconFrameProps> = ({ node }) => (
  <span
    className="shrink-0 flex items-center justify-center w-[var(--icon-wrap-size)] h-[var(--icon-wrap-size)] text-[var(--icon-color)]"
    aria-hidden="true"
  >
    <span className="flex items-center justify-center w-[var(--icon-size)] h-[var(--icon-size)]">
      {React.isValidElement(node)
        ? React.cloneElement(node as React.ReactElement<{ style?: React.CSSProperties }>, {
            style: {
              width: '100%',
              height: '100%',
              display: 'block',
              ...(node as React.ReactElement<{ style?: React.CSSProperties }>).props?.style,
            },
          })
        : node}
    </span>
  </span>
);

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>((props, ref) => {
  const {
    size = 'sm',
    appearance = 'base',
    layout = 'vertical',
    icon,
    title = 'No items yet',
    description = 'Add your first item to get started.',
    ctaButton,
    secondaryButton,
    showIcon = true,
    showCta = true,
    showSecondary = true,
    className,
    style,
    ...rest
  } = props;

  const appearanceClasses = findClasses(rules, { appearance });
  const layoutClasses = findClasses(rules, { layout });
  const isVertical = layout === 'vertical';
  const textAlign = isVertical ? 'text-center' : 'text-left';

  const hasActions = (showCta && ctaButton) || (showSecondary && secondaryButton);

  const actionsRow = hasActions ? (
    <div className="flex flex-row items-center flex-wrap gap-[var(--actions-gap)]">
      {showCta && ctaButton && <span className="shrink-0">{ctaButton}</span>}
      {showSecondary && secondaryButton && <span className="shrink-0">{secondaryButton}</span>}
    </div>
  ) : null;

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex rounded-medium',
        SIZE_CLASSES[size],
        GAP_CLASSES[size],
        ...appearanceClasses,
        ...layoutClasses,
        isVertical ? 'items-center' : 'items-center',
        className,
      )}
      style={style}
      {...rest}
    >
      {showIcon && icon && <IconFrame node={icon} />}

      {isVertical ? (
        <>
          <div className="flex flex-col items-center gap-[var(--text-block-gap)]">
            <span className={cn(TITLE_CLASS[size], 'text-[var(--title-color)]', textAlign)}>
              {title}
            </span>
            <span className={cn(DESC_CLASS[size], 'text-[var(--description-color)]', textAlign)}>
              {description}
            </span>
          </div>
          {actionsRow}
        </>
      ) : (
        <div className="flex flex-col gap-[var(--text-block-gap)]">
          <div className="flex flex-col gap-[var(--text-block-gap)]">
            <span className={cn(TITLE_CLASS[size], 'text-[var(--title-color)]', textAlign)}>
              {title}
            </span>
            <span className={cn(DESC_CLASS[size], 'text-[var(--description-color)]', textAlign)}>
              {description}
            </span>
          </div>
          {actionsRow}
        </div>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
