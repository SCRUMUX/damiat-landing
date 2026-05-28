import React, { useId } from 'react';
import type { RadioButtonProps, RadioButtonSize, RadioButtonState } from './RadioButton.types';
import { cn, findClasses, radixRadioItemRest, type VR } from '../_shared';
import contract from '../../../contracts/components/RadioButton.contract.json';
import { RadixRadioGroup } from '../_internal';
import { useRadioGroupContext } from './RadioGroup';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<RadioButtonSize, string> = {
  xs: 'w-[var(--space-12)] h-[var(--space-12)] [--inner-size:var(--space-6)]',
  sm: 'w-[var(--space-16)] h-[var(--space-16)] [--inner-size:var(--space-6)]',
  md: 'w-[var(--space-20)] h-[var(--space-20)] [--inner-size:var(--space-8)]',
  lg: 'w-[var(--space-24)] h-[var(--space-24)] [--inner-size:var(--space-10)]',
};

const LABEL_SIZE: Record<RadioButtonSize, string> = {
  xs: 'text-style-caption-xs',
  sm: 'text-style-caption-xs',
  md: 'text-style-caption',
  lg: 'text-style-body',
};

function showInnerDot(state: RadioButtonState): boolean {
  return state === 'filled' || state === 'always-filled';
}

function RadioIndicator() {
  return (
    <RadixRadioGroup.Indicator className="flex items-center justify-center">
      <span className="block h-[var(--inner-size)] w-[var(--inner-size)] shrink-0 rounded-full bg-[var(--color-text-on-brand)]" />
    </RadixRadioGroup.Indicator>
  );
}

function VisualRing({
  showInner,
  vc,
  sizeClass,
}: {
  showInner: boolean;
  vc: string[];
  sizeClass: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center',
        'transition-all duration-150',
        sizeClass,
        ...vc,
      )}
    >
      {showInner && (
        <span className="block h-[var(--inner-size)] w-[var(--inner-size)] shrink-0 rounded-full bg-[var(--color-text-on-brand)]" />
      )}
    </span>
  );
}

function LabelText({
  label,
  labelSize,
  isDisabled,
  htmlFor,
}: {
  label: React.ReactNode;
  labelSize: string;
  isDisabled: boolean;
  htmlFor?: string;
}) {
  return (
    <span
      {...(htmlFor ? { id: `${htmlFor}-label` } : {})}
      className={cn(
        labelSize,
        'leading-none select-none',
        isDisabled
          ? 'text-[var(--color-text-disabled)]'
          : 'text-[var(--color-text-primary)]',
      )}
    >
      {label}
    </span>
  );
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>((props, ref) => {
  const {
    size = 'md',
    state: stateProp,
    label,
    checked,
    disabled = false,
    onChange,
    className,
    id: idProp,
    value,
    ...rest
  } = props;

  const group = useRadioGroupContext();
  const autoId = useId();
  const id = idProp ?? autoId;
  const inGroup = group !== null && value !== undefined && stateProp === undefined;

  const effectiveState: RadioButtonState = (() => {
    if (stateProp) return stateProp;
    if (disabled || group?.disabled) return 'disabled';
    if (inGroup) {
      return group!.value === value ? 'always-filled' : 'base';
    }
    if (checked) return 'filled';
    return 'base';
  })();

  const labelSize = LABEL_SIZE[size];
  const sizeClass = SIZE_CLASSES[size];
  const stateClasses = findClasses(rules, { state: effectiveState });
  const showInner = showInnerDot(effectiveState);
  const isDisabled = effectiveState === 'disabled' || disabled || group?.disabled;

  /* Visual-only mode for AllStates / matrix stories */
  if (stateProp !== undefined) {
    return (
      <label
        className={cn(
          'inline-flex items-center gap-[var(--space-4)]',
          isDisabled ? 'cursor-not-allowed opacity-[var(--opacity-disabled)]' : 'cursor-pointer',
          className,
        )}
      >
        <VisualRing showInner={showInner} vc={stateClasses} sizeClass={sizeClass} />
        {label && <LabelText label={label} labelSize={labelSize} isDisabled={isDisabled} />}
      </label>
    );
  }

  /* Radix item inside RadioGroup */
  if (inGroup) {
    return (
      <div className={cn('inline-flex items-center gap-[var(--space-4)]', className)}>
        <RadixRadioGroup.Item
          ref={ref as React.Ref<HTMLButtonElement>}
          id={id}
          value={String(value)}
          disabled={isDisabled}
          className={cn(
            'relative inline-flex shrink-0 items-center justify-center',
            'transition-all duration-150 cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
            sizeClass,
            ...stateClasses,
          )}
          {...(radixRadioItemRest(rest) as React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>)}
        >
          <RadioIndicator />
        </RadixRadioGroup.Item>

        {label && (
          <label
            htmlFor={id}
            className={cn(
              labelSize,
              'leading-none select-none cursor-pointer',
              isDisabled
                ? 'text-[var(--color-text-disabled)] cursor-not-allowed'
                : 'text-[var(--color-text-primary)]',
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }

  /* Standalone native radio */
  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-center gap-[var(--space-4)]',
        isDisabled ? 'cursor-not-allowed opacity-[var(--opacity-disabled)]' : 'cursor-pointer',
        className,
      )}
    >
      <input
        ref={ref}
        id={id}
        type="radio"
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={onChange}
        className="sr-only"
        {...rest}
      />

      <VisualRing showInner={showInner} vc={stateClasses} sizeClass={sizeClass} />

      {label && <LabelText label={label} labelSize={labelSize} isDisabled={isDisabled} htmlFor={id} />}
    </label>
  );
});

RadioButton.displayName = 'RadioButton';
