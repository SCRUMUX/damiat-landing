import React from 'react';

/**
 * Pagination (@UI/Pagination, Figma node 160:86574)
 *
 * Варианты:
 *   with-numbers — Prev + 3 страницы (Button instances) + Next
 *   compact      — Prev + "currentPage / totalPages" + Next
 *   minimal      — Prev + Next
 *
 * Appearance влияет на стиль активной страницы:
 *   brand — активная кнопка brand, неактивные ghost
 *   base  — активная base (underline), неактивные ghost
 *   ghost — всё ghost
 *
 * Размеры (sm/md/lg) — соответствуют Button size.
 */

export type PaginationSize = 'sm' | 'md' | 'lg';

export type PaginationAppearance = 'brand' | 'base' | 'ghost';

export type PaginationVariant = 'with-numbers' | 'compact' | 'minimal';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Размер кнопок (совпадает с Button size) */
  size?: PaginationSize;
  /** Стиль активной страницы */
  appearance?: PaginationAppearance;
  /** Режим отображения */
  variant?: PaginationVariant;
  /** Текущая страница (1-based) */
  currentPage?: number;
  /** Всего страниц */
  totalPages?: number;
  /** Callback при смене страницы */
  onPageChange?: (page: number) => void;
  /** Callback при нажатии Prev */
  onPrev?: () => void;
  /** Callback при нажатии Next */
  onNext?: () => void;
  /** Количество видимых страниц в with-numbers (по умолчанию 3) */
  pageWindowSize?: number;
}
