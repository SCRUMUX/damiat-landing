/**
 * RadixTooltip — thin adapter over @radix-ui/react-tooltip.
 *
 * This file is the ONLY place in the codebase allowed to import
 * `@radix-ui/react-tooltip`. All AICADS components that need tooltip
 * behavior must consume it via this adapter (or via the public
 * `components/primitives/Tooltip` which itself is built on top of this).
 *
 * Same isolation contract as `_internal/Popover/RadixPopover.tsx`. See
 * [../README.md](../README.md) for the rationale.
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixTooltipPrimitive from '@radix-ui/react-tooltip';

export const RadixTooltip = {
  Provider: RadixTooltipPrimitive.Provider,
  Root: RadixTooltipPrimitive.Root,
  Trigger: RadixTooltipPrimitive.Trigger,
  Portal: RadixTooltipPrimitive.Portal,
  Content: RadixTooltipPrimitive.Content,
  Arrow: RadixTooltipPrimitive.Arrow,
};

export type RadixTooltipProviderProps = ComponentPropsWithoutRef<
  typeof RadixTooltipPrimitive.Provider
>;
export type RadixTooltipRootProps = ComponentPropsWithoutRef<
  typeof RadixTooltipPrimitive.Root
>;
export type RadixTooltipTriggerProps = ComponentPropsWithoutRef<
  typeof RadixTooltipPrimitive.Trigger
>;
export type RadixTooltipContentProps = ComponentPropsWithoutRef<
  typeof RadixTooltipPrimitive.Content
>;
