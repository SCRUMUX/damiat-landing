/**
 * RadixScrollArea — thin adapter over @radix-ui/react-scroll-area.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixScrollAreaPrimitive from '@radix-ui/react-scroll-area';

export const RadixScrollArea = {
  Root: RadixScrollAreaPrimitive.Root,
  Viewport: RadixScrollAreaPrimitive.Viewport,
  Scrollbar: RadixScrollAreaPrimitive.Scrollbar,
  Thumb: RadixScrollAreaPrimitive.Thumb,
  Corner: RadixScrollAreaPrimitive.Corner,
};

export type RadixScrollAreaRootProps = ComponentPropsWithoutRef<
  typeof RadixScrollAreaPrimitive.Root
>;
