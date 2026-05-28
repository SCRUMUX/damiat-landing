import React, { useCallback } from 'react';
import type { ChipProps, ChipSize } from './Chip.types';
import { cn, findClasses, getFocusRing, IconSlot, type VR } from '../_shared';
import contract from '../../../contracts/components/Chip.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<ChipSize, string> = {
  sm: 'px-[var(--space-tag-x-sm)] py-[var(--space-tag-y-sm)] min-h-[var(--space-22)] max-h-[var(--space-22)] min-w-[var(--space-22)] gap-[var(--space-tag-gap)] text-style-caption-xs rounded-[var(--radius-pill)] [--icon-size:16px]',
  md: 'px-[var(--space-tag-x-md)] py-[var(--space-tag-y-md)] min-h-[var(--space-24)] max-h-[var(--space-24)] min-w-[var(--space-24)] gap-[var(--space-tag-gap)] text-style-caption rounded-[var(--radius-pill)] [--icon-size:16px]',
  lg: 'px-[var(--space-tag-x-lg)] py-[var(--space-tag-y-lg)] min-h-[var(--space-32)] max-h-[var(--space-32)] min-w-[var(--space-32)] gap-[var(--space-tag-gap)] text-style-body rounded-[var(--radius-pill)] [--icon-size:20px]',
};

const DefaultCloseIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>((props, ref) => {
  const {
    appearance = 'base',
    size = 'sm',
    state = 'base',
    disabled = false,
    iconLeft,
    closeIcon,
    showLeftIcon = false,
    showCloseIcon = true,
    value,
    onClose,
    onClick,
    onKeyDown,
    children,
    className,
    ...rest
  } = props;

  const isDisabled = disabled || state === 'disabled';

  const appearanceClasses = findClasses(rules, { appearance, state: isDisabled ? 'disabled' : state });
  const focusRing = getFocusRing(contract, appearance);

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isDisabled) onClose?.(value);
    },
    [isDisabled, onClose, value],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (showCloseIcon && onClose && !isDisabled) {
          e.preventDefault();
          onClose(value);
        }
      }
      onKeyDown?.(e);
    },
    [showCloseIcon, onClose, isDisabled, value, onKeyDown],
  );

  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      role="option"
      aria-selected={state === 'selected' || undefined}
      className={cn(
        'transition-colors duration-150 font-base box-border flex flex-row justify-center items-center border-[var(--border-width-base)] border-solid',
        SIZE_CLASSES[size],
        ...appearanceClasses,
        !isDisabled && focusRing,
        !isDisabled && 'cursor-pointer',
        isDisabled && 'cursor-not-allowed pointer-events-none',
        className,
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {showLeftIcon && iconLeft && <IconSlot icon={iconLeft} />}
      <span className={cn('truncate max-w-[var(--space-120)]', state === 'exclude' && 'line-through')}>{children}</span>
      {showCloseIcon && (
        <span
          role="button"
          tabIndex={-1}
          aria-label={`Remove ${typeof children === 'string' ? children : ''}`}
          onClick={handleCloseClick}
          className="shrink-0 flex items-center justify-center cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
          style={{ width: 'var(--icon-size, 16px)', height: 'var(--icon-size, 16px)' }}
        >
          {closeIcon ?? <DefaultCloseIcon />}
        </span>
      )}
    </button>
  );
});

Chip.displayName = 'Chip';
