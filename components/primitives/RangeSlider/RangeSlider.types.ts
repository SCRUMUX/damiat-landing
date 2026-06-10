import React from 'react';

/** Dual-thumb range slider for min/max value selection. 3 sizes (sm/md/lg), states base/hover/disabled. */

export type RangeSliderSize = 'sm' | 'md' | 'lg';

export type RangeSliderState = 'base' | 'hover' | 'disabled';

export interface RangeSliderProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'defaultValue' | 'onChange'> {
  size?: RangeSliderSize;
  /** Visual state override for matrix stories */
  state?: RangeSliderState;
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  disabled?: boolean;
}
