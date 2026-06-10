/**
 * RadixDialog — thin adapter over @radix-ui/react-dialog.
 *
 * This file is the ONLY place in the codebase allowed to import
 * `@radix-ui/react-dialog`. See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import * as RadixDialogPrimitive from '@radix-ui/react-dialog';

export const RadixDialog = {
  Root: RadixDialogPrimitive.Root,
  Trigger: RadixDialogPrimitive.Trigger,
  Portal: RadixDialogPrimitive.Portal,
  Overlay: RadixDialogPrimitive.Overlay,
  Content: RadixDialogPrimitive.Content,
  Title: RadixDialogPrimitive.Title,
  Description: RadixDialogPrimitive.Description,
  Close: RadixDialogPrimitive.Close,
};

export type RadixDialogRootProps = ComponentPropsWithoutRef<
  typeof RadixDialogPrimitive.Root
>;
export type RadixDialogOverlayProps = ComponentPropsWithoutRef<
  typeof RadixDialogPrimitive.Overlay
>;
export type RadixDialogContentProps = ComponentPropsWithoutRef<
  typeof RadixDialogPrimitive.Content
>;
export type RadixDialogTitleProps = ComponentPropsWithoutRef<
  typeof RadixDialogPrimitive.Title
>;
export type RadixDialogDescriptionProps = ComponentPropsWithoutRef<
  typeof RadixDialogPrimitive.Description
>;
