/**
 * RadixRadioGroup — thin adapter over @radix-ui/react-radio-group.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixRadioGroupPrimitive from '@radix-ui/react-radio-group';

export const RadixRadioGroup = {
  Root: RadixRadioGroupPrimitive.Root,
  Item: RadixRadioGroupPrimitive.Item,
  Indicator: RadixRadioGroupPrimitive.Indicator,
};

export type RadixRadioGroupRootProps = ComponentPropsWithoutRef<
  typeof RadixRadioGroupPrimitive.Root
>;
export type RadixRadioGroupItemProps = ComponentPropsWithoutRef<
  typeof RadixRadioGroupPrimitive.Item
>;
