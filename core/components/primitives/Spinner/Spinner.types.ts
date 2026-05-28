import React from 'react';

/**
 * @UI/Spinner
 * Индикатор загрузки — вращающееся кольцо (дуга ~270°).
 * 5 размеров: xs=16, sm=24, md=32, lg=40, xl=48 px
 * 3 варианта: brand (синий) | base (серый) | inherit (currentColor — для кнопок и т.п.)
 */

export type SpinnerSize       = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerAppearance = 'brand' | 'base' | 'inherit';

export interface SpinnerProps {
  size?:       SpinnerSize;
  appearance?: SpinnerAppearance;
  /** aria-label for screen readers */
  label?:      string;
  className?:  string;
  style?:      React.CSSProperties;
}
