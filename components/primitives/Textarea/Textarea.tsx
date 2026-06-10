import React, { useState, useCallback, useId } from 'react';
import type { TextareaProps, TextareaSize, TextareaState, TextareaResize } from './Textarea.types';
import { cn, findClasses, getFocusRing, type VR } from '../_shared';
import { useControllableState } from '../../../hooks/useControllableState';
import contract from '../../../contracts/components/Textarea.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<TextareaSize, string> = {
  sm: 'px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)] gap-[var(--space-4)] min-w-[var(--space-container-compact-min)] max-w-[var(--space-container-compact-max)] min-h-[var(--space-64)] rounded-[var(--radius-default)] text-style-caption font-medium',
  md: 'px-[var(--space-button-x-md)] py-[var(--space-button-y-md)] gap-[var(--space-6)] min-w-[var(--space-container-content-min)] max-w-[var(--space-container-content-max)] min-h-[var(--space-96)] rounded-[var(--radius-default)] text-style-body font-normal',
  lg: 'px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)] gap-[var(--space-8)] min-w-[var(--space-container-wide-min)] max-w-[var(--space-container-wide-max)] min-h-[var(--space-120)] rounded-[var(--radius-default)] text-style-body-lg font-medium',
};

const RESIZE_CLASS: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

const ResizerIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
    <path d="M13 10L10 13M13 6L6 13" stroke="var(--icon-color)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>((props, ref) => {
  const {
    size = 'md',
    state: stateProp,
    value: controlledValue,
    defaultValue = '',
    placeholder = 'Enter text...',
    disabled = false,
    readOnly = false,
    required = false,
    name,
    id: idProp,
    maxLength,
    minLength,
    rows,
    invalid = false,
    resize = 'vertical',
    showCharCount = false,
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    onChange,
    textareaProps,
    className,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const generatedId = useId();
  const textareaId = idProp ?? generatedId;

  const [internalState, setInternalState] = useState<TextareaState>('base');
  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange: undefined,
  });

  const effectiveState: TextareaState = (() => {
    if (stateProp) return stateProp;
    if (disabled) return 'disabled';
    return internalState;
  })();

  const stateClasses = findClasses(rules, { state: effectiveState });
  const focusRing = getFocusRing(contract);
  const isFocused = effectiveState === 'focus';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    },
    [setValue, onChange],
  );

  const he = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled && internalState !== 'focus') setInternalState('hover');
      onMouseEnter?.(e);
    },
    [disabled, internalState, onMouseEnter],
  );
  const hl = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled && internalState !== 'focus') setInternalState('base');
      onMouseLeave?.(e);
    },
    [disabled, internalState, onMouseLeave],
  );
  const hf = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!disabled) setInternalState('focus');
      onFocus?.(e);
    },
    [disabled, onFocus],
  );
  const hb = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      setInternalState('base');
      onBlur?.(e);
    },
    [onBlur],
  );

  const charCount = value.length;
  const isOverLimit = maxLength !== undefined && charCount > maxLength;

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col w-full border-solid border-[var(--border-width-base)]',
        'transition-colors duration-150',
        SIZE_CLASSES[size],
        ...stateClasses,
        invalid && 'border-[var(--color-danger-base)]',
        isFocused && !invalid && focusRing,
        isFocused && invalid && getFocusRing(contract, 'danger'),
        disabled ? 'cursor-not-allowed' : 'cursor-text',
        className,
      )}
      data-state={effectiveState}
      data-invalid={invalid || undefined}
      onMouseEnter={he}
      onMouseLeave={hl}
      onFocus={hf}
      onBlur={hb}
      {...rest}
    >
      <div className="flex-1 w-full">
        <textarea
          id={textareaId}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          rows={rows}
          onChange={handleChange}
          aria-invalid={invalid || undefined}
          aria-describedby={ariaDescribedBy}
          aria-label={ariaLabel}
          aria-required={required || undefined}
          className={cn(
            'w-full bg-transparent outline-none',
            RESIZE_CLASS[resize],
            '[&::-webkit-resizer]:!appearance-none [&::-webkit-resizer]:!bg-transparent',
            'text-[inherit] placeholder:text-[var(--color-text-muted)]',
            'min-h-0',
            disabled ? 'cursor-not-allowed' : 'cursor-text',
          )}
          {...textareaProps}
        />
      </div>

      {showCharCount && (
        <div className="flex items-center px-[var(--space-8)] pb-[var(--space-4)]">
          <span className={cn('text-[var(--font-size-10)] leading-[var(--line-height-12)]', isOverLimit ? 'text-[var(--color-danger-base)]' : 'text-[var(--color-text-muted)]')}>
            {charCount}{maxLength !== undefined ? `/${maxLength}` : ''}
          </span>
        </div>
      )}

      {resize !== 'none' && (
        <div className="absolute bottom-[var(--space-2)] right-[var(--space-2)] pointer-events-none">
          <ResizerIcon />
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
