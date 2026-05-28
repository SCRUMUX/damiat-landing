import React, { useState, useCallback } from 'react';
import type { CardProps, CardSize, CardState } from './Card.types';
import contract from '../../../contracts/components/Card.contract.json';
import { cn, findClasses, getFocusRing, type VR } from '../_shared';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<CardSize, string> = {
  sm: 'px-[var(--space-inset-s)] py-[var(--space-inset-s)] gap-[var(--space-4)] min-w-[var(--space-container-compact-min)] max-w-[var(--space-container-compact-max)]',
  md: 'px-[var(--space-inset-m)] py-[var(--space-inset-m)] gap-[var(--space-6)] min-w-[var(--space-container-content-min)] max-w-[var(--space-container-content-max)]',
  lg: 'px-[var(--space-inset-l)] py-[var(--space-inset-l)] gap-[var(--space-8)] min-w-[var(--space-container-wide-min)] max-w-[var(--space-container-wide-max)]',
};

const TITLE_CLASS: Record<CardSize, string> = {
  sm: 'text-style-caption',
  md: 'text-style-body-strong',
  lg: 'text-style-h4',
};

const CONTENT_GAP: Record<CardSize, string> = {
  sm: 'gap-[var(--space-4)]',
  md: 'gap-[var(--space-6)]',
  lg: 'gap-[var(--space-8)]',
};

const CONTENT_CLASS: Record<CardSize, string> = {
  sm: 'text-style-body-xs',
  md: 'text-style-body-sm',
  lg: 'text-style-body',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const {
    variant = 'base',
    size = 'sm',
    state: stateProp,
    title,
    description,
    header,
    footer,
    children,
    disabled = false,
    className,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    tabIndex,
    ...rest
  } = props;

  const [internalState, setInternalState] = useState<CardState>('base');

  const effectiveState: CardState = (() => {
    if (stateProp) return stateProp;
    if (disabled) return 'disabled';
    return internalState;
  })();

  const stateKey: CardState = effectiveState === 'focus' ? 'base' : effectiveState;
  const appearanceClasses = findClasses(rules, { variant, state: stateKey });
  const focusRing = getFocusRing(contract);
  const isDisabled = effectiveState === 'disabled' || disabled;

  const he = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDisabled) setInternalState('hover');
    onMouseEnter?.(e);
  }, [isDisabled, onMouseEnter]);

  const hl = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDisabled) setInternalState('base');
    onMouseLeave?.(e);
  }, [isDisabled, onMouseLeave]);

  const hf = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!isDisabled) setInternalState('focus');
    onFocus?.(e);
  }, [isDisabled, onFocus]);

  const hb = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    setInternalState('base');
    onBlur?.(e);
  }, [onBlur]);

  const focusBorderClasses =
    effectiveState === 'focus'
      ? findClasses(rules, { state: 'focus' })
      : [];

  return (
    <div
      ref={ref}
      tabIndex={tabIndex ?? (isDisabled ? undefined : 0)}
      className={cn(
        'flex flex-col w-full rounded-[var(--radius-medium)] transition-colors duration-150 box-border border-solid border-[var(--border-width-base)]',
        SIZE_CLASSES[size],
        ...appearanceClasses,
        ...focusBorderClasses,
        !isDisabled && focusRing,
        isDisabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed pointer-events-none',
        className,
      )}
      onMouseEnter={he}
      onMouseLeave={hl}
      onFocus={hf}
      onBlur={hb}
      aria-disabled={isDisabled || undefined}
      {...rest}
    >
      {header && <div className="w-full">{header}</div>}

      {(title !== undefined || description !== undefined || children !== undefined) && (
        <div className={cn('flex flex-col w-full', CONTENT_GAP[size])}>
          {title !== undefined && (
            <span className={cn(TITLE_CLASS[size], 'text-[var(--color-text-primary)] leading-none')}>
              {title}
            </span>
          )}
          {description !== undefined && (
            <span className={cn(CONTENT_CLASS[size], 'text-[var(--color-text-primary)]')}>
              {description}
            </span>
          )}
          {children}
        </div>
      )}

      {footer && <div className="w-full mt-auto">{footer}</div>}
    </div>
  );
});

Card.displayName = 'Card';
