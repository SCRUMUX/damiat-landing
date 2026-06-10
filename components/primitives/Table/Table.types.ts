import React from 'react';

/**
 * Table (@UI/Table, Figma node 161:92875)
 *
 * Полная таблица: HeaderRow + N строк данных.
 * Рендерится как семантический <table>.
 *
 * Размеры (из Figma API):
 *   sm: строки H=28px
 *   md: строки H=36px
 *   lg: строки H=44px
 *
 * Варианты (appearance):
 *   base     — фон surface-1, border-base, cornerRadius=4px
 *   striped  — то же, но нечётные строки: surface-1, чётные: surface-2 (зебра)
 *   bordered — фон surface-1, border-strong, cornerRadius=4px
 *
 * Структура:
 *   <table>
 *     <thead> → TableHeaderRow (HeaderCell инстансы)
 *     <tbody> → TableRow × N (TableCell инстансы)
 *   </table>
 *
 * Колонки задаются через columns[] — конфиги для заголовков и данных.
 * Строки задаются через rows[] — массив объектов с данными.
 * Альтернатива: children для полностью ручной вёрстки.
 */
export type TableSize = 'sm' | 'md' | 'lg';

export type TableAppearance = 'base' | 'striped' | 'bordered';

export interface TableColumn<T = Record<string, unknown>> {
  /** Уникальный ключ колонки */
  key: string;
  /** Заголовок (label для HeaderCell) */
  label: React.ReactNode;
  /** Иконка слева в заголовке */
  headerIconLeft?: React.ReactNode;
  /** Начальная сортировка */
  sort?: 'none' | 'asc' | 'desc';
  /** Callback сортировки */
  onSortChange?: (next: 'none' | 'asc' | 'desc') => void;
  /** Рендер ячейки данных */
  render?: (row: T, rowIndex: number) => React.ReactNode;
  /** Тип ячейки (text/badge/tag/actions/numeric) */
  cellType?: 'text' | 'badge' | 'tag' | 'actions' | 'numeric';
  /** Иконка слева в ячейке */
  cellIconLeft?: React.ReactNode;
  /** Ширина колонки (CSS значение) */
  width?: string;
}

export interface TableProps<T = Record<string, unknown>> extends Omit<React.TableHTMLAttributes<HTMLTableElement>, 'children'> {
  /** Размер (sm/md/lg) */
  size?: TableSize;
  /** Внешний вид таблицы */
  appearance?: TableAppearance;
  /** Показывать колонку с Checkbox слева */
  showCheckboxColumn?: boolean;
  /** Checkbox в заголовке (select all) */
  headerCheckbox?: React.ReactNode;
  /** Колонки таблицы */
  columns?: TableColumn<T>[];
  /** Строки данных */
  rows?: T[];
  /** Ключ для React (getRowKey) */
  getRowKey?: (row: T, index: number) => React.Key;
  /** Checkbox для строки данных */
  getRowCheckbox?: (row: T, index: number) => React.ReactNode;
  /** Выбранные строки (по ключу) */
  selectedRowKeys?: React.Key[];
  /** Disabled строки (по ключу) */
  disabledRowKeys?: React.Key[];
  /** Callback выбора строки */
  onRowSelect?: (row: T, key: React.Key) => void;
  /** Ручная вёрстка (вместо columns/rows) */
  children?: React.ReactNode;
}
