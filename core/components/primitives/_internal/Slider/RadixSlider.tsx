/**
 * RadixSlider — thin adapter over @radix-ui/react-slider.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixSliderPrimitive from '@radix-ui/react-slider';

export const RadixSlider = {
  Root: RadixSliderPrimitive.Root,
  Track: RadixSliderPrimitive.Track,
  Range: RadixSliderPrimitive.Range,
  Thumb: RadixSliderPrimitive.Thumb,
};

export type RadixSliderRootProps = ComponentPropsWithoutRef<
  typeof RadixSliderPrimitive.Root
>;
