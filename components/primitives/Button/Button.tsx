import React, { useState, useCallback } from 'react';
import type { ButtonProps, ButtonSize, ButtonState } from './Button.types';
import { cn, findClasses, getFocusRing, IconSlot, type VR } from '../_shared';
import { Spinner } from '../Spinner/Spinner';
import contract from '../../../contracts/components/Button.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)] min-h-[var(--space-button-h-sm)] max-h-[var(--space-button-h-sm)] min-w-[var(--space-button-h-sm)] gap-[var(--space-button-gap-sm)] text-style-caption rounded-[var(--radius-button)] [--icon-size:20px]',
  md: 'px-[var(--space-button-x-md)] py-[var(--space-button-y-md)] min-h-[var(--space-button-h-md)] max-h-[var(--space-button-h-md)] min-w-[var(--space-button-h-md)] gap-[var(--space-button-gap-md)] text-style-body rounded-[var(--radius-button)] [--icon-size:20px]',
  lg: 'px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)] min-h-[var(--space-button-h-lg)] max-h-[var(--space-button-h-lg)] min-w-[var(--space-button-h-lg)] gap-[var(--space-button-gap-lg)] text-style-body-lg rounded-[var(--radius-button)] [--icon-size:24px]',
};

const SPINNER_SIZE: Record<ButtonSize, 'xs' | 'sm'> = { sm: 'xs', md: 'xs', lg: 'sm' };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    appearance = 'brand',
    size = 'sm',
    state: controlledState,
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    showLeftIcon = true,
    showRightIcon = true,
    showLabel = true,
    children,
    className,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onMouseDown,
    onMouseUp,
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  const [internalState, setInternalState] = useState<ButtonState>('base');
  const effectiveState: ButtonState = isDisabled
    ? 'disabled'
    : controlledState ?? internalState;

  const stateKey: ButtonState = effectiveState === 'focus' ? 'base' : effectiveState;
  // Appearance + state colours come from the contract only — size/layout lives in SIZE_CLASSES.
  const appearanceClasses = findClasses(rules, { appearance, state: stateKey });
  const focusRing = getFocusRing(contract, appearance);

  const he = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) setInternalState('hover');
      onMouseEnter?.(e);
    },
    [isDisabled, onMouseEnter],
  );
  const hl = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setInternalState('base');
      onMouseLeave?.(e);
    },
    [onMouseLeave],
  );
  const hf = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      if (!isDisabled) setInternalState('focus');
      onFocus?.(e);
    },
    [isDisabled, onFocus],
  );
  const hb = useCallback(
    (e: React.FocusEvent<HTMLButtonElement>) => {
      setInternalState('base');
      onBlur?.(e);
    },
    [onBlur],
  );
  const hmd = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) setInternalState('active');
      onMouseDown?.(e);
    },
    [isDisabled, onMouseDown],
  );
  const hmu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setInternalState('hover');
      onMouseUp?.(e);
    },
    [onMouseUp],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) onClick?.(e);
    },
    [isDisabled, onClick],
  );

  return (
    <button
      type="button"
      ref={ref}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      className={cn(
        'transition-colors duration-150 font-base box-border flex flex-row justify-center items-center border-[var(--border-width-base)] border-solid',
        SIZE_CLASSES[size],
        ...appearanceClasses,
        !isDisabled && focusRing,
        isDisabled && 'cursor-not-allowed pointer-events-none',
        fullWidth && 'w-full min-w-0',
        className,
      )}
      onMouseEnter={he}
      onMouseLeave={hl}
      onFocus={hf}
      onBlur={hb}
      onMouseDown={hmd}
      onMouseUp={hmu}
      onClick={handleClick}
      {...rest}
    >
      {loading && <Spinner size={SPINNER_SIZE[size]} appearance="inherit" />}
      {!loading && showLeftIcon && iconLeft && <IconSlot icon={iconLeft} />}
      {showLabel && <span className={cn(loading && 'opacity-0 select-none')}>{children}</span>}
      {!loading && showRightIcon && iconRight && <IconSlot icon={iconRight} />}
    </button>
  );
});

Button.displayName = 'Button';
