import React from 'react';

/** Switch: 4 размера (xs, sm, md, lg), 4 состояния (on, off, disabled-on, disabled-off). Pill track + thumb. */

export type SwitchSize  = 'xs' | 'sm' | 'md' | 'lg';
export type SwitchState = 'on' | 'off' | 'disabled-on' | 'disabled-off';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  size?: SwitchSize;
  /** Controlled state — if omitted the switch manages its own on/off state */
  state?: SwitchState;
  disabled?: boolean;
  /** Initial value for uncontrolled mode (default false = off) */
  defaultChecked?: boolean;
  /** Called when the switch is toggled; receives the new checked value */
  onToggle?: (checked: boolean) => void;
}
