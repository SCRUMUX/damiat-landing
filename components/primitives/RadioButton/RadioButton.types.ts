import React from 'react';

/**
 * RadioButton (@UI/RadioButton, Figma node 160:82848)
 *
 * Круглый элемент выбора — кольцо (Ring) + опциональная внутренняя точка (Inner).
 *
 * Размеры (из Figma API):
 *   xs: 12×12, Inner=6px
 *   sm: 16×16, Inner=6px
 *   md: 20×20, Inner=8px
 *   lg: 24×24, Inner=10px
 *
 * Состояния:
 *   base         — серое кольцо, нет точки (не выбран)
 *   filled       — синее кольцо + белая точка (выбран, hover/active)
 *   focus        — серое кольцо с синим stroke + focus ring (фокус, не выбран)
 *   always-filled — синее кольцо + белая точка (выбран навсегда)
 *   disabled     — серое кольцо, нет точки, непрозрачный
 */
export type RadioButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type RadioButtonState = 'base' | 'filled' | 'focus' | 'always-filled' | 'disabled';

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Размер элемента */
  size?: RadioButtonSize;
  /**
   * Визуальное состояние (override).
   * Если не задан — управляется через checked/disabled пропсы.
   */
  state?: RadioButtonState;
  /** Метка (label) рядом с кнопкой */
  label?: React.ReactNode;
}
