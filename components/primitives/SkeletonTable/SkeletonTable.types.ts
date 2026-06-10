import React from 'react';

/**
 * @UI/Skeleton/Table
 * Шаблон-заглушка для таблицы.
 * Структура: Header row + N data rows с вертикальными разделителями колонок.
 * size:    sm=320 / md=460 / lg=600 px
 * shimmer: true/false
 */
export type SkeletonTableSize = 'sm' | 'md' | 'lg';

export interface SkeletonTableProps {
  size?:    SkeletonTableSize;
  shimmer?: boolean;
  /** Number of data rows (default 4) */
  rows?:    number;
  /** Number of columns (default 4) */
  cols?:    number;
  className?: string;
  style?:     React.CSSProperties;
}
