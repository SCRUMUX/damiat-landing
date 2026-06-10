import React from 'react';

/**
 * TableHeaderCell (@UI/Table/HeaderCell, Figma node 161:89256)
 *
 * Ячейка заголовка таблицы. Рендерится как <th>.
 * Используется инстансами в TableHeaderRow → Table.
 *
 * Структура (HORIZONTAL layout):
 *   [Icon Left? (optional)] [Label (grow)] [Sort Icon? (optional)]
 *
 * Размеры (из Figma API):
 *   sm: px=12, py=3,  gap=6, icon=16px, font 12px/500/lh16, H=22
 *   md: px=16, py=6,  gap=6, icon=16px, font 14px/600/lh20, H=32
 *   lg: px=20, py=8,  gap=6, icon=20px, font 14px/600/lh20, H=36
 *
 * Sort состояния:
 *   none — label: text-muted,    sort icon hidden
 *   asc  — label: text-primary,  sort icon visible (стрелка вверх)
 *   desc — label: text-primary,  sort icon visible (стрелка вниз)
 *
 * Фон: surface-1 (белый). Border: border-base (bottom, при использовании в строке).
 */
export type TableHeaderCellSize = 'sm' | 'md' | 'lg';

export type TableHeaderCellSort = 'none' | 'asc' | 'desc';

export interface TableHeaderCellProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'children'> {
  /** Размер (sm/md/lg) */
  size?: TableHeaderCellSize;
  /** Сортировка: none/asc/desc */
  sort?: TableHeaderCellSort;
  /** Иконка слева от лейбла */
  iconLeft?: React.ReactNode;
  /** Показывать иконку слева */
  showIconLeft?: boolean;
  /** Callback при клике для сортировки */
  onSortChange?: (next: TableHeaderCellSort) => void;
  /** Label */
  children?: React.ReactNode;
}
