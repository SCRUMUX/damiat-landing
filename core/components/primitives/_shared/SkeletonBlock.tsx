import React from 'react';

/**
 * SkeletonBlock — базовый блок-заглушка.
 *
 * Анимация shimmer реализована корректно:
 * - Внешний div стоит на месте, имеет `overflow: hidden` и `position: relative`.
 * - Внутренний абсолютный div со скользящим градиентом анимируется translateX.
 * - Это гарантирует, что градиент ОБРЕЗАЕТСЯ границами блока, а не уезжает за его пределы.
 *
 * shimmer=true  → скользящий градиент поверх surface-3
 * shimmer=false → статичный surface-3
 */

interface SkeletonBlockProps {
  shimmer?: boolean;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonBlockInner = React.forwardRef<HTMLDivElement, SkeletonBlockProps>(({
  shimmer = true,
  width,
  height,
  radius = 'var(--radius-default)',
  className,
  style,
}, ref) => {
  const isCircle = radius === 9999 || radius === '9999' || radius === 'var(--radius-full)' || radius === 'var(--radius-pill)';
  const borderRadius = isCircle ? '9999px' : radius;

  return (
    <div
      ref={ref}
      className={[
        // position: relative + overflow: hidden — обрезает движущийся градиент
        'relative overflow-hidden',
        'bg-[var(--color-surface-3)]',
        isCircle ? 'rounded-full' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      style={{
        width,
        height,
        borderRadius,
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Shimmer overlay — скользит внутри родителя, обрезается через overflow:hidden.
          Использует surface-2 как цвет блика — он светлее surface-3 в обеих темах. */}
      {shimmer && (
        <div
          className="animate-shimmer absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--color-surface-2) 50%, transparent 100%)',
          }}
        />
      )}
    </div>
  );
});

SkeletonBlockInner.displayName = 'SkeletonBlock';
export const SkeletonBlock = React.memo(SkeletonBlockInner);
