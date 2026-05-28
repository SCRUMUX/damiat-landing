import React from 'react';
import type { CircularProgressProps, CircularProgressSize } from './CircularProgress.types';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/CircularProgress.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<CircularProgressSize, string> = {
  xs: 'w-[var(--space-circular-xs)] h-[var(--space-circular-xs)]',
  sm: 'w-[var(--space-circular-sm)] h-[var(--space-circular-sm)]',
  md: 'w-[var(--space-circular-md)] h-[var(--space-circular-md)]',
  lg: 'w-[var(--space-circular-lg)] h-[var(--space-circular-lg)]',
  xl: 'w-[var(--space-circular-xl)] h-[var(--space-circular-xl)]',
};

/** Stroke width in viewBox-100 units. Constant across sizes per Figma. */
const STROKE_WIDTH_VB = 6;

type LabelSpec = { fontSize: number; fontWeight: number };
const LABEL_SPEC: Record<CircularProgressSize, LabelSpec> = {
  xs: { fontSize:  0, fontWeight: 400 },
  sm: { fontSize:  0, fontWeight: 400 },
  md: { fontSize: 20, fontWeight: 400 },
  lg: { fontSize: 18, fontWeight: 400 },
  xl: { fontSize: 17, fontWeight: 400 },
};

const SHOWS_LABEL = new Set<CircularProgressSize>(['md', 'lg', 'xl']);

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const clampedEnd = Math.min(endDeg, startDeg + 359.999);
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end   = polarToCartesian(cx, cy, r, clampedEnd);
  const largeArc = clampedEnd - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>((props, ref) => {
  const {
    size = 'md',
    value = 0,
    showLabel,
    className,
    style,
    ...rest
  } = props;

  const colorClasses = findClasses(rules, {});
  const { fontSize, fontWeight } = LABEL_SPEC[size];
  const strokeWidth = STROKE_WIDTH_VB;
  const pct = Math.max(0, Math.min(100, value));
  const displayLabel = showLabel !== undefined ? showLabel : SHOWS_LABEL.has(size);

  const cx = 50;
  const cy = 50;
  const r  = 50 - strokeWidth / 2;
  const fillEndDeg = pct * 3.6;

  const trackPath = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`;
  const fillPath  = pct === 0
    ? ''
    : pct >= 100
      ? trackPath
      : arcPath(cx, cy, r, 0, fillEndDeg);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      fill="none"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${pct}%`}
      className={cn('shrink-0', SIZE_CLASSES[size], ...colorClasses, className)}
      style={style}
      {...rest}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--track-color)"
        strokeWidth={strokeWidth}
      />

      {pct > 0 && (
        <path
          d={fillPath}
          fill="none"
          stroke="var(--fill-color)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      )}

      {displayLabel && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-text-primary)"
          fontSize={fontSize}
          fontWeight={fontWeight}
          fontFamily="var(--font-family-base)"
          style={{ userSelect: 'none' }}
        >
          {`${Math.round(pct)}%`}
        </text>
      )}
    </svg>
  );
});

CircularProgress.displayName = 'CircularProgress';
