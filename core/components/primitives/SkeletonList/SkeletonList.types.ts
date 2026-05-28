import React from 'react';

/**
 * @UI/Skeleton/List
 * Шаблон-заглушка для списка.
 * Структура: 4 строки (Avatar + Label + Meta), разделённые dividers.
 * size:    sm=320 / md=480 / lg=800 px
 * shimmer: true/false
 */
export type SkeletonListSize = 'sm' | 'md' | 'lg';

export interface SkeletonListProps {
  size?:    SkeletonListSize;
  shimmer?: boolean;
  /** Number of rows to render (default 4) */
  rows?:    number;
  className?: string;
  style?:     React.CSSProperties;
}
