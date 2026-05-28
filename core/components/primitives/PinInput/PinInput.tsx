import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { PinInputProps, PinInputSize, PinInputState } from './PinInput.types';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/PinInput.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<PinInputSize, string> = {
  sm: 'gap-[var(--space-2)] [--cell-size:var(--space-pin-cell-sm)] [--cell-radius:var(--radius-default)] [--dot-size:var(--space-8)] text-style-caption',
  md: 'gap-[var(--space-4)] [--cell-size:var(--space-pin-cell-md)] [--cell-radius:var(--radius-medium)] [--dot-size:var(--space-10)] text-style-body',
  lg: 'gap-[var(--space-6)] [--cell-size:var(--space-pin-cell-lg)] [--cell-radius:var(--radius-medium)] [--dot-size:var(--space-12)] text-style-body-lg',
};

const TEXT_CLASSES: Record<PinInputSize, string> = {
  sm: 'text-style-caption',
  md: 'text-style-body',
  lg: 'text-style-body-lg',
};

const PinCell: React.FC<{
  value: string;
  index: number;
  textClass: string;
  state: PinInputState;
  isActive: boolean;
  mask: boolean;
  setInputRef: (el: HTMLInputElement | null) => void;
  onCellClick: (index: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}> = ({
  value,
  index,
  textClass,
  state,
  isActive,
  mask,
  setInputRef,
  onCellClick,
  onKeyDown,
  onInputChange,
  onPaste,
}) => {
  const isDisabled = state === 'disabled';
  const hasValue = value !== '';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0',
        'bg-[var(--color-bg-base)] border border-solid border-[var(--border-width-base)]',
        'w-[var(--cell-size)] h-[var(--cell-size)] rounded-[var(--cell-radius)]',
        'transition-colors duration-150',
        isActive
          ? 'border-[var(--color-brand-primary)] shadow-[var(--effect-focus-brand)]'
          : 'border-[var(--cell-border,var(--color-border-base))]',
        isDisabled && 'cursor-not-allowed',
      )}
      onClick={() => !isDisabled && onCellClick(index)}
    >
      <input
        ref={setInputRef}
        type={mask ? 'password' : 'text'}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        value={value}
        disabled={isDisabled}
        aria-label={`PIN digit ${index + 1}`}
        className="absolute inset-0 w-full h-full opacity-0 cursor-default"
        onChange={(e) => onInputChange(e, index)}
        onKeyDown={(e) => onKeyDown(e, index)}
        onPaste={onPaste}
        tabIndex={isActive ? 0 : -1}
        autoComplete="one-time-code"
      />

      {hasValue && !mask && (
        <span
          className={cn(
            'font-semibold leading-none select-none',
            textClass,
            state === 'error' ? 'text-[var(--color-danger-base)]' :
            state === 'disabled' ? 'text-[var(--color-text-disabled)]' :
            'text-[var(--color-text-primary)]',
          )}
        >
          {value}
        </span>
      )}

      {(hasValue && mask) && (
        <span className="rounded-full shrink-0 w-[var(--dot-size)] h-[var(--dot-size)] bg-[var(--cell-dot)]" />
      )}

      {!hasValue && (
        isActive
          ? <span className="w-px h-[var(--space-16)] bg-[var(--color-brand-primary)] animate-pulse" />
          : <span className="rounded-full shrink-0 w-[var(--dot-size)] h-[var(--dot-size)] bg-[var(--cell-dot,var(--color-border-base))]" />
      )}
    </div>
  );
};

export const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>((props, ref) => {
  const {
    size = 'sm',
    state: stateProp = 'unfilled',
    length = 6,
    value: controlledValue,
    onChange,
    onComplete,
    mask = true,
    className,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    if (controlledValue !== undefined) {
      const chars = controlledValue.split('').slice(0, length);
      const padded = [...chars, ...Array(length - chars.length).fill('')];
      setInternalValue(padded);
    }
  }, [controlledValue, length]);

  const values = controlledValue !== undefined
    ? controlledValue.split('').slice(0, length).concat(Array(length).fill('')).slice(0, length)
    : internalValue;

  const computedState: PinInputState = stateProp !== 'unfilled' ? stateProp
    : values.every(v => v !== '') ? 'filled'
    : 'unfilled';

  const stateClasses = findClasses(rules, { state: computedState });

  const focusCell = useCallback((index: number) => {
    const el = inputRefs.current[index];
    if (el) { el.focus(); setActiveIndex(index); }
  }, []);

  const updateValue = useCallback((newValues: string[]) => {
    if (controlledValue === undefined) setInternalValue(newValues);
    const str = newValues.join('');
    onChange?.(str);
    if (newValues.every(v => v !== '')) onComplete?.(str);
  }, [controlledValue, onChange, onComplete]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const newValues = [...values];
    newValues[index] = char;
    updateValue(newValues);
    if (char && index < length - 1) focusCell(index + 1);
  }, [values, length, updateValue, focusCell]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValues = [...values];
      if (newValues[index]) {
        newValues[index] = '';
        updateValue(newValues);
      } else if (index > 0) {
        newValues[index - 1] = '';
        updateValue(newValues);
        focusCell(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault(); focusCell(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault(); focusCell(index + 1);
    }
  }, [values, length, updateValue, focusCell]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newValues = [...Array(length).fill('')];
    pasted.split('').forEach((ch, i) => { newValues[i] = ch; });
    updateValue(newValues);
    focusCell(Math.min(pasted.length, length - 1));
  }, [length, updateValue, focusCell]);

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex flex-row items-center',
        SIZE_CLASSES[size],
        ...stateClasses,
        className,
      )}
      role="group"
      aria-label="PIN input"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setActiveIndex(-1);
      }}
      {...rest}
    >
      {Array.from({ length }).map((_, i) => (
        <PinCell
          key={i}
          index={i}
          textClass={TEXT_CLASSES[size]}
          value={values[i] ?? ''}
          state={computedState}
          isActive={activeIndex === i}
          mask={mask}
          setInputRef={(el) => { inputRefs.current[i] = el; }}
          onCellClick={focusCell}
          onKeyDown={handleKeyDown}
          onInputChange={handleInputChange}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
});

PinInput.displayName = 'PinInput';
