import React from 'react';
import type { AutocompleteItemProps } from '../AutocompleteItem/AutocompleteItem.types';

export type AutocompleteState = 'closed' | 'open';

export type AutocompleteSize = 'sm' | 'md' | 'lg';

export type AutocompleteAppearance = 'brand' | 'base' | 'ghost' | 'outline';

export interface AutocompleteOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface AutocompleteProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  state?: AutocompleteState;
  size?: AutocompleteSize;
  /** Visual variant of the trigger */
  appearance?: AutocompleteAppearance;

  /* ── Slot props (backward-compatible) ── */
  searchIcon?: React.ReactNode;
  /** @deprecated Use `multiple` + `options` API. This prop is no longer rendered. */
  tagRow?: React.ReactNode;
  /** @deprecated Use structured `options` API with `showClearButton`. This prop is no longer rendered. */
  clearIcon?: React.ReactNode;
  /** @deprecated Use `multiple` + `options` API. This prop is no longer rendered. */
  showTagRow?: boolean;
  showClearIcon?: boolean;
  placeholder?: string;

  /** Legacy items API */
  items?: Array<AutocompleteItemProps & { onClick?: () => void }>;

  /* ── Structured API ── */
  /** Static options list (will be client-filtered by default) */
  options?: AutocompleteOption[];
  /** Selected value(s). String for single, string[] for multi. */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  /** Enable multi-select */
  multiple?: boolean;
  /** Enable tri-state exclude mode: unchecked → checked → exclude → unchecked */
  allowExclude?: boolean;
  /** Currently excluded values (used with allowExclude) */
  excludedValues?: string[];
  /** Default excluded values (uncontrolled) */
  defaultExcludedValues?: string[];
  /** Called when excluded values change */
  onExcludedChange?: (excluded: string[]) => void;

  /* ── Search / filter ── */
  /** Controlled input text */
  inputValue?: string;
  /** Called when the search input changes — use for async/server filtering */
  onInputChange?: (query: string) => void;
  /** Custom filter function; return true to keep option. Defaults to case-insensitive includes. */
  filterFn?: (option: AutocompleteOption, query: string) => boolean;
  /** Minimum characters before opening the popover. Default 0 */
  minLength?: number;

  /* ── Loading / empty ── */
  /** Whether results are loading (shows spinner) */
  loading?: boolean;
  /** Custom empty-state node */
  noResultsMessage?: React.ReactNode;

  /* ── Behavioral ── */
  disabled?: boolean;
  /** Accessible label */
  'aria-label'?: string;
  onOpenChange?: (open: boolean) => void;
  /** Take full width of parent */
  fullWidth?: boolean;
  /** @deprecated Chips now dynamically fill available width. This prop is ignored. */
  maxVisibleChips?: number;
}
