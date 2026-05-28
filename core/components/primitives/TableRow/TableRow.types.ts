import React from 'react';

/**
 * TableRow (@UI/Table/Row, Figma node 161:90212)
 *
 * Строка данных таблицы. Рендерится как <tr> внутри <tbody>.
 * Содержит TableCell инстансы (колонки).
 *
 * Размеры (из Figma API):
 *   sm: H=28px
 *   md: H=36px
 *   lg: H=44px
 *
 * Состояния (fill | border-bottom):
 *   base     — surface-1 (#FFF)         | border-base
 *   hover    — surface-2 (#F7F8FA)      | border-base
 *   selected — brand-muted (#E7F0FF)    | brand-primary (синий)
 *   disabled — surface-2 + opacity=0.5  | border-base
 *
 * Пропсы:
 *   size              — размер строки
 *   state             — визуальное состояние (override)
 *   showCheckboxColumn — показывать первую колонку с Checkbox
 *   checkbox          — слот Checkbox
 *   selected          — управляемое состояние «выбрана»
 *   disabled          — заблокирована
 *   columns           — конфиги ячеек для авто-рендеринга
 *   children          — ручная вёрстка <td> / TableCell
 */
export type TableRowSize = 'sm' | 'md' | 'lg';

export type TableRowState = 'base' | 'hover' | 'selected' | 'disabled';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Размер строки (sm/md/lg) */
  size?: TableRowSize;
  /**
   * Визуальное состояние (override).
   * Если не задан — управляется hover и selected/disabled пропсами.
   */
  state?: TableRowState;
  /** Выбранная строка */
  selected?: boolean;
  /** Заблокированная строка */
  disabled?: boolean;
  /** Показывать колонку с Checkbox слева */
  showCheckboxColumn?: boolean;
  /** Checkbox слот для первой колонки */
  checkbox?: React.ReactNode;
  /** Callback при клике (для выбора строки) */
  onSelect?: () => void;
}
