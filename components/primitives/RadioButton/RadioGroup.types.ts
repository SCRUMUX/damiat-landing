import React from 'react';

export interface RadioGroupProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled selected value */
  value?: string;
  /** Uncontrolled initial value */
  defaultValue?: string;
  /** Called when selection changes */
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  orientation?: 'horizontal' | 'vertical';
}
