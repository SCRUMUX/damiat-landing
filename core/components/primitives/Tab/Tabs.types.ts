import React from 'react';

import type { TabSize, TabAppearance } from './Tab.types';

export interface TabsProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: TabSize;
  appearance?: TabAppearance;
  orientation?: 'horizontal' | 'vertical';
}
