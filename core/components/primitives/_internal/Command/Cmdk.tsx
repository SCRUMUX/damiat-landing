/**
 * Cmdk — thin adapter over cmdk.
 * See [../README.md](../README.md).
 */

import type { ComponentPropsWithoutRef } from 'react';
import { Command as CommandPrimitive } from 'cmdk';

export const Cmdk = {
  Command: CommandPrimitive,
  Input: CommandPrimitive.Input,
  List: CommandPrimitive.List,
  Empty: CommandPrimitive.Empty,
  Group: CommandPrimitive.Group,
  Item: CommandPrimitive.Item,
  Separator: CommandPrimitive.Separator,
  Loading: CommandPrimitive.Loading,
};

export type CmdkCommandProps = ComponentPropsWithoutRef<typeof CommandPrimitive>;
export type CmdkItemProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Item>;
