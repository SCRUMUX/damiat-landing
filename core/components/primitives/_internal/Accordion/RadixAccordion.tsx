/**
 * RadixAccordion — thin adapter over @radix-ui/react-accordion.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixAccordionPrimitive from '@radix-ui/react-accordion';

export const RadixAccordion = {
  Root: RadixAccordionPrimitive.Root,
  Item: RadixAccordionPrimitive.Item,
  Header: RadixAccordionPrimitive.Header,
  Trigger: RadixAccordionPrimitive.Trigger,
  Content: RadixAccordionPrimitive.Content,
};

export type RadixAccordionRootProps = ComponentPropsWithoutRef<
  typeof RadixAccordionPrimitive.Root
>;
