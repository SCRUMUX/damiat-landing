import React from 'react';
import type { DropdownItemProps } from '../DropdownItem/DropdownItem.types';

export type DropdownState = 'closed' | 'open';

export type DropdownSize = 'sm' | 'md' | 'lg';

export type DropdownAppearance = 'brand' | 'base' | 'ghost' | 'outline';

export interface DropdownOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  state?: DropdownState;
  size?: DropdownSize;
  appearance?: DropdownAppearance;

  iconLeft?: React.ReactNode;
  tagRow?: React.ReactNode;
  badge?: React.ReactNode;
  chevron?: React.ReactNode;
  /** @deprecated Submenu is now controlled via `submenuItems` on DropdownItem. */
  showSubmenu?: boolean;
  showIconLeft?: boolean;
  showBadge?: boolean;
  showTagRow?: boolean;

  items?: Array<DropdownItemProps & { onClick?: () => void }>;

  options?: DropdownOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  allowExclude?: boolean;
  excludedValues?: string[];
  defaultExcludedValues?: string[];
  onExcludedChange?: (excluded: string[]) => void;

  disabled?: boolean;
  placeholder?: string;
  'aria-label'?: string;

  onOpenChange?: (open: boolean) => void;
  fullWidth?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
  /** @deprecated Chips now dynamically fill available width. */
  maxVisibleChips?: number;
}
