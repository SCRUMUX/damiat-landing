import React, { useState, useCallback } from 'react';
import type { SwitchProps, SwitchSize, SwitchState } from './Switch.types';
import contract from '../../../contracts/components/Switch.contract.json';
import { cn, findClasses, getFocusRing, type VR } from '../_shared';
import { RadixSwitch } from '../_internal';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<SwitchSize, string> = {
  xs: '[--thumb-size:var(--space-8)] w-[var(--space-switch-track-w-xs)] h-[var(--space-switch-track-h-xs)] rounded-pill',
  sm: '[--thumb-size:var(--space-12)] w-[var(--space-switch-track-w-sm)] h-[var(--space-switch-track-h-sm)] rounded-pill',
  md: '[--thumb-size:var(--space-control-box-sm)] w-[var(--space-switch-track-w-md)] h-[var(--space-switch-track-h-md)] rounded-pill',
  lg: '[--thumb-size:var(--space-control-box-md)] w-[var(--space-switch-track-w-lg)] h-[var(--space-switch-track-h-lg)] rounded-pill',
};

const isOnState = (s: SwitchState) => s === 'on' || s === 'disabled-on';
const isDisabledState = (s: SwitchState) => s === 'disabled-on' || s === 'disabled-off';

/**
 * Switch — pill track + sliding thumb, backed by `@radix-ui/react-switch`.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>((props, ref) => {
  const {
    size = 'sm',
    state: controlledState,
    disabled = false,
    defaultChecked = false,
    onToggle,
    onClick,
    children,
    className,
    ...rest
  } = props;

  const [internalOn, setInternalOn] = useState<boolean>(
    controlledState !== undefined ? isOnState(controlledState) : defaultChecked,
  );

  const isControlled = controlledState !== undefined;
  const effectiveOn = isControlled ? isOnState(controlledState!) : internalOn;

  const effectiveState: SwitchState = (() => {
    const isDisabled = disabled || (isControlled && isDisabledState(controlledState!));
    if (isDisabled) return effectiveOn ? 'disabled-on' : 'disabled-off';
    return effectiveOn ? 'on' : 'off';
  })();

  const effectiveDisabled = effectiveState === 'disabled-on' || effectiveState === 'disabled-off';

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      if (effectiveDisabled) return;
      if (!isControlled) {
        setInternalOn(checked);
      }
      onToggle?.(checked);
    },
    [effectiveDisabled, isControlled, onToggle],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
    },
    [onClick],
  );

  const stateClasses = findClasses(rules, { state: effectiveState });
  const focusRing = getFocusRing(contract);

  return (
    <RadixSwitch.Root
      ref={ref}
      checked={effectiveOn}
      onCheckedChange={handleCheckedChange}
      disabled={effectiveDisabled}
      onClick={handleClick}
      className={cn(
        'transition-colors duration-200 box-border relative inline-flex items-center shrink-0',
        'bg-[var(--track-bg,transparent)] border-[var(--border-width-base)] border-solid border-transparent',
        SIZE_CLASSES[size],
        ...stateClasses,
        !effectiveDisabled && focusRing,
        effectiveDisabled && 'cursor-not-allowed pointer-events-none',
        className,
      )}
      {...rest}
    >
      <RadixSwitch.Thumb
        className={cn(
          'absolute rounded-full transition-transform duration-200 shadow-sm',
          'bg-[var(--thumb-bg,var(--color-icon-on-brand))] border border-[var(--thumb-border,transparent)]',
          'w-[var(--thumb-size)] h-[var(--thumb-size)]',
          'left-0 top-1/2 -mt-[calc(var(--thumb-size)/2)]',
          'data-[state=checked]:translate-x-[calc(100%+var(--space-2))]',
          'data-[state=unchecked]:translate-x-[var(--space-2)]',
        )}
      />
      {children}
    </RadixSwitch.Root>
  );
});

Switch.displayName = 'Switch';
