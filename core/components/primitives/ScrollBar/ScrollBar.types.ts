import React from 'react';

/**
 * @UI/ScrollBar
 * Кастомный скроллбар: стрелка + трек + thumb + стрелка.
 *
 * orientation: horizontal | vertical
 * size:   sm | md | lg  — определяет толщину track и размер thumb
 *   horizontal:
 *     sm  — track H=4px,  thumb 12×12 / rect H=12
 *     md  — track H=6px,  thumb 16×16 / rect H=16
 *     lg  — track H=8px,  thumb 20×20 / rect H=20
 *   vertical:
 *     sm  — track W=4px,  thumb 12×12 / rect W=12
 *     md  — track W=6px,  thumb 16×16 / rect W=16
 *     lg  — track W=8px,  thumb 20×20 / rect W=20
 * shape:  circle | rect — форма thumb (circle=круглый, rect=прямоугольный с r=6)
 *
 * value:      0–100, позиция thumb (default 33)
 * onChange:   callback при изменении позиции
 * showArrows: показывать стрелки (default true)
 */
export type ScrollBarOrientation = 'horizontal' | 'vertical';
export type ScrollBarSize        = 'sm' | 'md' | 'lg';
export type ScrollBarShape       = 'circle' | 'rect';

export interface ScrollBarProps {
  orientation?:  ScrollBarOrientation;
  size?:         ScrollBarSize;
  shape?:        ScrollBarShape;
  /** Position of thumb 0–100 (default 33) */
  value?:        number;
  onChange?:     (value: number) => void;
  /** Track length in px (or 'stretch' to fill parent) */
  trackLength?:  number;
  /** Show arrow buttons at both ends (default true) */
  showArrows?:   boolean;
  className?:    string;
  style?:        React.CSSProperties;
}
