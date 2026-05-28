import React from 'react';
import type { TableProps, TableSize, TableAppearance } from './Table.types';
import { TableHeaderRow } from '../TableHeaderRow/TableHeaderRow';
import { TableRow } from '../TableRow/TableRow';
import { TableCell } from '../TableCell/TableCell';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/Table.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<TableSize, string> = {
  sm: 'min-w-[var(--space-table-min-sm)]',
  md: 'min-w-[var(--space-table-min-md)]',
  lg: 'min-w-[var(--space-table-min-lg)]',
};

export const Table = React.forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  const {
    size = 'md',
    appearance = 'base',
    showCheckboxColumn = false,
    headerCheckbox,
    columns,
    rows,
    getRowKey,
    getRowCheckbox,
    selectedRowKeys,
    disabledRowKeys,
    onRowSelect,
    children,
    className,
    style,
    ...rest
  } = props;

  const appearanceClasses = findClasses(rules, { appearance: appearance as TableAppearance });

  const headerColumns = columns?.map((col) => ({
    key:          col.key,
    label:        col.label,
    iconLeft:     col.headerIconLeft,
    showIconLeft: !!col.headerIconLeft,
    sort:         col.sort ?? 'none' as const,
    onSortChange: col.onSortChange,
  }));

  return (
    <div
      className={cn(
        'overflow-hidden',
        SIZE_CLASSES[size],
        ...appearanceClasses,
        className,
      )}
      style={style}
    >
      <table
        ref={ref}
        className={cn(
          'w-full border-collapse bg-[var(--color-surface-1)]',
          appearance === 'striped' && '[&_tbody_tr:nth-child(even)]:bg-[var(--color-surface-2)]',
        )}
        {...rest}
      >
        {(columns || headerCheckbox !== undefined) && (
          <thead>
            <TableHeaderRow
              size={size}
              showCheckboxColumn={showCheckboxColumn}
              checkbox={headerCheckbox}
              columns={headerColumns}
            />
          </thead>
        )}

        {rows && columns && (
          <tbody>
            {rows.map((row, rowIndex) => {
              const key = getRowKey ? getRowKey(row, rowIndex) : rowIndex;
              const isSelected = selectedRowKeys?.includes(key) ?? false;
              const isDisabled = disabledRowKeys?.includes(key) ?? false;
              const rowCheckbox = getRowCheckbox ? getRowCheckbox(row, rowIndex) : undefined;

              return (
                <TableRow
                  key={key}
                  size={size}
                  selected={isSelected}
                  disabled={isDisabled}
                  showCheckboxColumn={showCheckboxColumn}
                  checkbox={rowCheckbox}
                  onSelect={onRowSelect ? () => onRowSelect(row, key) : undefined}
                >
                  {columns.map((col) => {
                    const cellContent = col.render
                      ? col.render(row, rowIndex)
                      : String((row as Record<string, unknown>)[col.key] ?? '');

                    const showBadge = col.cellType === 'badge' || col.cellType === 'tag';

                    return (
                      <TableCell
                        key={col.key}
                        size={size}
                        type={col.cellType ?? 'text'}
                        showIconLeft={!!col.cellIconLeft}
                        iconLeft={col.cellIconLeft}
                        showBadge={showBadge}
                        badge={showBadge ? cellContent : undefined}
                        style={col.width ? { width: col.width } : undefined}
                      >
                        {!showBadge ? cellContent : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </tbody>
        )}

        {!rows && children && (
          <tbody>
            {children}
          </tbody>
        )}
      </table>
    </div>
  );
}) as <T = Record<string, unknown>>(
  props: TableProps<T> & { ref?: React.Ref<HTMLTableElement> }
) => React.ReactElement;

(Table as React.FC).displayName = 'Table';

export default Table;
