import React from 'react';

/**
 * PinInput (@UI/PinInput, Figma node 160:82793)
 *
 * Ряд из 6 квадратных ячеек с точкой (ELLIPSE) внутри.
 * Состояния управляют цветом бордера и точки.
 *
 * Размеры (из Figma API):
 *   sm: ячейка 32×32, gap=2, cornerRadius=8
 *   md: ячейка 40×40, gap=4, cornerRadius=10
 *   lg: ячейка 48×48, gap=6, cornerRadius=12
 */

export type PinInputSize = 'sm' | 'md' | 'lg';

export type PinInputState = 'unfilled' | 'filled' | 'error' | 'disabled';

export interface PinInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Размер ячеек */
  size?: PinInputSize;
  /**
   * Визуальное состояние:
   * - unfilled: пустые ячейки (border-base, dot border-base)
   * - filled: заполненные (border-strong, dot text-muted)
   * - error: ошибка (border danger, dot danger)
   * - disabled: заблокировано (border-disabled, dot text-disabled)
   */
  state?: PinInputState;
  /** Количество ячеек (по умолчанию 6) */
  length?: number;
  /** Значение (массив символов или строка) */
  value?: string;
  /** Callback при изменении значения */
  onChange?: (value: string) => void;
  /** Callback при заполнении всех ячеек */
  onComplete?: (value: string) => void;
  /** Маскировать ввод (показывать точки вместо цифр) */
  mask?: boolean;
}
