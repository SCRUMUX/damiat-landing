import React from 'react';
import type { TableCellProps, TableCellSize, TableCellType } from './TableCell.types';
import { IconSlot } from '../_shared/IconSlot';
import { cn, findClasses, type VR } from '../_shared';
import { TABLE_ICON_SIZE } from '../_shared/table-tokens';
import contract from '../../../contracts/components/Table-Cell.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<TableCellSize, string> = {
  sm: 'px-[var(--space-table-cell-x-sm)] py-[var(--space-table-cell-y-sm)] min-w-[var(--space-table-col-min-sm)] min-h-[var(--space-table-row-h-sm)] text-style-caption',
  md: 'px-[var(--space-table-cell-x-md)] py-[var(--space-table-cell-y-md)] min-w-[var(--space-table-col-min-md)] min-h-[var(--space-table-row-h-md)] text-style-body',
  lg: 'px-[var(--space-table-cell-x-lg)] py-[var(--space-table-cell-y-lg)] min-w-[var(--space-table-col-min-lg)] min-h-[var(--space-table-row-h-lg)] text-style-body',
};

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>((props, ref) => {
  const {
    size = 'md',
    type = 'text',
    checkbox,
    iconLeft,
    badge,
    iconAction,
    showCheckbox = false,
    showIconLeft = false,
    showBadge = false,
    showIconAction = false,
    children,
    className,
    ...rest
  } = props;

  const typeClasses = findClasses(rules, { type: type as TableCellType });
  const iconPx = TABLE_ICON_SIZE[size];
  const isNumeric = type === 'numeric';

  return (
    <td
      ref={ref}
      className={cn(
        'border-b border-[var(--color-border-base)] whitespace-nowrap align-middle text-left',
        SIZE_CLASSES[size],
        ...typeClasses,
        className,
      )}
      {...rest}
    >
      <span className={cn(
        'flex flex-row items-center gap-[var(--space-table-cell-gap)]',
        isNumeric && 'justify-end',
      )}>
        {showCheckbox && checkbox && (
          <span className="shrink-0 flex items-center justify-center">
            {checkbox}
          </span>
        )}

        {showIconLeft && iconLeft && (
          <IconSlot
            icon={iconLeft}
            size={`${iconPx}px`}
            className="shrink-0 text-[var(--icon-color)]"
          />
        )}

        <span className={cn(
          isNumeric ? 'tabular-nums' : 'flex-1 min-w-0 truncate',
          'text-[inherit]',
        )}>
          {children}
        </span>

        {showBadge && badge && (
          <span className="shrink-0 flex items-center">
            {badge}
          </span>
        )}

        {showIconAction && iconAction && (
          <IconSlot
            icon={iconAction}
            size={`${iconPx}px`}
            className="shrink-0 text-[var(--icon-color)] hover:text-[var(--color-icon-primary)] transition-colors duration-150"
          />
        )}
      </span>
    </td>
  );
});

TableCell.displayName = 'TableCell';
