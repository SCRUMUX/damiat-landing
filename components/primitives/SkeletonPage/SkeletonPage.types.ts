import React from 'react';

/**
 * @UI/Skeleton/Page
 * Шаблон-заглушка для полной страницы.
 * Структура: nav-бар → hero-блок → строки подзаголовка → ряд тегов → сетка 3 карточек.
 * size:    sm=320 / md=480 / lg=800 px
 * shimmer: true=анимированный градиент / false=статичный
 */
export type SkeletonPageSize = 'sm' | 'md' | 'lg';

export interface SkeletonPageProps {
  size?:    SkeletonPageSize;
  shimmer?: boolean;
  className?: string;
  style?:     React.CSSProperties;
}
