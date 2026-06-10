import React, { useState, useCallback, useEffect, useRef, useId, useMemo } from 'react';
import type { AutocompleteProps, AutocompleteSize, AutocompleteOption } from './Autocomplete.types';
import { cn, findClasses, getFocusRing, type VR, MENU_ITEM_CLASSES, MENU_PANEL_PADDING } from '../_shared';
import { IconSlot } from '../_shared/IconSlot';
import { ClearButton } from '../_shared/ClearButton';
import { Popover } from '../Popover/Popover';
import { Chip } from '../Chip/Chip';
import { Checkbox } from '../Checkbox/Checkbox';
import { Badge } from '../Badge/Badge';
import { Spinner } from '../Spinner/Spinner';
import { AutocompleteItem } from '../AutocompleteItem/AutocompleteItem';
import { useControllableState } from '../../../hooks/useControllableState';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useEscapeKey } from '../../../hooks/useEscapeKey';
import { usePopoverState } from '../../../hooks/usePopoverState';
import { useOverflowCounter } from '../../../hooks/useOverflowCounter';
import { mergeRefs } from '../../../hooks/mergeRefs';
import contract from '../../../contracts/components/Autocomplete.contract.json';
import { Cmdk } from '../_internal';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<AutocompleteSize, string> = {
  sm: 'px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)] min-h-[var(--space-28)] min-w-[var(--space-container-compact-min)] gap-[var(--space-button-gap-sm)] text-style-caption rounded-[var(--radius-default)] [--icon-size:20px]',
  md: 'px-[var(--space-button-x-md)] py-[var(--space-button-y-md)] min-h-[var(--space-36)] min-w-[var(--space-container-content-min)] gap-[var(--space-button-gap-md)] text-style-body rounded-[var(--radius-default)] [--icon-size:20px]',
  lg: 'px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)] min-h-[var(--space-40)] min-w-[var(--space-container-content-min)] gap-[var(--space-button-gap-lg)] text-style-body-lg rounded-[var(--radius-default)] [--icon-size:24px]',
};

const SearchIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);


const CheckIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function defaultFilter(opt: AutocompleteOption, query: string): boolean {
  const label = (opt.label ?? opt.value).toLowerCase();
  return label.includes(query.toLowerCase());
}

export const Autocomplete = React.forwardRef<HTMLDivElement, AutocompleteProps>((props, ref) => {
  const {
    state = 'closed',
    size = 'sm',
    appearance,
    searchIcon,
    tagRow,
    clearIcon,
    showTagRow = false,
    showClearIcon = false,
    placeholder = 'Search...',
    items,
    options,
    value: valueProp,
    defaultValue,
    onChange,
    multiple = false,
    allowExclude = false,
    excludedValues: excludedProp,
    defaultExcludedValues,
    onExcludedChange,
    inputValue: inputValueProp,
    onInputChange,
    filterFn = defaultFilter,
    minLength = 0,
    loading = false,
    noResultsMessage = 'No results found',
    disabled = false,
    'aria-label': ariaLabel,
    onOpenChange,
    fullWidth = false,
    children,
    className,
    ...rest
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    if (tagRow !== undefined) console.warn('[Autocomplete] `tagRow` is deprecated. Use `multiple` + `options` API instead.');
    if (clearIcon !== undefined) console.warn('[Autocomplete] `clearIcon` is deprecated. Use structured `options` API with `showClearButton`.');
    if (showTagRow) console.warn('[Autocomplete] `showTagRow` is deprecated. Use `multiple` + `options` API instead.');
    if ((props as any).maxVisibleChips !== undefined) console.warn('[Autocomplete] `maxVisibleChips` is deprecated. Chips now dynamically fill available width.');
  }

  const listboxId = useId();

  // ── Selection ──
  const normalizeValue = useCallback(
    (v: string | string[] | undefined): string[] => {
      if (v === undefined) return [];
      return Array.isArray(v) ? v : [v];
    },
    [],
  );

  const [selected, setSelected] = useControllableState<string[]>({
    value: valueProp !== undefined ? normalizeValue(valueProp) : undefined,
    defaultValue: normalizeValue(defaultValue),
    onChange: (v) => onChange?.(multiple ? v : v[0] ?? ''),
  });

  const [excluded, setExcluded] = useControllableState<string[]>({
    value: excludedProp,
    defaultValue: defaultExcludedValues ?? [],
    onChange: (v) => onExcludedChange?.(v),
  });

  const allChipValues = useMemo(() => [...selected, ...excluded], [selected, excluded]);

  // ── Input text ──
  const [internalQuery, setInternalQuery] = useState('');
  const query = inputValueProp ?? internalQuery;

  const setQuery = useCallback(
    (v: string) => {
      if (inputValueProp === undefined) setInternalQuery(v);
      onInputChange?.(v);
    },
    [inputValueProp, onInputChange],
  );

  // ── Open state ──
  const { isOpen, open: openInternal, close: closeInternal, setIsOpen } = usePopoverState({
    defaultOpen: state === 'open',
    onOpenChange,
    disabled,
  });

  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const mergedRef = mergeRefs(ref, containerRef);

  const optionList = options ?? [];

  // ── Filtering ──
  const filteredOptions = useMemo(() => {
    if (optionList.length === 0) return [];
    if (!query) return optionList;
    return optionList.filter((o) => filterFn(o, query));
  }, [optionList, query, filterFn]);

  const effectiveItemCount = items?.length ?? filteredOptions.length;

  const { renderCount, overflowCount, showGradient } = useOverflowCounter(chipsRef, allChipValues.length);

  const close = useCallback(() => {
    closeInternal();
    setActiveIndex(-1);
  }, [closeInternal]);

  const openPopover = useCallback(() => {
    if (query.length >= minLength) {
      openInternal();
    }
  }, [minLength, query, openInternal]);

  // ── Click outside / Escape ──
  useClickOutside([containerRef, popoverRef], close, isOpen);
  useEscapeKey(close, isOpen);

  // ── Focus input when opened ──
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // ── Selection ──
  const toggleOption = useCallback(
    (val: string) => {
      if (multiple) {
        if (allowExclude) {
          const isSelected = selected.includes(val);
          const isExcluded = excluded.includes(val);
          if (!isSelected && !isExcluded) {
            setSelected((prev) => [...prev, val]);
          } else if (isSelected) {
            setSelected((prev) => prev.filter((v) => v !== val));
            setExcluded((prev) => [...prev, val]);
          } else {
            setExcluded((prev) => prev.filter((v) => v !== val));
          }
        } else {
          setSelected((prev) =>
            prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
          );
        }
      } else {
        setSelected([val]);
        setQuery('');
        close();
      }
    },
    [multiple, allowExclude, selected, excluded, setSelected, setExcluded, setQuery, close],
  );

  const removeChip = useCallback(
    (val?: string) => {
      if (val) {
        setSelected((prev) => prev.filter((v) => v !== val));
        setExcluded((prev) => prev.filter((v) => v !== val));
      }
    },
    [setSelected, setExcluded],
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setSelected([]);
    setExcluded([]);
    inputRef.current?.focus();
  }, [setQuery, setSelected]);

  // ── Input change ──
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      if (!isOpen && val.length >= minLength) {
        setIsOpen(true);
      }
      setActiveIndex(0);
    },
    [setQuery, isOpen, minLength, setIsOpen],
  );

  // ── Keyboard ──
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          openPopover();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % effectiveItemCount);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + effectiveItemCount) % effectiveItemCount);
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(effectiveItemCount - 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0) {
            if (filteredOptions.length > 0) {
              const opt = filteredOptions[activeIndex];
              if (opt && !opt.disabled) toggleOption(opt.value);
            } else if (items?.[activeIndex]) {
              items[activeIndex].onClick?.();
              close();
            }
          }
          break;
        case 'Backspace':
          if (multiple && query === '' && selected.length > 0) {
            removeChip(selected[selected.length - 1]);
          }
          break;
      }
    },
    [isOpen, activeIndex, effectiveItemCount, filteredOptions, items, multiple, query, selected, openPopover, close, toggleOption, removeChip],
  );

  // ── Scroll active ──
  useEffect(() => {
    if (activeIndex < 0 || !popoverRef.current) return;
    const el = popoverRef.current.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement | undefined;
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex]);

  const stateClasses = findClasses(rules, {
    state: isOpen ? 'open' : 'closed',
    ...(appearance ? { appearance } : {}),
  });
  const focusRing = getFocusRing(contract);

  const optionMap = useMemo(
    () => new Map(optionList.map((o) => [o.value, o.label ?? o.value])),
    [optionList],
  );

  const singleLabel = !multiple && selected.length > 0
    ? optionMap.get(selected[0]) ?? selected[0]
    : '';

  const showClear = (showClearIcon || query.length > 0 || allChipValues.length > 0) && !disabled;

  return (
    <div ref={mergedRef} className={cn('relative', fullWidth && 'w-full min-w-0 max-w-none', className)} {...rest}>
      {/* ── Trigger ── */}
      <div
        ref={triggerRef}
        className={cn(
          'transition-colors duration-150 font-base box-border flex flex-row items-center overflow-hidden w-full',
          SIZE_CLASSES[size],
          ...stateClasses,
          !disabled && !isOpen && focusRing,
          disabled ? 'cursor-not-allowed opacity-[var(--opacity-disabled)]' : isOpen ? 'cursor-text' : 'cursor-pointer select-none',
          fullWidth && 'min-w-0 max-w-none',
        )}
        style={fullWidth ? { maxWidth: 'none', minWidth: 0 } : undefined}
        onClick={() => { openPopover(); inputRef.current?.focus(); }}
        onKeyDown={handleKeyDown}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={activeIndex >= 0 ? `ac-opt-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        aria-autocomplete="list"
      >
        <span className="shrink-0 flex items-center justify-center text-[var(--color-text-muted)]" style={{ width: 'var(--icon-size, 20px)', height: 'var(--icon-size, 20px)' }}>
          {searchIcon ?? <SearchIcon />}
        </span>

        {/* ── Closed state: chips or label (identical to Dropdown) ── */}
        {!isOpen && multiple && allChipValues.length > 0 ? (
          <div className="flex-1 min-w-0 flex items-center gap-1">
            <div
              ref={chipsRef}
              className="flex items-center gap-1 overflow-hidden flex-1 min-w-0"
              style={showGradient ? {
                maskImage: 'linear-gradient(to right, black calc(100% - 24px), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 24px), transparent)',
              } : undefined}
            >
              {allChipValues.slice(0, renderCount).map((val) => {
                const isExcluded = excluded.includes(val);
                return (
                  <Chip
                    key={`${isExcluded ? 'ex-' : ''}${val}`}
                    size="sm"
                    value={val}
                    state={isExcluded ? 'exclude' : undefined}
                    onClose={removeChip}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0"
                  >
                    {isExcluded ? `\u2212 ${optionMap.get(val) ?? val}` : (optionMap.get(val) ?? val)}
                  </Chip>
                );
              })}
            </div>
            {overflowCount > 0 && (
              <Badge appearance="brand" size="sm" className="shrink-0">+{overflowCount}</Badge>
            )}
          </div>
        ) : !isOpen && !multiple && singleLabel ? (
          <span className="flex-1 min-w-0 truncate text-[var(--color-text-primary)]">{singleLabel}</span>
        ) : !isOpen ? (
          <span className="flex-1 min-w-0 text-left truncate text-[var(--color-text-muted)]">{placeholder}</span>
        ) : null}

        {/* ── Open state: search input ── */}
        <input
          ref={inputRef}
          className={cn(
            'bg-transparent outline-none text-[inherit] font-[inherit] leading-[inherit] placeholder:text-[var(--color-text-muted)]',
            isOpen ? 'flex-1 min-w-[var(--space-40)] cursor-text' : 'sr-only',
          )}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          disabled={disabled}
          aria-label={ariaLabel}
          tabIndex={isOpen ? 0 : -1}
        />

        {loading && (
          <span className="shrink-0 flex items-center justify-center" style={{ width: 'var(--icon-size, 20px)', height: 'var(--icon-size, 20px)' }}>
            <Spinner size="xs" appearance="brand" />
          </span>
        )}

        {showClear && !loading && (
          <ClearButton onClick={handleClear} visible />
        )}
      </div>

      {/* ── Popover ── */}
      <Popover
        ref={popoverRef}
        anchorRef={triggerRef}
        open={isOpen}
        id={listboxId}
        aria-multiselectable={multiple}
        contentPadding={MENU_PANEL_PADDING}
        maxHeight="var(--space-320)"
      >
        {/* Selected/excluded chips at top */}
        {multiple && allChipValues.length > 0 && (
          <div className="flex flex-wrap gap-1 pb-1 border-b border-[var(--color-divider)] mb-1">
            {selected.map((val) => (
              <Chip key={val} size="sm" value={val} onClose={removeChip}>
                {optionMap.get(val) ?? val}
              </Chip>
            ))}
            {excluded.map((val) => (
              <Chip key={`ex-${val}`} size="sm" value={val} state="exclude" onClose={removeChip}>
                {`\u2212 ${optionMap.get(val) ?? val}`}
              </Chip>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-4 text-[var(--color-text-muted)]">
            <Spinner size="xs" appearance="brand" />
            <span className="ml-2 text-style-body-sm">Loading...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && effectiveItemCount === 0 && (
          <div className="flex items-center justify-center py-4 text-[var(--color-text-muted)] text-style-body-sm">
            {noResultsMessage}
          </div>
        )}

        {/* Filtered results — cmdk list */}
        {!loading && filteredOptions.length > 0 && (
          <Cmdk.Command shouldFilter={false} loop className="flex flex-col">
            <Cmdk.List>
              {filteredOptions.map((opt, i) => {
                const isSelected = selected.includes(opt.value);
                const isExcluded = excluded.includes(opt.value);
                return (
                  <Cmdk.Item
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    data-index={i}
                    id={`ac-opt-${i}`}
                    onSelect={() => !opt.disabled && toggleOption(opt.value)}
                    className={cn(
                      'flex items-center cursor-pointer rounded-[var(--radius-default)]',
                      MENU_ITEM_CLASSES[size],
                      multiple && 'gap-[var(--space-20)]',
                      'text-[var(--color-text-primary)]',
                      'aria-selected:bg-[var(--color-surface-3)] data-[selected=true]:bg-[var(--color-surface-3)]',
                      'data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none',
                      i === activeIndex && 'bg-[var(--color-surface-3)]',
                    )}
                  >
                    {multiple && (
                      <span className="pointer-events-none shrink-0 flex items-center">
                        <Checkbox size="md" checked={isSelected} exclude={isExcluded} onChange={() => {}} />
                      </span>
                    )}
                    <span className={cn('flex-1 min-w-0 truncate', isExcluded && 'line-through text-[var(--color-text-muted)]')}>
                      {opt.label ?? opt.value}
                    </span>
                    {!multiple && isSelected && (
                      <span className="shrink-0 flex items-center text-[var(--color-brand-primary)]"><CheckIcon /></span>
                    )}
                  </Cmdk.Item>
                );
              })}
            </Cmdk.List>
          </Cmdk.Command>
        )}

        {/* Legacy items */}
        {!loading && items && filteredOptions.length === 0 &&
          items.map(({ onClick, children: itemChildren, ...itemProps }, i) => (
            <AutocompleteItem
              key={i}
              id={`ac-opt-${i}`}
              size={size}
              {...itemProps}
              className={cn(
                i === activeIndex && 'bg-[var(--color-surface-3)]',
                itemProps.className,
              )}
              onClick={() => { onClick?.(); close(); }}
              role="option"
              aria-selected={i === activeIndex}
            >
              {itemChildren}
            </AutocompleteItem>
          ))}

        {/* Passthrough children */}
        {!loading && !items && filteredOptions.length === 0 && children}
      </Popover>
    </div>
  );
});

Autocomplete.displayName = 'Autocomplete';
