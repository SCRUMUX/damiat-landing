import React from 'react';

/**
 * Slider (@UI/Slider, Figma node 160:83289)
 *
 * Горизонтальный слайдер: Track + Fill + Thumb(s).
 *
 * Размеры (из Figma API):
 *   sm: Track H=4px, radius=2px, Thumb Ø=16px
 *   md: Track H=6px, radius=3px, Thumb Ø=20px
 *   lg: Track H=8px, radius=4px, Thumb Ø=24px
 *
 * Варианты thumbs:
 *   1 — один thumb (обычный слайдер)
 *   2 — два thumb (range слайдер)
 *
 * Цвета:
 *   Track fill: --color-surface-3
 *   Fill fill:  --color-brand-primary
 *   Thumb fill: --color-surface-1 (белый)
 *   Thumb stroke: --color-border-strong (1px)
 */
export type SliderSize = 'sm' | 'md' | 'lg';

export type SliderThumbs = '1' | '2';

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Размер (sm/md/lg) */
  size?: SliderSize;
  /** Количество thumb-ов: 1 = одиночный, 2 = range */
  thumbs?: SliderThumbs;
  /** Минимальное значение (default 0) */
  min?: number;
  /** Максимальное значение (default 100) */
  max?: number;
  /** Шаг (default 1) */
  step?: number;
  /** Значение (одиночный) */
  value?: number;
  /** Начальное значение (range: [from, to]) */
  rangeValue?: [number, number];
  /** Callback при изменении (одиночный) */
  onChange?: (value: number) => void;
  /** Callback при изменении (range) */
  onRangeChange?: (value: [number, number]) => void;
  /** Disabled */
  disabled?: boolean;
}
