import React from 'react';

/**
 * TableHeaderRow (@UI/Table/HeaderRow, Figma node 161:90330)
 *
 * Строка заголовков таблицы. Рендерится как <tr> внутри <thead>.
 * Содержит TableHeaderCell инстансы (колонки).
 *
 * Размеры (из Figma API):
 *   sm: H=28px
 *   md: H=36px
 *   lg: H=44px
 *
 * Фон: surface-1 (белый).
 * Border: bottom 1px border-base.
 *
 * Пропсы:
 *   size            — размер (влияет на высоту и размер ячеек)
 *   showCheckboxColumn — показывать первую колонку с Checkbox
 *   columns         — массив конфигов колонок (передаётся в TableHeaderCell)
 *   children        — альтернатива columns: ручная вёрстка <th> / TableHeaderCell
 */
export type TableHeaderRowSize = 'sm' | 'md' | 'lg';

export interface TableHeaderRowColumn {
  /** Заголовок колонки */
  label: React.ReactNode;
  /** Иконка слева */
  iconLeft?: React.ReactNode;
  /** Показывать иконку слева */
  showIconLeft?: boolean;
  /** Текущая сортировка */
  sort?: 'none' | 'asc' | 'desc';
  /** Callback при клике для смены сортировки */
  onSortChange?: (next: 'none' | 'asc' | 'desc') => void;
  /** Доп. className для ячейки */
  className?: string;
  /** Ключ (React key) */
  key?: string;
}

export interface TableHeaderRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Размер (sm/md/lg) — передаётся в дочерние TableHeaderCell */
  size?: TableHeaderRowSize;
  /** Показывать колонку с Checkbox слева */
  showCheckboxColumn?: boolean;
  /** Checkbox слот для первой колонки (используется когда showCheckboxColumn=true) */
  checkbox?: React.ReactNode;
  /**
   * Конфиги колонок для автоматического рендеринга TableHeaderCell.
   * Если не указан — используются children.
   */
  columns?: TableHeaderRowColumn[];
}
