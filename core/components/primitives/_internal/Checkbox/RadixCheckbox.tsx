/**
 * RadixCheckbox — thin adapter over @radix-ui/react-checkbox.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixCheckboxPrimitive from '@radix-ui/react-checkbox';

export const RadixCheckbox = {
  Root: RadixCheckboxPrimitive.Root,
  Indicator: RadixCheckboxPrimitive.Indicator,
};

export type RadixCheckboxRootProps = ComponentPropsWithoutRef<
  typeof RadixCheckboxPrimitive.Root
>;
