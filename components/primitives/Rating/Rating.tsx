/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */
import React, { useCallback, useId, useState } from 'react';
import type { RatingProps, RatingSize } from './Rating.types';
import { cn, findClasses, getFocusRing, type VR } from '../_shared';
import contract from '../../../contracts/components/Rating.contract.json';
import { useControllableState } from '../../../hooks/useControllableState';

// MANUAL OVERRIDES:
// - Star SVG rendering with fractional fill overlay
// - Interactive half-star hover/click when allowHalf is enabled
// - Optional numeric value label (showValue)

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<RatingSize, string> = {
  sm: '[--star-size:16px]',
  md: '[--star-size:20px]',
  lg: '[--star-size:28px]',
};

const MAX_STARS_DEFAULT = 5;

/** Classic 5-point star path (viewBox 0 0 24 24). */
const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

function clampRating(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}

function getStarFillPercent(starIndex: number, value: number): number {
  const diff = value - starIndex;
  if (diff >= 1) return 100;
  if (diff <= 0) return 0;
  return diff * 100;
}

function formatRatingValue(value: number, precision: number): string {
  return value.toFixed(precision);
}

function resolveInteractiveValue(
  starIndex: number,
  clientX: number,
  rect: DOMRect,
  allowHalf: boolean,
): number {
  if (!allowHalf) return starIndex + 1;
  const relativeX = clientX - rect.left;
  return relativeX <= rect.width / 2 ? starIndex + 0.5 : starIndex + 1;
}

interface RatingStarProps {
  fillPercent: number;
  interactive: boolean;
  starIndex: number;
  labelId: string;
  focusRing: string;
  allowHalf: boolean;
  onSelect: (value: number) => void;
  onPreview: (value: number | null) => void;
}

const RatingStar: React.FC<RatingStarProps> = ({
  fillPercent,
  interactive,
  starIndex,
  labelId,
  focusRing,
  allowHalf,
  onSelect,
  onPreview,
}) => {
  const starLabel = `Rate ${starIndex + 1} star${starIndex === 0 ? '' : 's'}`;

  const handlePointer = useCallback(
    (clientX: number, currentTarget: EventTarget & HTMLElement) => {
      const rect = currentTarget.getBoundingClientRect();
      onPreview(resolveInteractiveValue(starIndex, clientX, rect, allowHalf));
    },
    [allowHalf, onPreview, starIndex],
  );

  const starSvg = (className: string) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('block h-[var(--star-size)] w-[var(--star-size)]', className)}
    >
      <path d={STAR_PATH} fill="currentColor" />
    </svg>
  );

  const starBody = (
    <span className="relative inline-flex shrink-0 leading-none">
      {starSvg('text-[var(--empty-color)]')}
      <span
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${fillPercent}%` }}
        aria-hidden="true"
      >
        {starSvg('text-[var(--filled-color)]')}
      </span>
    </span>
  );

  if (!interactive) {
    return starBody;
  }

  return (
    <button
      type="button"
      aria-label={starLabel}
      aria-describedby={labelId}
      className={cn(
        'inline-flex cursor-pointer border-none bg-transparent p-0 leading-none',
        focusRing,
      )}
      onMouseEnter={(event) => handlePointer(event.clientX, event.currentTarget)}
      onMouseMove={(event) => handlePointer(event.clientX, event.currentTarget)}
      onMouseLeave={() => onPreview(null)}
      onFocus={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        handlePointer(rect.left + rect.width / 2, event.currentTarget);
      }}
      onBlur={() => onPreview(null)}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onSelect(resolveInteractiveValue(starIndex, event.clientX, rect, allowHalf));
      }}
    >
      {starBody}
    </button>
  );
};

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>((props, ref) => {
  const {
    size = 'sm',
    value: controlledValue,
    defaultValue = 0,
    max = MAX_STARS_DEFAULT,
    readOnly = false,
    showValue = false,
    precision = 1,
    allowHalf = true,
    onChange,
    className,
    children,
    ...rest
  } = props;

  const labelId = useId();
  const [previewValue, setPreviewValue] = useState<number | null>(null);
  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue: clampRating(defaultValue, max),
    onChange,
  });

  const displayValue = clampRating(previewValue ?? value, max);
  const baseClasses = findClasses(rules, {});
  const focusRing = getFocusRing(contract);
  const interactive = !readOnly;

  const handleSelect = useCallback(
    (next: number) => {
      const clamped = clampRating(next, max);
      setValue(clamped);
      setPreviewValue(null);
    },
    [max, setValue],
  );

  const stars = Array.from({ length: max }, (_, index) => (
    <RatingStar
      key={index}
      starIndex={index}
      fillPercent={getStarFillPercent(index, displayValue)}
      interactive={interactive}
      labelId={labelId}
      focusRing={focusRing}
      allowHalf={allowHalf}
      onSelect={handleSelect}
      onPreview={setPreviewValue}
    />
  ));

  const valueLabel = formatRatingValue(displayValue, precision);
  const ariaLabel = `Rating: ${valueLabel} out of ${max}`;

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center font-base box-border',
        SIZE_CLASSES[size],
        ...baseClasses,
        className,
      )}
      role={interactive ? 'group' : 'img'}
      aria-label={interactive ? 'Rating' : ariaLabel}
      aria-live={interactive ? 'polite' : undefined}
      data-value={valueLabel}
      {...rest}
    >
      <span id={labelId} className="sr-only">
        {ariaLabel}
      </span>
      <span className="inline-flex items-center">{stars}</span>
      {showValue && (
        <span
          className="ml-[var(--space-2)] text-style-body-sm text-[var(--color-text-secondary)] tabular-nums"
          aria-hidden="true"
        >
          {valueLabel}
        </span>
      )}
      {children}
    </div>
  );
});

Rating.displayName = 'Rating';
