import React from 'react';

/**
 * @UI/Tooltip
 * Всплывающая подсказка: пузырёк с текстом и стрелкой.
 * position: top | bottom | left | right
 * appearance: base | success | warning | danger
 *
 * Два режима использования:
 * 1. Как обёртка над trigger-элементом: <Tooltip content="hint"><Button>…</Button></Tooltip>
 * 2. Как чистый пузырёк (TooltipBubble) для Storybook / позиционирования вручную.
 */

export type TooltipPosition   = 'top' | 'bottom' | 'left' | 'right';
export type TooltipAppearance = 'base' | 'success' | 'warning' | 'danger';

/** Props для компонента-обёртки Tooltip (показывает пузырёк при hover/focus) */
export interface TooltipProps {
  /** Текст или ReactNode внутри пузырька */
  content: React.ReactNode;
  /** Позиция пузырька относительно trigger */
  position?: TooltipPosition;
  /** Визуальный стиль */
  appearance?: TooltipAppearance;
  /** Trigger-элемент, поверх которого показывается тултип */
  children: React.ReactNode;
  /** Задержка появления в мс (default 0) */
  delayMs?: number;
  /** Дополнительный className обёртки */
  className?: string;
}

/** Props для изолированного пузырька (TooltipBubble) — для Storybook и тестов */
export interface TooltipBubbleProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  appearance?: TooltipAppearance;
  className?: string;
  style?: React.CSSProperties;
}
