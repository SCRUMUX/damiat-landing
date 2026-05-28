import React from 'react';
import type { DividerProps, DividerSize } from './Divider.types';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/Divider.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

/** Thickness tokens — mirrors Divider.contract responsiveProps.lineThickness */
const THICKNESS: Record<DividerSize, string> = {
  sm: 'var(--space-track-h-sm)',
  md: 'var(--space-track-h-md)',
  lg: 'var(--space-track-h-lg)',
};

const DividerInner = React.forwardRef<HTMLDivElement, DividerProps>(({
  orientation = 'horizontal',
  size = 'sm',
  appearance = 'base',
  length,
  className,
  style,
}, ref) => {
  const isHorizontal = orientation === 'horizontal';
  const appearanceClasses = findClasses(rules, { appearance });

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 rounded-[var(--radius-default)]',
        ...appearanceClasses,
        isHorizontal ? 'w-full' : 'h-full',
        className,
      )}
      style={{
        backgroundColor: 'var(--line-color)',
        ...(isHorizontal
          ? { height: THICKNESS[size], width: length }
          : { width: THICKNESS[size], height: length }),
        ...style,
      }}
    />
  );
});

DividerInner.displayName = 'Divider';
export const Divider = React.memo(DividerInner);
