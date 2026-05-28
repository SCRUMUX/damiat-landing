/**
 * RadixSwitch — thin adapter over @radix-ui/react-switch.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixSwitchPrimitive from '@radix-ui/react-switch';

export const RadixSwitch = {
  Root: RadixSwitchPrimitive.Root,
  Thumb: RadixSwitchPrimitive.Thumb,
};

export type RadixSwitchRootProps = ComponentPropsWithoutRef<
  typeof RadixSwitchPrimitive.Root
>;
