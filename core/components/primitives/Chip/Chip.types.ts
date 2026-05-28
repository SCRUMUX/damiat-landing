import React from 'react';

export type ChipAppearance = 'base' | 'brand';

export type ChipSize = 'sm' | 'md' | 'lg';

export type ChipState = 'base' | 'selected' | 'disabled' | 'exclude';

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  appearance?: ChipAppearance;
  size?: ChipSize;
  state?: ChipState;
  iconLeft?: React.ReactNode;
  closeIcon?: React.ReactNode;
  showLeftIcon?: boolean;
  showCloseIcon?: boolean;
  disabled?: boolean;
  /** Chip value for use within selection contexts */
  value?: string;
  /** Called when the close (×) icon is clicked */
  onClose?: (value?: string) => void;
}
