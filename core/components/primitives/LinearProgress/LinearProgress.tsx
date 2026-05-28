import React from 'react';
import type { LinearProgressProps, LinearProgressSize } from './LinearProgress.types';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/LinearProgress.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<LinearProgressSize, string> = {
  sm: 'h-[var(--space-track-h-sm)]',
  md: 'h-[var(--space-track-h-md)]',
  lg: 'h-[var(--space-track-h-lg)]',
};

export const LinearProgress = React.forwardRef<HTMLDivElement, LinearProgressProps>((props, ref) => {
  const {
    size = 'md',
    value = 0,
    label,
    className,
    style,
    ...rest
  } = props;

  const pct = Math.max(0, Math.min(100, value));
  const colorClasses = findClasses(rules, {});

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `Progress: ${pct}%`}
      className={cn(
        'relative w-full overflow-hidden transition-all duration-150',
        SIZE_CLASSES[size],
        ...colorClasses,
        'bg-[var(--track-bg)]',
        className,
      )}
      style={style}
      {...rest}
    >
      <div
        className={cn(
          'absolute left-0 top-0 h-full rounded-pill',
          'bg-[var(--fill-color)]',
          'transition-[width] duration-300 ease-in-out',
        )}
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      />
    </div>
  );
});

LinearProgress.displayName = 'LinearProgress';
