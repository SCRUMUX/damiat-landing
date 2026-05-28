import React from 'react';
import type { TableHeaderRowProps, TableHeaderRowSize } from './TableHeaderRow.types';
import { TableHeaderCell } from '../TableHeaderCell/TableHeaderCell';
import { cn, findClasses, type VR } from '../_shared';
import { TABLE_CHECKBOX_WIDTH } from '../_shared/table-tokens';
import contract from '../../../contracts/components/Table-HeaderRow.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<TableHeaderRowSize, string> = {
  sm: 'min-h-[var(--space-table-row-h-sm)]',
  md: 'min-h-[var(--space-table-row-h-md)]',
  lg: 'min-h-[var(--space-table-row-h-lg)]',
};

export const TableHeaderRow = React.forwardRef<HTMLTableRowElement, TableHeaderRowProps>((props, ref) => {
  const {
    size = 'md',
    showCheckboxColumn = false,
    checkbox,
    columns,
    children,
    className,
    ...rest
  } = props;

  const baseClasses = findClasses(rules, {});
  const checkboxPx = TABLE_CHECKBOX_WIDTH[size];

  return (
    <tr
      ref={ref}
      className={cn(
        SIZE_CLASSES[size],
        ...baseClasses,
        className,
      )}
      {...rest}
    >
      {showCheckboxColumn && (
        <th
          scope="col"
          className="border-b border-[var(--color-border-base)] bg-[var(--color-surface-1)] align-middle"
          style={{ width: checkboxPx }}
        >
          <span className="flex items-center justify-center">
            {checkbox}
          </span>
        </th>
      )}

      {columns
        ? columns.map((col, i) => (
            <TableHeaderCell
              key={col.key ?? i}
              size={size}
              sort={col.sort ?? 'none'}
              iconLeft={col.iconLeft}
              showIconLeft={col.showIconLeft}
              onSortChange={col.onSortChange}
              className={col.className}
            >
              {col.label}
            </TableHeaderCell>
          ))
        : children}
    </tr>
  );
});

TableHeaderRow.displayName = 'TableHeaderRow';
