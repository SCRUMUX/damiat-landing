/**
 * RadixPopover — thin adapter over @radix-ui/react-popover.
 *
 * This file is the ONLY place in the codebase allowed to import
 * `@radix-ui/react-popover`. All AICADS components that need popover
 * behavior must consume it via this adapter (or via the public
 * `components/primitives/Popover` which itself is built on top of this).
 *
 * Rationale:
 * - Encapsulates the third-party library behind a stable internal surface,
 *   so a future swap (e.g. floating-ui direct, or a different headless lib)
 *   touches only this file.
 * - Keeps the public AICADS API decoupled from Radix prop names and DOM
 *   structure conventions.
 * - Enforced by ESLint `no-restricted-imports` rule scoped to `_internal/`.
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixPopoverPrimitive from '@radix-ui/react-popover';

export const RadixPopover = {
  Root: RadixPopoverPrimitive.Root,
  Trigger: RadixPopoverPrimitive.Trigger,
  Anchor: RadixPopoverPrimitive.Anchor,
  Portal: RadixPopoverPrimitive.Portal,
  Content: RadixPopoverPrimitive.Content,
  Arrow: RadixPopoverPrimitive.Arrow,
  Close: RadixPopoverPrimitive.Close,
};

export type RadixPopoverContentProps = ComponentPropsWithoutRef<
  typeof RadixPopoverPrimitive.Content
>;
export type RadixPopoverTriggerProps = ComponentPropsWithoutRef<
  typeof RadixPopoverPrimitive.Trigger
>;
export type RadixPopoverRootProps = ComponentPropsWithoutRef<
  typeof RadixPopoverPrimitive.Root
>;
export type RadixPopoverAnchorProps = ComponentPropsWithoutRef<
  typeof RadixPopoverPrimitive.Anchor
>;
