import React, { useState, useCallback } from 'react';
import type { RangeSliderProps, RangeSliderSize, RangeSliderState } from './RangeSlider.types';
import { cn, findClasses, getFocusRing, radixRootRest, type VR } from '../_shared';
import { RadixSlider } from '../_internal';
import contract from '../../../contracts/components/RangeSlider.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const TRACK_HEIGHT: Record<RangeSliderSize, number> = { sm: 4, md: 6, lg: 8 };
const THUMB_SIZE: Record<RangeSliderSize, number> = { sm: 16, md: 20, lg: 24 };

const thumbClassName =
  'block rounded-full bg-[var(--color-bg-base)] border border-[var(--fill-color,var(--color-brand-primary))] shadow-sm focus:outline-none';

/**
 * RangeSlider — dual-thumb range slider, backed by `@radix-ui/react-slider`.
 */
export const RangeSlider = React.forwardRef<HTMLSpanElement, RangeSliderProps>((props, ref) => {
  const {
    size = 'sm',
    state: stateProp,
    min = 0,
    max = 100,
    step = 1,
    value: controlledValue,
    defaultValue = [25, 75],
    onValueChange,
    disabled = false,
    className,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
  const [internalState, setInternalState] = useState<RangeSliderState>('base');

  const effectiveValue = controlledValue ?? internalValue;
  const isVisualOverride = stateProp !== undefined;

  const effectiveState: RangeSliderState = (() => {
    if (stateProp) return stateProp;
    if (disabled) return 'disabled';
    return internalState;
  })();

  const stateClasses = findClasses(rules, { state: effectiveState });
  const focusRing = getFocusRing(contract);

  const trackH = TRACK_HEIGHT[size];
  const thumbSize = THUMB_SIZE[size];

  const handleValueChange = useCallback((next: number[]) => {
    if (isVisualOverride) return;
    const tuple = next as [number, number];
    if (controlledValue === undefined) setInternalValue(tuple);
    onValueChange?.(tuple);
  }, [controlledValue, isVisualOverride, onValueChange]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    if (!stateProp && !disabled) setInternalState('hover');
    onMouseEnter?.(e);
  }, [disabled, onMouseEnter, stateProp]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    if (!stateProp && !disabled) setInternalState('base');
    onMouseLeave?.(e);
  }, [disabled, onMouseLeave, stateProp]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLSpanElement>) => {
    if (!stateProp && !disabled) setInternalState('hover');
    onFocus?.(e);
  }, [disabled, onFocus, stateProp]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLSpanElement>) => {
    if (!stateProp && !disabled) setInternalState('base');
    onBlur?.(e);
  }, [disabled, onBlur, stateProp]);

  const displayValue: [number, number] = isVisualOverride ? [25, 75] : effectiveValue;
  const isDisabled = disabled || effectiveState === 'disabled';

  return (
    <RadixSlider.Root
      ref={ref}
      min={min}
      max={max}
      step={step}
      value={displayValue}
      onValueChange={handleValueChange}
      disabled={isDisabled || isVisualOverride}
      minStepsBetweenThumbs={1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        isDisabled && 'opacity-[var(--opacity-disabled)] cursor-not-allowed',
        ...stateClasses,
        className,
      )}
      style={{
        height: thumbSize,
        ['--track-h' as string]: `${trackH}px`,
      }}
      {...radixRootRest(rest)}
    >
      <RadixSlider.Track
        className="relative h-[var(--track-h)] w-full grow rounded-[var(--radius-full)] bg-[var(--track-color,var(--color-surface-3))]"
      >
        <RadixSlider.Range className="absolute h-full rounded-[var(--radius-full)] bg-[var(--fill-color,var(--color-brand-primary))]" />
      </RadixSlider.Track>

      <RadixSlider.Thumb
        className={cn(thumbClassName, !isDisabled && focusRing)}
        style={{ width: thumbSize, height: thumbSize }}
        aria-label="Minimum"
      />
      <RadixSlider.Thumb
        className={cn(thumbClassName, !isDisabled && focusRing)}
        style={{ width: thumbSize, height: thumbSize }}
        aria-label="Maximum"
      />
    </RadixSlider.Root>
  );
});

RangeSlider.displayName = 'RangeSlider';
