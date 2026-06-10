import React from 'react';

/**
 * Checkbox (@UI/Checkbox, Figma node 160:75586)
 *
 * Квадратный checkbox — 4 размера, 8 состояний.
 * cornerRadius=2px на всех размерах.
 *
 * Размеры (из Figma API):
 *   xs: 12×12
 *   sm: 16×16
 *   md: 20×20
 *   lg: 24×24
 *
 * Состояния:
 *   unchecked           — серый фон, серый border
 *   checked             — синий фон, синий border + белая галочка
 *   indeterminate       — синий фон, синий border + белый дефис
 *   focus-unchecked     — серый фон, синий border + focus ring
 *   focus-checked       — синий фон, синий border + галочка + focus ring
 *   disabled-unchecked  — серый фон, серый border + opacity
 *   disabled-checked    — синий фон, синий border + галочка + opacity
 *   disabled-indeterminate — синий фон + дефис + opacity
 */

export type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg';

export type CheckboxState =
  | 'unchecked'
  | 'checked'
  | 'indeterminate'
  | 'exclude'
  | 'focus-unchecked'
  | 'focus-checked'
  | 'focus-exclude'
  | 'disabled-unchecked'
  | 'disabled-checked'
  | 'disabled-indeterminate'
  | 'disabled-exclude';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: CheckboxSize;
  /**
   * Визуальное состояние (override).
   * Если не задан — вычисляется из checked/indeterminate/exclude/disabled пропсов.
   */
  state?: CheckboxState;
  /** Indeterminate (частично выбран) — отображает плюс */
  indeterminate?: boolean;
  /** Exclude mode (кроме) — отображает минус, label зачёркнут */
  exclude?: boolean;
  /** Label рядом с чекбоксом */
  label?: React.ReactNode;
}
