/**
 * RadixSelect — thin adapter over @radix-ui/react-select.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixSelectPrimitive from '@radix-ui/react-select';

export const RadixSelect = {
  Root: RadixSelectPrimitive.Root,
  Trigger: RadixSelectPrimitive.Trigger,
  Value: RadixSelectPrimitive.Value,
  Icon: RadixSelectPrimitive.Icon,
  Portal: RadixSelectPrimitive.Portal,
  Content: RadixSelectPrimitive.Content,
  Viewport: RadixSelectPrimitive.Viewport,
  Item: RadixSelectPrimitive.Item,
  ItemText: RadixSelectPrimitive.ItemText,
  ItemIndicator: RadixSelectPrimitive.ItemIndicator,
  Group: RadixSelectPrimitive.Group,
  Label: RadixSelectPrimitive.Label,
  Separator: RadixSelectPrimitive.Separator,
};

export type RadixSelectTriggerProps = ComponentPropsWithoutRef<
  typeof RadixSelectPrimitive.Trigger
>;
export type RadixSelectContentProps = ComponentPropsWithoutRef<
  typeof RadixSelectPrimitive.Content
>;
