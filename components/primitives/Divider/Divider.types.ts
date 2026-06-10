import React from 'react';

/**
 * @UI/Divider
 * Линия-разделитель: горизонтальная или вертикальная.
 * orientation: horizontal | vertical
 * size:        sm (4px) | md (6px) | lg (8px)  — толщина линии
 * appearance:  base (border-base) | strong (border-strong)
 *
 * В horizontal режиме компонент растягивается по ширине родителя (w-full).
 * В vertical режиме — по высоте родителя (h-full).
 */
export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSize        = 'sm' | 'md' | 'lg';
export type DividerAppearance  = 'base' | 'strong';

export interface DividerProps {
  orientation?: DividerOrientation;
  size?:        DividerSize;
  appearance?:  DividerAppearance;
  /** Custom length — overrides width (horizontal) or height (vertical) */
  length?:      number | string;
  className?:   string;
  style?:       React.CSSProperties;
}
