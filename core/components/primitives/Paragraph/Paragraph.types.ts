import React from 'react';

/**
 * Paragraph (@UI/Paragraph, Figma node 160:82623)
 *
 * Типографический блок для длинного текста.
 * 3 размера шрифта, 4 варианта ширины контейнера (breakpoint).
 * padding=32px со всех сторон на всех вариантах.
 * Нет borders, нет backgrounds — только текст.
 *
 * Размеры (из Figma API):
 *   sm: 12px / w400 / lh16px
 *   md: 14px / w400 / lh20px
 *   lg: 16px / w400 / lh24px
 *
 * Breakpoint (ширина контейнера):
 *   mobile:     320px
 *   tablet:     480px
 *   desktop-sm: 640px
 *   desktop-lg: 800px
 *
 * Цвет текста: --color-text-primary
 */
export type ParagraphSize = 'sm' | 'md' | 'lg';

export type ParagraphBreakpoint = 'mobile' | 'tablet' | 'desktop-sm' | 'desktop-lg';

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Размер шрифта (sm/md/lg) */
  size?: ParagraphSize;
  /**
   * Ширина контейнера по точке брейкпоинта:
   *   mobile=320px, tablet=480px, desktop-sm=640px, desktop-lg=800px
   */
  breakpoint?: ParagraphBreakpoint;
  /** Выравнивание текста */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Цвет текста (override) */
  color?: string;
}
