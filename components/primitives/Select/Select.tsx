import React, { useState, useCallback } from 'react';
import type { SelectProps, SelectSize, SelectState, SelectOption } from './Select.types';
import { cn, findClasses, getFocusRing, MENU_ITEM_CLASSES, MENU_PANEL_PADDING, radixSelectTriggerRest, type VR } from '../_shared';
import { RadixSelect } from '../_internal';
import contract from '../../../contracts/components/Select.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<SelectSize, string> = {
  sm: 'min-h-[var(--space-28)] px-[var(--space-input-inset-x-sm)] text-style-body-sm [--icon-size:14px]',
  md: 'min-h-[var(--space-36)] px-[var(--space-input-inset-x-md)] text-style-body [--icon-size:16px]',
  lg: 'min-h-[var(--space-40)] px-[var(--space-input-inset-x-lg)] text-style-body-lg [--icon-size:18px]',
};

const ChevronIcon: React.FC = () => (
  <svg
    width="var(--icon-size, 16px)"
    height="var(--icon-size, 16px)"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className="shrink-0 text-[var(--icon-color,var(--color-icon-on-base))]"
  >
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

function StaticSelect({
  size,
  state,
  placeholder,
  className,
  children,
}: {
  size: SelectSize;
  state: SelectState;
  placeholder: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const stateClasses = findClasses(rules, { state: state === 'focus' ? 'focus' : state });
  const focusRing = state === 'focus' ? getFocusRing(contract) : '';

  return (
    <div
      className={cn(
        'inline-flex w-full min-w-[var(--space-160)] items-center justify-between gap-[var(--space-8)] rounded-default border font-base transition-colors duration-150 box-border',
        SIZE_CLASSES[size],
        ...stateClasses,
        focusRing,
        className,
      )}
    >
      <span className="truncate">{children ?? placeholder}</span>
      <ChevronIcon />
    </div>
  );
}

/**
 * Select — dropdown trigger + listbox, backed by `@radix-ui/react-select`.
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
  const {
    size = 'sm',
    state: stateProp,
    value,
    defaultValue,
    onValueChange,
    options = DEFAULT_OPTIONS,
    placeholder = 'Select...',
    disabled = false,
    className,
    children,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const [internalState, setInternalState] = useState<SelectState>('base');
  const isVisualOverride = stateProp !== undefined;

  const effectiveState: SelectState = (() => {
    if (stateProp) return stateProp;
    if (disabled) return 'disabled';
    return internalState;
  })();

  if (isVisualOverride) {
    return (
      <StaticSelect
        size={size}
        state={stateProp!}
        placeholder={placeholder}
        className={className}
      >
        {children ?? (stateProp === 'disabled' ? placeholder : options[0]?.label ?? placeholder)}
      </StaticSelect>
    );
  }

  const stateClasses = findClasses(rules, {
    state: effectiveState === 'focus' ? 'base' : effectiveState,
  });
  const focusRing = getFocusRing(contract);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('hover');
    onMouseEnter?.(e as unknown as React.MouseEvent<HTMLDivElement>);
  }, [disabled, onMouseEnter]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('base');
    onMouseLeave?.(e as unknown as React.MouseEvent<HTMLDivElement>);
  }, [disabled, onMouseLeave]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('focus');
    onFocus?.(e as unknown as React.FocusEvent<HTMLDivElement>);
  }, [disabled, onFocus]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled) setInternalState('base');
    onBlur?.(e as unknown as React.FocusEvent<HTMLDivElement>);
  }, [disabled, onBlur]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!disabled) setInternalState(open ? 'focus' : 'base');
  }, [disabled]);

  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      onOpenChange={handleOpenChange}
    >
      <RadixSelect.Trigger
        ref={ref}
        className={cn(
          'inline-flex w-full min-w-[var(--space-160)] items-center justify-between gap-[var(--space-8)] rounded-default border font-base transition-colors duration-150 box-border',
          'data-[placeholder]:text-[var(--color-text-muted)]',
          SIZE_CLASSES[size],
          ...stateClasses,
          focusRing,
          disabled && 'cursor-not-allowed opacity-[var(--opacity-disabled)]',
          className,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...(radixSelectTriggerRest(rest) as unknown as React.ComponentPropsWithoutRef<typeof RadixSelect.Trigger>)}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon asChild>
          <ChevronIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          className={cn(
            'z-popover overflow-hidden rounded-default border border-[var(--color-border-base)]',
            'bg-[var(--color-surface-1)] shadow-elevation-2',
            'animate-fade-in',
          )}
          position="popper"
          sideOffset={4}
        >
          <RadixSelect.Viewport className="p-[var(--space-dropdown-popover-inset)]">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-default outline-none',
                  MENU_ITEM_CLASSES[size],
                  'text-[var(--color-text-primary)]',
                  'data-[highlighted]:bg-[var(--color-surface-2)] data-[highlighted]:text-[var(--color-text-primary)]',
                  'data-[disabled]:pointer-events-none data-[disabled]:opacity-[var(--opacity-disabled)]',
                )}
              >
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="absolute right-2 inline-flex items-center text-[var(--color-brand-primary)]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
});

Select.displayName = 'Select';
