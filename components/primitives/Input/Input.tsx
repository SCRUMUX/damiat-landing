import React, { useState, useCallback, useRef, useId } from 'react';
import type { InputProps, InputSize, InputState } from './Input.types';
import { cn, findClasses, getFocusRing, IconSlot, type VR } from '../_shared';
import { ClearButton } from '../_shared/ClearButton';
import { useControllableState } from '../../../hooks/useControllableState';
import contract from '../../../contracts/components/Input.contract.json';

const SpinButton: React.FC<{
  direction: 'up' | 'down';
  onClick: () => void;
  disabled?: boolean;
  isTop?: boolean;
}> = ({ direction, onClick, disabled, isTop }) => (
  <button
    type="button"
    tabIndex={-1}
    aria-label={direction === 'up' ? 'Increment' : 'Decrement'}
    disabled={disabled}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={cn(
      'flex-1 flex items-center justify-center px-[var(--space-4)] select-none',
      'border-l border-[var(--color-border-base)]',
      'text-[var(--color-text-muted)] bg-[var(--color-surface-1)]',
      'transition-colors duration-100',
      !disabled && 'hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] active:bg-[var(--color-surface-3)]',
      disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
      isTop ? 'border-b border-b-[var(--color-border-base)] rounded-tr-[inherit]' : 'rounded-br-[inherit]',
    )}
  >
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      {direction === 'up'
        ? <path d="M2 6.5L5 3.5L8 6.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      }
    </svg>
  </button>
);

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<InputSize, string> = {
  sm: 'px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)] min-h-[var(--space-28)] max-h-[var(--space-28)] min-w-[var(--space-container-compact-min)] gap-[var(--space-button-gap-sm)] text-style-caption rounded-[var(--radius-default)] [--icon-size:20px]',
  md: 'px-[var(--space-button-x-md)] py-[var(--space-button-y-md)] min-h-[var(--space-36)] max-h-[var(--space-36)] min-w-[var(--space-container-content-min)] gap-[var(--space-button-gap-md)] text-style-body rounded-[var(--radius-default)] [--icon-size:20px]',
  lg: 'px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)] min-h-[var(--space-40)] max-h-[var(--space-40)] min-w-[var(--space-container-content-min)] gap-[var(--space-button-gap-lg)] text-style-body-lg rounded-[var(--radius-default)] [--icon-size:24px]',
};

export const Input = React.forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  const {
    appearance = 'base',
    size = 'sm',
    state: controlledState,
    iconLeft1,
    iconLeft2,
    badge,
    tagRow,
    iconRight1,
    iconRight2,
    showIconLeft1 = false,
    showIconLeft2 = false,
    showBadge = false,
    showTagRow = false,
    showIconRight1 = false,
    showIconRight2 = false,
    value: valueProp,
    defaultValue,
    placeholder = 'Placeholder',
    onChange,
    inputProps,
    type = 'text',
    disabled = false,
    readOnly = false,
    required = false,
    name,
    id: idProp,
    maxLength,
    invalid = false,
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    showClearButton = false,
    clearAlwaysVisible = false,
    onClear,
    fullWidth = false,
    className,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const generatedId = useId();
  const inputId = idProp ?? generatedId;

  const [internalState, setInternalState] = useState<InputState>('base');
  const effectiveState: InputState = disabled
    ? 'disabled'
    : controlledState ?? internalState;

  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? '',
    onChange: undefined,
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onChange?.(e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    },
    [onChange, setValue],
  );

  const handleClear = useCallback(() => {
    setValue('');
    onClear?.();
    inputRef.current?.focus();
  }, [setValue, onClear]);

  const hasFilled = value.length > 0;
  const clearEnabled = showClearButton && hasFilled && !disabled && !readOnly;
  const isNumber = type === 'number';

  const incrementValue = useCallback(() => {
    const el = inputRef.current;
    if (!el || disabled || readOnly) return;
    el.stepUp();
    const syntheticEvent = new Event('input', { bubbles: true });
    el.dispatchEvent(syntheticEvent);
    setValue(el.value);
    onChange?.({ target: el } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
  }, [disabled, readOnly, setValue, onChange]);

  const decrementValue = useCallback(() => {
    const el = inputRef.current;
    if (!el || disabled || readOnly) return;
    el.stepDown();
    const syntheticEvent = new Event('input', { bubbles: true });
    el.dispatchEvent(syntheticEvent);
    setValue(el.value);
    onChange?.({ target: el } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
  }, [disabled, readOnly, setValue, onChange]);

  const variantState: InputState =
    effectiveState === 'focus'
      ? 'base'
      : effectiveState === 'base' && hasFilled && controlledState === undefined
        ? 'filled'
        : effectiveState;
  const appearanceClasses = findClasses(rules, { appearance, state: variantState });
  const focusRing = getFocusRing(contract, appearance);

  const inputRef = useRef<HTMLInputElement>(null);
  const handleWrapperClick = useCallback(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const he = useCallback(
    (e: React.MouseEvent) => {
      if (!disabled) setInternalState('hover');
      onMouseEnter?.(e as React.MouseEvent<HTMLDivElement>);
    },
    [disabled, onMouseEnter],
  );
  const hl = useCallback(
    (e: React.MouseEvent) => {
      setInternalState(hasFilled ? 'filled' : 'base');
      onMouseLeave?.(e as React.MouseEvent<HTMLDivElement>);
    },
    [onMouseLeave, hasFilled],
  );
  const hf = useCallback(
    (e: React.FocusEvent) => {
      if (!disabled) setInternalState('focus');
      onFocus?.(e as React.FocusEvent<HTMLDivElement>);
    },
    [disabled, onFocus],
  );
  const hb = useCallback(
    (e: React.FocusEvent) => {
      setInternalState(hasFilled ? 'filled' : 'base');
      onBlur?.(e as React.FocusEvent<HTMLDivElement>);
    },
    [onBlur, hasFilled],
  );

  return (
    <div
      ref={ref}
      className={cn(
        'group transition-colors duration-150 font-base box-border flex flex-row justify-center items-center border-solid border-[var(--border-width-base)]',
        SIZE_CLASSES[size],
        ...appearanceClasses,
        !disabled && focusRing,
        disabled ? 'cursor-not-allowed opacity-[var(--opacity-disabled)]' : 'cursor-text',
        fullWidth && 'w-full min-w-0',
        className,
      )}
      onMouseEnter={he}
      onMouseLeave={hl}
      onFocus={hf}
      onBlur={hb}
      onClick={handleWrapperClick}
      data-state={effectiveState}
      data-invalid={invalid || undefined}
      {...rest}
    >
      {showIconLeft1 && iconLeft1 && <IconSlot icon={iconLeft1} />}
      {showIconLeft2 && iconLeft2 && <IconSlot icon={iconLeft2} />}

      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type={type}
        className={cn(
          'flex-1 min-w-0 bg-transparent outline-none text-[inherit] font-[inherit] leading-[inherit] cursor-[inherit] placeholder:text-[var(--color-text-muted)]',
          isNumber && '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]',
        )}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-required={required || undefined}
        {...(inputProps || {})}
      />

      {showBadge && badge && <div className="shrink-0">{badge}</div>}
      {showTagRow && tagRow && <div className="shrink-0">{tagRow}</div>}
      {clearEnabled && (
        <ClearButton
          onClick={handleClear}
          visible
          className={clearAlwaysVisible ? '' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity'}
        />
      )}
      {showIconRight1 && iconRight1 && <IconSlot icon={iconRight1} />}
      {showIconRight2 && iconRight2 && <IconSlot icon={iconRight2} />}

      {isNumber && !disabled && !readOnly && (
        <div
          className={cn(
            'shrink-0 flex flex-col self-stretch ml-[var(--space-4)]',
            'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150',
            size === 'sm' && '-my-[var(--space-button-y-sm)] -mr-[var(--space-button-x-sm)]',
            size === 'md' && '-my-[var(--space-button-y-md)] -mr-[var(--space-button-x-md)]',
            size === 'lg' && '-my-[var(--space-button-y-lg)] -mr-[var(--space-button-x-lg)]',
          )}
        >
          <SpinButton direction="up" onClick={incrementValue} disabled={disabled} isTop />
          <SpinButton direction="down" onClick={decrementValue} disabled={disabled} />
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
