import React from 'react';
import type { SpinnerProps, SpinnerSize, SpinnerAppearance } from './Spinner.types';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/Spinner.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: 'w-[var(--space-circular-xs)] h-[var(--space-circular-xs)]',
  sm: 'w-[var(--space-circular-sm)] h-[var(--space-circular-sm)]',
  md: 'w-[var(--space-circular-md)] h-[var(--space-circular-md)]',
  lg: 'w-[var(--space-circular-lg)] h-[var(--space-circular-lg)]',
  xl: 'w-[var(--space-circular-xl)] h-[var(--space-circular-xl)]',
};

/** Stroke width in viewBox-100 units — constant across sizes per Figma. */
const STROKE_WIDTH_VB = 6;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function buildArcPath(cx: number, cy: number, r: number, startDeg: number, sweepDeg: number): string {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, startDeg + sweepDeg);
  const largeArc = sweepDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const SpinnerInner = React.forwardRef<SVGSVGElement, SpinnerProps>(({
  size = 'md',
  appearance = 'brand',
  label = 'Loading…',
  className,
  style,
}, ref) => {
  const colorClasses = findClasses(rules, { appearance: appearance as SpinnerAppearance });
  const trackOpacity = appearance === 'inherit' ? 0.25 : 1;

  const cx = 50;
  const cy = 50;
  const r = 50 - STROKE_WIDTH_VB / 2;

  const trackPath = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.0001} ${cy - r}`;
  const fillPath = buildArcPath(cx, cy, r, 0, 270);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      fill="none"
      className={cn('animate-spin shrink-0', SIZE_CLASSES[size], ...colorClasses, className)}
      style={style}
      role="status"
      aria-label={label}
    >
      <path
        d={trackPath}
        stroke="var(--track-color)"
        strokeWidth={STROKE_WIDTH_VB}
        strokeLinecap="round"
        fill="none"
        opacity={trackOpacity}
      />
      <path
        d={fillPath}
        stroke="var(--fill-color)"
        strokeWidth={STROKE_WIDTH_VB}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
});

SpinnerInner.displayName = 'Spinner';
export const Spinner = React.memo(SpinnerInner);
