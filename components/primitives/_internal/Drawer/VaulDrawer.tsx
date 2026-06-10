/**
 * VaulDrawer — thin adapter over `vaul`.
 *
 * This file is the ONLY place in the codebase allowed to import `vaul`.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import { Drawer as VaulDrawerPrimitive } from 'vaul';

export const VaulDrawer = {
  Root: VaulDrawerPrimitive.Root,
  Trigger: VaulDrawerPrimitive.Trigger,
  Portal: VaulDrawerPrimitive.Portal,
  Overlay: VaulDrawerPrimitive.Overlay,
  Content: VaulDrawerPrimitive.Content,
  Title: VaulDrawerPrimitive.Title,
  Description: VaulDrawerPrimitive.Description,
  Close: VaulDrawerPrimitive.Close,
  Handle: VaulDrawerPrimitive.Handle,
};

export type VaulDrawerRootProps = ComponentPropsWithoutRef<typeof VaulDrawerPrimitive.Root>;
export type VaulDrawerContentProps = ComponentPropsWithoutRef<typeof VaulDrawerPrimitive.Content>;
export type VaulDrawerOverlayProps = ComponentPropsWithoutRef<typeof VaulDrawerPrimitive.Overlay>;
