import React from 'react';

/** @UI/ListItem — 3×4×4 = 48 variants */

export type ListItemSize = 'sm' | 'md' | 'lg';

/** Interactive state — can be controlled or auto-managed via hover */
export type ListItemState = 'base' | 'hover' | 'selected' | 'disabled';

/** @deprecated Use `ListItemState` instead */
export type ListItemInteraction = ListItemState;

/**
 * iconNav        — leading icon + trailing chevron (navigation / settings rows)
 * iconMeta       — leading icon + trailing badge   (notification rows)
 * avatarContact  — leading avatar + trailing meta  (contact rows)
 * checkboxSelect — leading checkbox + trailing switch (multi-select rows)
 */
export type ListItemVariant = 'iconNav' | 'iconMeta' | 'avatarContact' | 'checkboxSelect';

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  size?: ListItemSize;
  /** Controlled state. When omitted, hover is managed internally. */
  state?: ListItemState;
  /** @deprecated Use `state` instead */
  interaction?: ListItemState;
  variant?: ListItemVariant;

  /** Primary label text */
  label?: string;
  /** Secondary / subtitle text (shown when showSubtitle=true) */
  subtitle?: string;
  /** Trailing meta text (avatarContact variant) */
  trailingMeta?: string;

  /** Slot: leading icon node (iconNav / iconMeta) */
  leadingIcon?: React.ReactNode;
  /** Slot: leading avatar node (avatarContact) */
  leadingAvatar?: React.ReactNode;
  /** Slot: leading checkbox node (checkboxSelect) */
  leadingCheckbox?: React.ReactNode;
  /** Slot: trailing chevron icon (iconNav) */
  trailingChevron?: React.ReactNode;
  /** Slot: trailing badge (iconMeta) */
  trailingBadge?: React.ReactNode;
  /** Slot: trailing action / switch (checkboxSelect) */
  trailingAction?: React.ReactNode;

  showSubtitle?: boolean;
  /** Show bottom border divider */
  showDivider?: boolean;
}
