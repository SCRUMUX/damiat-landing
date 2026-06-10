import React, { useState, useCallback } from 'react';
import type { TabProps, TabSize, TabState, TabAppearance } from './Tab.types';
import contract from '../../../contracts/components/Tab.contract.json';
import { IconSlot } from '../_shared/IconSlot';
import { cn, findClasses, getFocusRing, type VR } from '../_shared';
import { RadixTabs } from '../_internal';
import { useTabsContext } from './Tabs';
import { TAB_IN_TABS_CLASSES } from './tab-data-state-classes';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<TabSize, string> = {
  sm: 'px-[var(--space-4)] py-[var(--space-2)] gap-[var(--space-4)] text-style-caption-xs [--icon-size:20px]',
  md: 'px-[var(--space-6)] py-[var(--space-3)] gap-[var(--space-4)] text-style-caption   [--icon-size:20px]',
  lg: 'px-[var(--space-8)] py-[var(--space-4)] gap-[var(--space-4)] text-style-body       [--icon-size:24px]',
};

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>((props, ref) => {
  const {
    appearance: appearanceProp = 'brand',
    size: sizeProp = 'sm',
    state: controlledState,
    disabled = false,
    iconLeft,
    badge,
    iconRight,
    showLeftIcon = true,
    showBadge = true,
    showRightIcon = true,
    children,
    className,
    value,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    onMouseDown,
    onMouseUp,
    ...rest
  } = props;

  const tabs = useTabsContext();
  const appearance = (tabs?.appearance ?? appearanceProp) as TabAppearance;
  const size = tabs?.size ?? sizeProp;
  const inTabs = tabs !== null && value !== undefined && controlledState === undefined;

  const [internalState, setInternalState] = useState<TabState>('base');
  const effectiveState: TabState = disabled ? 'disabled' : controlledState ?? internalState;
  const stateKey: TabState = effectiveState === 'focus' ? 'base' : effectiveState;

  const iconPx = size === 'lg' ? 24 : 20;

  // Standalone Tab: appearance + state from contract (same axis split as Button).
  const standaloneClasses = findClasses(rules, { appearance, state: stateKey });
  const focusRing = getFocusRing(contract, appearance);

  const he  = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { if (!disabled) setInternalState('hover');  onMouseEnter?.(e); }, [disabled, onMouseEnter]);
  const hl  = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { setInternalState('base');                 onMouseLeave?.(e); }, [onMouseLeave]);
  const hf  = useCallback((e: React.FocusEvent<HTMLButtonElement>) => { if (!disabled) setInternalState('focus'); onFocus?.(e); }, [disabled, onFocus]);
  const hb  = useCallback((e: React.FocusEvent<HTMLButtonElement>) => { setInternalState('base');                 onBlur?.(e); }, [onBlur]);
  const hmd = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { if (!disabled) setInternalState('active'); onMouseDown?.(e); }, [disabled, onMouseDown]);
  const hmu = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { setInternalState('hover');                onMouseUp?.(e); }, [onMouseUp]);

  const buttonClassName = cn(
    'inline-flex flex-row items-center transition-colors duration-150 box-border',
    SIZE_CLASSES[size],
    inTabs ? TAB_IN_TABS_CLASSES[appearance] : standaloneClasses,
    !disabled && !inTabs && focusRing,
    disabled && 'cursor-not-allowed pointer-events-none opacity-[var(--opacity-disabled)]',
    className,
  );

  if (inTabs) {
    return (
      <RadixTabs.Trigger
        ref={ref}
        value={value!}
        disabled={disabled}
        className={buttonClassName}
        {...rest}
      >
        {showLeftIcon && <IconSlot icon={iconLeft} size={`${iconPx}px`} className="shrink-0" />}
        <span>{children}</span>
        {showBadge && badge && <span className="shrink-0">{badge}</span>}
        {showRightIcon && <IconSlot icon={iconRight} size={`${iconPx}px`} className="shrink-0" />}
      </RadixTabs.Trigger>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={buttonClassName}
      onMouseEnter={he}
      onMouseLeave={hl}
      onFocus={hf}
      onBlur={hb}
      onMouseDown={hmd}
      onMouseUp={hmu}
      {...rest}
    >
      {showLeftIcon && <IconSlot icon={iconLeft} size={`${iconPx}px`} className="shrink-0" />}
      <span>{children}</span>
      {showBadge && badge && <span className="shrink-0">{badge}</span>}
      {showRightIcon && <IconSlot icon={iconRight} size={`${iconPx}px`} className="shrink-0" />}
    </button>
  );
});

Tab.displayName = 'Tab';
