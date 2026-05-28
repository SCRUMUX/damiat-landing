/**
 * RadixTabs — thin adapter over @radix-ui/react-tabs.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixTabsPrimitive from '@radix-ui/react-tabs';

export const RadixTabs = {
  Root: RadixTabsPrimitive.Root,
  List: RadixTabsPrimitive.List,
  Trigger: RadixTabsPrimitive.Trigger,
  Content: RadixTabsPrimitive.Content,
};

export type RadixTabsRootProps = ComponentPropsWithoutRef<
  typeof RadixTabsPrimitive.Root
>;
