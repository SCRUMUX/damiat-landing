import React from 'react';

export interface CommandPaletteAction {
  id: string;
  label: string;
  group?: string;
  shortcut?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  actions?: CommandPaletteAction[];
  placeholder?: string;
  emptyMessage?: string;
  title?: string;
}
