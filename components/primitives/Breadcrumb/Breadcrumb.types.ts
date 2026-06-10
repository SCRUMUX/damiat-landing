import React from 'react';

/**
 * Breadcrumb: 4 уровня вложенности.
 * Каждый уровень — инстанс SectionHeader (только Label).
 * Разделитель — chevron-right 12×12.
 *
 * Figma API: @UI/Breadcrumb (160:72559)
 *   levels: 1 | 2 | 3 | 4
 *   gap: 4px между items и сепараторами
 *   padding: 4px/2px
 */

export type BreadcrumbLevels = '1' | '2' | '3' | '4';

/** Один пункт хлебной крошки */
export interface BreadcrumbItem {
  /** Текст метки */
  label: string;
  /** URL для перехода (если не задан — рендерится как span, не ссылка) */
  href?: string;
  /** Обработчик клика */
  onClick?: (e: React.MouseEvent) => void;
  /** Иконка слева (опционально) */
  iconLeft?: React.ReactNode;
  /** Badge (опционально) */
  badge?: React.ReactNode;
  /** Иконка справа (опционально) */
  iconRight?: React.ReactNode;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Количество уровней (1–4). Управляет количеством видимых items.
   * Если задан items — используется длина массива items.
   */
  levels?: BreadcrumbLevels;
  /**
   * Массив пунктов. Если передан — используется вместо levels/children.
   * Последний item — текущая страница (не кликабельный, текст primary).
   */
  items?: BreadcrumbItem[];
  /** Размер SectionHeader внутри каждого item */
  size?: 'sm' | 'md' | 'lg';
}
