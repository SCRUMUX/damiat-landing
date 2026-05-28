import React from 'react';

/** Native-style select dropdown. 3 sizes (sm/md/lg), states base/hover/focus/disabled. Chevron icon on the right. */

export type SelectSize = 'sm' | 'md' | 'lg';

export type SelectState = 'base' | 'hover' | 'focus' | 'disabled';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  size?: SelectSize;
  /** Visual state override for matrix stories */
  state?: SelectState;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}
