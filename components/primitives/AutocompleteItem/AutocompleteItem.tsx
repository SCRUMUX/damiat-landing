/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */
import React, { useState, useCallback } from 'react';
import type { AutocompleteItemProps, AutocompleteItemSize } from './AutocompleteItem.types';
import contract from '../../../contracts/components/AutocompleteItem.contract.json';
import { cn, findClasses, type VR } from '../_shared';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<AutocompleteItemSize, string> = {
  sm: 'px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)] gap-[var(--space-button-gap-sm)] min-w-[var(--space-container-compact-min)] max-w-[var(--space-container-compact-max)] text-style-body-sm [--icon-size:20px]',
  md: 'px-[var(--space-button-x-md)] py-[var(--space-button-y-md)] gap-[var(--space-button-gap-md)] min-w-[var(--space-container-content-min)] max-w-[var(--space-container-content-max)] text-style-body [--icon-size:20px]',
  lg: 'px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)] gap-[var(--space-button-gap-lg)] min-w-[var(--space-container-wide-min)] max-w-[var(--space-container-wide-max)] text-style-body-lg [--icon-size:24px]',
};

export const AutocompleteItem = React.forwardRef<HTMLDivElement, AutocompleteItemProps>((props, ref) => {
  const {
    size = 'sm',
    appearance: appearanceProp,
    itemType,
    checkbox,
    iconLeft,
    badge1,
    badge2,
    badge3,
    iconRight,
    showCheckbox = false,
    showIconLeft = false,
    showBadge1 = false,
    showBadge2 = false,
    showBadge3 = false,
    showIconRight = false,
    children,
    className,
    ...rest
  } = props;

  const appearance = appearanceProp ?? itemType ?? 'default';
  const appearanceClasses = findClasses(rules, { itemType: appearance });

  return (
    <div
      ref={ref as any}
      className={cn(
        'transition-colors duration-150 font-base box-border flex flex-row justify-start items-center cursor-pointer hover:bg-[var(--color-brand-hover-bg)] rounded-[var(--radius-default)] outline-none focus:outline-none focus-visible:outline-none focus-visible:shadow-none',
        SIZE_CLASSES[size],
        ...appearanceClasses,
        className
      )}
      {...rest}
    >
      {showCheckbox && checkbox && <div className="shrink-0 flex items-center justify-center" style={{ width: '20px', height: '20px' }}>{checkbox}</div>}
      {showIconLeft && iconLeft && <span className="shrink-0 flex items-center justify-center [&_svg]:!w-full [&_svg]:!h-full" style={{ color: 'var(--item-icon, var(--color-icon-on-base))', width: 'var(--icon-size, 20px)', height: 'var(--icon-size, 20px)' }}>{iconLeft && (React.isValidElement(iconLeft) ? React.cloneElement(iconLeft as React.ReactElement<{ style?: React.CSSProperties }>, { style: { width: '100%', height: '100%' } }) : iconLeft)}</span>}
      <span className="flex-1 min-w-0 min-h-px whitespace-pre-wrap" style={{ color: 'var(--item-text, var(--color-text-primary))' }}>{children}</span>
      {showBadge1 && badge1 && <div className="shrink-0 flex items-center justify-center">{badge1}</div>}
      {showBadge2 && badge2 && <div className="shrink-0 flex items-center justify-center">{badge2}</div>}
      {showBadge3 && badge3 && <div className="shrink-0 flex items-center justify-center">{badge3}</div>}
      {showIconRight && iconRight && <span className="shrink-0 flex items-center justify-center [&_svg]:!w-full [&_svg]:!h-full" style={{ color: 'var(--item-icon, var(--color-icon-on-base))', width: 'var(--icon-size, 20px)', height: 'var(--icon-size, 20px)' }}>{iconRight && (React.isValidElement(iconRight) ? React.cloneElement(iconRight as React.ReactElement<{ style?: React.CSSProperties }>, { style: { width: '100%', height: '100%' } }) : iconRight)}</span>}
    </div>
  );
});

AutocompleteItem.displayName = 'AutocompleteItem';
