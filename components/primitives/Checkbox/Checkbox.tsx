import React, { useId, useState, useCallback } from 'react';
import type { CheckboxProps, CheckboxSize, CheckboxState } from './Checkbox.types';
import { cn, findClasses, radixCheckboxRest, type VR } from '../_shared';
import contract from '../../../contracts/components/Checkbox.contract.json';
import { useControllableState } from '../../../hooks/useControllableState';
import { RadixCheckbox } from '../_internal';

// MANUAL OVERRIDES:
// - Tri-state checkbox cycle (exclude state)
// - Icon rendering logic (check/plus/minus)
// - Label strikethrough for exclude state

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<CheckboxSize, string> = {
  xs: 'w-[var(--space-12)] h-[var(--space-12)] [--icon-size:var(--space-10)]',
  sm: 'w-[var(--space-16)] h-[var(--space-16)] [--icon-size:var(--space-icon-checkbox-sm)]',
  md: 'w-[var(--space-20)] h-[var(--space-20)] [--icon-size:var(--space-12)]',
  lg: 'w-[var(--space-24)] h-[var(--space-24)] [--icon-size:var(--space-14)]',
};

const LABEL_SIZE_CLASSES: Record<CheckboxSize, string> = {
  xs: 'text-style-caption-xs',
  sm: 'text-style-caption-xs',
  md: 'text-style-caption',
  lg: 'text-style-body',
};

function getIconFlags(state: CheckboxState) {
  const isCheck = state === 'checked' || state === 'focus-checked' || state === 'disabled-checked';
  const isPlus  = state === 'indeterminate' || state === 'disabled-indeterminate';
  const isMinus = state === 'exclude' || state === 'focus-exclude' || state === 'disabled-exclude';
  const isStrike = state === 'exclude' || state === 'focus-exclude' || state === 'disabled-exclude';
  return { showCheck: isCheck, showPlus: isPlus, showMinus: isMinus, strikethrough: isStrike };
}

function stateToRadixChecked(state: CheckboxState): boolean | 'indeterminate' {
  if (state === 'checked' || state === 'focus-checked' || state === 'disabled-checked') return true;
  if (
    state === 'indeterminate' || state === 'disabled-indeterminate'
    || state === 'exclude' || state === 'focus-exclude' || state === 'disabled-exclude'
  ) return 'indeterminate';
  return false;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn('animate-check-pop', className)}>
    <path d="M2.5 8L6.5 12L13.5 4.5" stroke="var(--color-text-on-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Plus — indeterminate (частичный выбор) */
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn('animate-check-pop', className)}>
    <path d="M8 3.5V12.5M3.5 8H12.5" stroke="var(--color-text-on-brand)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Minus — exclude (кроме) */
const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={cn('animate-check-pop', className)}>
    <path d="M3.5 8H12.5" stroke="var(--color-text-on-brand)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ICON_SIZE_CLASS = 'w-[var(--icon-size)] h-[var(--icon-size)]';

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>((props, ref) => {
  const {
    size = 'md',
    state: stateProp,
    indeterminate = false,
    exclude = false,
    label,
    checked: checkedProp,
    defaultChecked,
    disabled = false,
    onChange,
    onFocus,
    onBlur,
    className,
    id: idProp,
    ...rest
  } = props;

  const autoId = useId();
  const id = idProp ?? autoId;
  const isVisualOverride = stateProp !== undefined;

  const [effectiveChecked, setChecked] = useControllableState<boolean>({
    value: checkedProp,
    defaultValue: defaultChecked ?? false,
  });

  const [isFocused, setIsFocused] = useState(false);

  const handleCheckedChange = useCallback((next: boolean | 'indeterminate') => {
    if (isVisualOverride) return;
    const boolChecked = next === true;
    setChecked(boolChecked);
    onChange?.({
      target: { checked: boolChecked, type: 'checkbox', value: 'on' },
      currentTarget: { checked: boolChecked, type: 'checkbox', value: 'on' },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [isVisualOverride, onChange, setChecked]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(true);
    onFocus?.(e as unknown as React.FocusEvent<HTMLInputElement>);
  }, [onFocus]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(false);
    onBlur?.(e as unknown as React.FocusEvent<HTMLInputElement>);
  }, [onBlur]);

  const effectiveState: CheckboxState = (() => {
    if (stateProp) return stateProp;
    if (disabled && exclude)         return 'disabled-exclude';
    if (disabled && indeterminate)   return 'disabled-indeterminate';
    if (disabled && effectiveChecked) return 'disabled-checked';
    if (disabled)                    return 'disabled-unchecked';
    if (exclude)                     return isFocused ? 'focus-exclude' : 'exclude';
    if (indeterminate)               return 'indeterminate';
    if (isFocused && effectiveChecked) return 'focus-checked';
    if (isFocused)                     return 'focus-unchecked';
    if (effectiveChecked)              return 'checked';
    return 'unchecked';
  })();

  const stateClasses = findClasses(rules, { state: effectiveState });
  const { showCheck, showPlus, showMinus, strikethrough } = getIconFlags(effectiveState);
  const isDisabled = effectiveState.startsWith('disabled') || disabled;

  const radixChecked: boolean | 'indeterminate' = isVisualOverride
    ? stateToRadixChecked(stateProp!)
    : exclude || indeterminate
      ? 'indeterminate'
      : effectiveChecked;

  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-center gap-[var(--space-20)]',
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <RadixCheckbox.Root
        ref={ref}
        id={id}
        checked={radixChecked}
        onCheckedChange={handleCheckedChange}
        disabled={isDisabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-checked={exclude ? 'mixed' : indeterminate ? 'mixed' : effectiveChecked}
        className={cn(
          'inline-flex shrink-0 items-center justify-center',
          'border-solid border-[var(--border-width-base)] transition-all duration-150',
          SIZE_CLASSES[size],
          ...stateClasses,
        )}
        {...(radixCheckboxRest(rest) as React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>)}
      >
        <RadixCheckbox.Indicator className="flex items-center justify-center">
          {showCheck && <CheckIcon className={ICON_SIZE_CLASS} />}
          {showPlus  && <PlusIcon  className={ICON_SIZE_CLASS} />}
          {showMinus && <MinusIcon className={ICON_SIZE_CLASS} />}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      {label && (
        <span
          className={cn(
            LABEL_SIZE_CLASSES[size],
            'leading-none select-none',
            isDisabled
              ? 'text-[var(--color-text-disabled)]'
              : 'text-[var(--color-text-primary)]',
            strikethrough && 'line-through',
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
