import React, { useCallback } from 'react';
import type { TableHeaderCellProps, TableHeaderCellSize, TableHeaderCellSort } from './TableHeaderCell.types';
import { ArrowUpIcon, ArrowDownIcon } from '../../icons';
import { cn, findClasses, type VR } from '../_shared';
import { TABLE_ICON_SIZE } from '../_shared/table-tokens';
import contract from '../../../contracts/components/Table-HeaderCell.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<TableHeaderCellSize, string> = {
  sm: 'px-[var(--space-table-cell-x-sm)] py-[var(--space-table-cell-y-sm)] min-w-[var(--space-table-col-min-sm)] min-h-[var(--space-table-row-h-sm)] text-style-caption',
  md: 'px-[var(--space-table-cell-x-md)] py-[var(--space-table-cell-y-md)] min-w-[var(--space-table-col-min-md)] min-h-[var(--space-table-row-h-md)] text-style-body-strong',
  lg: 'px-[var(--space-table-cell-x-lg)] py-[var(--space-table-cell-y-lg)] min-w-[var(--space-table-col-min-lg)] min-h-[var(--space-table-row-h-lg)] text-style-body-strong',
};

function nextSort(current: TableHeaderCellSort): TableHeaderCellSort {
  if (current === 'none') return 'asc';
  if (current === 'asc')  return 'desc';
  return 'none';
}

export const TableHeaderCell = React.forwardRef<HTMLTableCellElement, TableHeaderCellProps>((props, ref) => {
  const {
    size = 'md',
    sort = 'none',
    iconLeft,
    showIconLeft = false,
    onSortChange,
    children,
    className,
    onClick,
    ...rest
  } = props;

  const sortClasses = findClasses(rules, { sort: sort as TableHeaderCellSort });
  const iconPx = TABLE_ICON_SIZE[size];
  const isSorted = sort !== 'none';

  const handleClick = useCallback((e: React.MouseEvent<HTMLTableCellElement>) => {
    if (onSortChange) onSortChange(nextSort(sort));
    onClick?.(e);
  }, [sort, onSortChange, onClick]);

  const SortIconComponent = sort === 'asc' ? ArrowUpIcon : ArrowDownIcon;

  return (
    <th
      ref={ref}
      scope="col"
      className={cn(
        'border-b border-[var(--color-border-base)] whitespace-nowrap align-middle text-left',
        SIZE_CLASSES[size],
        ...sortClasses,
        onSortChange && 'cursor-pointer select-none hover:bg-[var(--color-surface-2)] transition-colors duration-150',
        className,
      )}
      onClick={onSortChange ? handleClick : onClick}
      {...rest}
    >
      <span className="flex flex-row items-center gap-[var(--space-table-cell-gap)]">
        {showIconLeft && iconLeft && (
          <span
            className="shrink-0 flex items-center justify-center text-[var(--icon-color)]"
            style={{ width: iconPx, height: iconPx }}
            aria-hidden="true"
          >
            {iconLeft}
          </span>
        )}

        <span className="flex-1 min-w-0 text-[inherit]">
          {children}
        </span>

        {isSorted && (
          <span
            className="shrink-0 flex items-center justify-center text-[var(--sort-icon-color)]"
            style={{ width: iconPx, height: iconPx }}
            aria-hidden="true"
          >
            <SortIconComponent size={iconPx} />
          </span>
        )}

        {!isSorted && onSortChange && (
          <span
            className="shrink-0 invisible"
            style={{ width: iconPx, height: iconPx }}
            aria-hidden="true"
          />
        )}
      </span>
    </th>
  );
});

TableHeaderCell.displayName = 'TableHeaderCell';
