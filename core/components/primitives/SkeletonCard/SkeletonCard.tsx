import React from 'react';
import type { SkeletonCardProps, SkeletonCardSize } from './SkeletonCard.types';
import { SkeletonBlock } from '../_shared/SkeletonBlock';
import { cn, getSkeletonContainerClasses } from '../_shared';

/** Per-element shape silhouette — Figma content shape, not spacing scale. */
const SHAPE: Record<SkeletonCardSize, {
  mediaH: number; titleW: number;
  descW1: number; descW2: number; actionW1: number; actionW2: number;
}> = {
  sm: { mediaH: 80,  titleW: 185, descW1: 277, descW2: 216, actionW1: 44, actionW2: 31 },
  md: { mediaH: 110, titleW: 260, descW1: 400, descW2: 320, actionW1: 60, actionW2: 44 },
  lg: { mediaH: 150, titleW: 400, descW1: 680, descW2: 540, actionW1: 80, actionW2: 60 },
};

const SkeletonCardInner = React.forwardRef<HTMLDivElement, SkeletonCardProps>(({
  size = 'sm',
  shimmer = true,
  className,
  style,
}, ref) => {
  const s = SHAPE[size];
  const containerClasses = getSkeletonContainerClasses('card', size);

  return (
    <div
      ref={ref}
      className={cn('flex flex-col', ...containerClasses, className)}
      style={style}
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      <SkeletonBlock shimmer={shimmer} width="100%" height={s.mediaH} radius="var(--radius-default)" />

      <div className="flex flex-col gap-[var(--space-4)] px-[var(--space-6)]">
        <SkeletonBlock shimmer={shimmer} width={s.titleW} height={10} radius="var(--radius-default)" />
        <SkeletonBlock shimmer={shimmer} width={s.descW1} height={8} radius="var(--radius-default)" />
        <SkeletonBlock shimmer={shimmer} width={s.descW2} height={8} radius="var(--radius-default)" />
        <div className="flex flex-row gap-[var(--space-4)]">
          <SkeletonBlock shimmer={shimmer} width={s.actionW1} height={14} radius="var(--radius-full)" />
          <SkeletonBlock shimmer={shimmer} width={s.actionW2} height={14} radius="var(--radius-full)" />
        </div>
      </div>
    </div>
  );
});

SkeletonCardInner.displayName = 'SkeletonCard';
export const SkeletonCard = React.memo(SkeletonCardInner);
