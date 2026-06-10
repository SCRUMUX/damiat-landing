import React from 'react';
import type { SkeletonListProps, SkeletonListSize } from './SkeletonList.types';
import { SkeletonBlock } from '../_shared/SkeletonBlock';
import { cn, getSkeletonContainerClasses } from '../_shared';

const SHAPE: Record<SkeletonListSize, {
  avatarPx: number; labelWidths: number[]; metaW: number; rowH: number;
}> = {
  sm: { avatarPx: 16, labelWidths: [168, 112, 146, 130], metaW: 36, rowH: 36 },
  md: { avatarPx: 20, labelWidths: [240, 180, 210, 195], metaW: 48, rowH: 40 },
  lg: { avatarPx: 24, labelWidths: [360, 280, 320, 300], metaW: 64, rowH: 44 },
};

const SkeletonListInner = React.forwardRef<HTMLDivElement, SkeletonListProps>(({
  size = 'sm',
  shimmer = true,
  rows = 4,
  className,
  style,
}, ref) => {
  const s = SHAPE[size];
  const containerClasses = getSkeletonContainerClasses('list', size);

  return (
    <div
      ref={ref}
      className={cn(...containerClasses, className)}
      style={style}
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className="flex flex-row items-center gap-[var(--space-6)]"
            style={{ height: s.rowH }}
          >
            <SkeletonBlock shimmer={shimmer} width={s.avatarPx} height={s.avatarPx} radius="var(--radius-full)" />
            <SkeletonBlock shimmer={shimmer} width={s.labelWidths[i % s.labelWidths.length]} height={8} radius="var(--radius-default)" />
            <div className="flex-1" />
            <SkeletonBlock shimmer={shimmer} width={s.metaW} height={8} radius="var(--radius-default)" />
          </div>
          {i < rows - 1 && (
            <div className="h-px w-full bg-[var(--color-border-base)]" aria-hidden="true" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

SkeletonListInner.displayName = 'SkeletonList';
export const SkeletonList = React.memo(SkeletonListInner);
