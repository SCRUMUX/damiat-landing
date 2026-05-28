import React from 'react';

/**
 * @UI/Skeleton/Card
 * Шаблон-заглушка для карточки.
 * Структура: Media (прямоугольник) → Content (Title + DescLines + Actions).
 * size:    sm=320 / md=480 / lg=800 px
 * shimmer: true/false
 */
export type SkeletonCardSize = 'sm' | 'md' | 'lg';

export interface SkeletonCardProps {
  size?:    SkeletonCardSize;
  shimmer?: boolean;
  className?: string;
  style?:     React.CSSProperties;
}
