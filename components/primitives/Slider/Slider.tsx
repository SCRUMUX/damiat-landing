import React, { useState, useCallback } from 'react';
import type { SliderProps, SliderSize } from './Slider.types';
import { cn, findClasses, getFocusRing, radixRootRest, type VR } from '../_shared';
import { RadixSlider } from '../_internal';
import contract from '../../../contracts/components/Slider.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const TRACK_HEIGHT: Record<SliderSize, number> = { sm: 4, md: 6, lg: 8 };
const TRACK_RADIUS: Record<SliderSize, number> = { sm: 2, md: 3, lg: 4 };
const THUMB_SIZE: Record<SliderSize, number> = { sm: 16, md: 20, lg: 24 };

const thumbClassName =
  'block rounded-full bg-[var(--thumb-bg,var(--color-bg-base))] border border-[var(--thumb-border,var(--color-border-strong))] shadow-sm focus:outline-none';

/**
 * Slider — горизонтальный слайдер (1 или 2 thumb), backed by `@radix-ui/react-slider`.
 */
export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>((props, ref) => {
  const {
    size = 'md',
    thumbs = '1',
    min = 0,
    max = 100,
    step = 1,
    value: controlledValue,
    rangeValue: controlledRange,
    onChange,
    onRangeChange,
    disabled = false,
    className,
    ...rest
  } = props;

  const isRange = thumbs === '2';
  const [internalValue, setInternalValue] = useState(50);
  const [internalRange, setInternalRange] = useState<[number, number]>([25, 75]);

  const singleValue = controlledValue ?? internalValue;
  const rangeVal = controlledRange ?? internalRange;
  const radixValue = isRange ? rangeVal : [singleValue];

  const { trackH, trackRadius, thumbSize } = {
    trackH: TRACK_HEIGHT[size],
    trackRadius: TRACK_RADIUS[size],
    thumbSize: THUMB_SIZE[size],
  };

  const stateClasses = findClasses(rules, { thumbs });
  const focusRing = getFocusRing(contract);

  const handleValueChange = useCallback((next: number[]) => {
    if (isRange) {
      const tuple = next as [number, number];
      if (controlledRange === undefined) setInternalRange(tuple);
      onRangeChange?.(tuple);
      return;
    }
    const v = next[0] ?? min;
    if (controlledValue === undefined) setInternalValue(v);
    onChange?.(v);
  }, [controlledRange, controlledValue, isRange, max, min, onChange, onRangeChange]);

  return (
    <RadixSlider.Root
      ref={ref}
      min={min}
      max={max}
      step={step}
      value={radixValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      minStepsBetweenThumbs={isRange ? 1 : undefined}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        disabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
        ...stateClasses,
        className,
      )}
      style={{
        height: thumbSize,
        ['--track-h' as string]: `${trackH}px`,
        ['--track-radius' as string]: `${trackRadius}px`,
        ['--thumb-size' as string]: `${thumbSize}px`,
      }}
      {...radixRootRest(rest)}
    >
      <RadixSlider.Track
        className="relative h-[var(--track-h)] w-full grow rounded-[var(--track-radius)] bg-[var(--track-bg,var(--color-surface-3))]"
      >
        <RadixSlider.Range className="absolute h-full rounded-[var(--track-radius)] bg-[var(--fill-color,var(--color-brand-primary))]" />
      </RadixSlider.Track>

      <RadixSlider.Thumb
        className={cn(thumbClassName, focusRing)}
        style={{ width: thumbSize, height: thumbSize }}
        aria-label={isRange ? 'Minimum' : 'Value'}
      />

      {isRange && (
        <RadixSlider.Thumb
          className={cn(thumbClassName, focusRing)}
          style={{ width: thumbSize, height: thumbSize }}
          aria-label="Maximum"
        />
      )}
    </RadixSlider.Root>
  );
});

Slider.displayName = 'Slider';
