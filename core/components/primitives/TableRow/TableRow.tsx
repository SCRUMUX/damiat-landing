import React, { useState, useCallback } from 'react';
import type { TableRowProps, TableRowState, TableRowSize } from './TableRow.types';
import { cn, findClasses, type VR } from '../_shared';
import { TABLE_CHECKBOX_WIDTH } from '../_shared/table-tokens';
import contract from '../../../contracts/components/Table-Row.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<TableRowSize, string> = {
  sm: 'min-h-[var(--space-table-row-h-sm)]',
  md: 'min-h-[var(--space-table-row-h-md)]',
  lg: 'min-h-[var(--space-table-row-h-lg)]',
};

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>((props, ref) => {
  const {
    size = 'md',
    state: controlledState,
    selected = false,
    disabled = false,
    showCheckboxColumn = false,
    checkbox,
    onSelect,
    children,
    className,
    onMouseEnter,
    onMouseLeave,
    onClick,
    ...rest
  } = props;

  const [hovered, setHovered] = useState(false);

  const effectiveState: TableRowState = (() => {
    if (controlledState) return controlledState;
    if (disabled)        return 'disabled';
    if (selected)        return 'selected';
    if (hovered)         return 'hover';
    return 'base';
  })();

  const stateClasses = findClasses(rules, { state: effectiveState });
  const checkboxPx = TABLE_CHECKBOX_WIDTH[size];
  const isInteractive = effectiveState === 'hover' || effectiveState === 'selected';

  const selectedBorderClass = effectiveState === 'selected'
    ? '[&>td]:border-b [&>td]:border-[var(--color-brand-primary)]'
    : '';

  const he = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    if (!disabled) setHovered(true);
    onMouseEnter?.(e);
  }, [disabled, onMouseEnter]);

  const hl = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    setHovered(false);
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    if (!disabled) onSelect?.();
    onClick?.(e);
  }, [disabled, onSelect, onClick]);

  return (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        'transition-colors duration-150',
        SIZE_CLASSES[size],
        ...stateClasses,
        selectedBorderClass,
        isInteractive && 'cursor-pointer',
        effectiveState === 'disabled' && 'pointer-events-none',
        className,
      )}
      onMouseEnter={he}
      onMouseLeave={hl}
      onClick={handleClick}
      {...rest}
    >
      {showCheckboxColumn && (
        <td
          className="border-b border-[var(--color-border-base)] align-middle"
          style={{ width: checkboxPx }}
        >
          <span className="flex items-center justify-center">
            {checkbox}
          </span>
        </td>
      )}

      {children}
    </tr>
  );
});

TableRow.displayName = 'TableRow';
