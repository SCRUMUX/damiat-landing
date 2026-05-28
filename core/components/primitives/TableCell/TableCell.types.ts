import React from 'react';

/**
 * TableCell (@UI/Table/Cell, Figma node 161:89473)
 *
 * Ячейка данных таблицы. Рендерится как <td>.
 * Используется инстансами в TableRow → Table.
 *
 * Структура (HORIZONTAL layout, все слоты опциональны):
 *   [Checkbox?] [IconLeft?] [Label (grow)] [Badge?] [IconAction?]
 *
 * Размеры (из Figma API):
 *   sm: px=12, py=3,  gap=6, icon=16px, font 12px/500/lh16, H=22
 *   md: px=16, py=6,  gap=6, icon=16px, font 14px/400/lh20, H=32
 *   lg: px=20, py=8,  gap=6, icon=20px, font 14px/400/lh20, H=36
 *
 * Типы (влияют на отображение содержимого):
 *   text    — обычный текст (text-primary, align left)
 *   badge   — текст + Badge инстанс
 *   tag     — текст + Tag/Chip инстанс
 *   actions — text-muted, слот для иконок действий
 *   numeric — текст выровнен по правому краю (числа)
 *
 * Фон: transparent. Border: bottom border-base.
 */
export type TableCellSize = 'sm' | 'md' | 'lg';

export type TableCellType = 'text' | 'badge' | 'tag' | 'actions' | 'numeric';

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'children'> {
  /** Размер (sm/md/lg) */
  size?: TableCellSize;
  /**
   * Тип ячейки (влияет на стиль текста и выравнивание):
   *   text    — стандартный текст
   *   badge   — с Badge
   *   tag     — с Tag
   *   actions — действия, text-muted
   *   numeric — числовые данные, align right
   */
  type?: TableCellType;
  /** Checkbox слот (слева) */
  checkbox?: React.ReactNode;
  /** Иконка слева от текста */
  iconLeft?: React.ReactNode;
  /** Badge / Tag справа от текста */
  badge?: React.ReactNode;
  /** Иконка-действие (крайний правый слот) */
  iconAction?: React.ReactNode;
  /** Показывать Checkbox */
  showCheckbox?: boolean;
  /** Показывать иконку слева */
  showIconLeft?: boolean;
  /** Показывать Badge/Tag */
  showBadge?: boolean;
  /** Показывать иконку-действие */
  showIconAction?: boolean;
  /** Label */
  children?: React.ReactNode;
}
