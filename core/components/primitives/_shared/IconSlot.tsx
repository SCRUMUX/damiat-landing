/**
 * Shared IconSlot — обёртка для иконок в компонентах.
 * Масштабирует SVG до 100%×100% контейнера, применяет currentColor.
 */
import React from 'react';

interface IconSlotProps {
  icon: React.ReactNode;
  color?: string;
  /** CSS переменная или пиксельное значение, default: var(--icon-size, 20px) */
  size?: string;
  className?: string;
}

const IconSlotInner: React.FC<IconSlotProps> = ({
  icon,
  color = 'var(--icon-color, currentColor)',
  size = 'var(--icon-size, 20px)',
  className = '',
}) => {
  if (!icon) return null;

  const cloned = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ style?: React.CSSProperties }>, {
        style: { width: '100%', height: '100%' },
      })
    : icon;

  return (
    <span
      className={`shrink-0 flex items-center justify-center [&_svg]:!w-full [&_svg]:!h-full ${className}`}
      style={{ color, width: size, height: size }}
    >
      {cloned}
    </span>
  );
};

export const IconSlot = React.memo(IconSlotInner);
