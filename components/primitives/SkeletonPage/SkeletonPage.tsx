import React from 'react';
import type { SkeletonPageProps, SkeletonPageSize } from './SkeletonPage.types';
import { SkeletonBlock } from '../_shared/SkeletonBlock';
import { cn, getSkeletonContainerClasses } from '../_shared';

/**
 * SkeletonPage — token-driven container, hero/card silhouette stays in code.
 */
const SIZE: Record<SkeletonPageSize, {
  outerW: number; heroPx: number; cardMediaPx: number; navBlockH: number;
  subtitleW1: number; subtitleW2: number;
  tagWidths: number[]; cardContentTitleW: number; cardContentDescW: number;
}> = {
  sm: { outerW: 320, heroPx: 80,  cardMediaPx: 80,  navBlockH: 14, subtitleW1: 169, subtitleW2: 108, tagWidths: [40,31,25], cardContentTitleW: 56, cardContentDescW: 40 },
  md: { outerW: 480, heroPx: 120, cardMediaPx: 100, navBlockH: 16, subtitleW1: 240, subtitleW2: 160, tagWidths: [56,44,34], cardContentTitleW: 80, cardContentDescW: 60 },
  lg: { outerW: 800, heroPx: 200, cardMediaPx: 140, navBlockH: 18, subtitleW1: 380, subtitleW2: 240, tagWidths: [80,60,48], cardContentTitleW: 120, cardContentDescW: 90 },
};

const SkeletonPageInner = React.forwardRef<HTMLDivElement, SkeletonPageProps>(({
  size = 'sm',
  shimmer = true,
  className,
  style,
}, ref) => {
  const s = SIZE[size];
  // outerW − padding (var(--space-6)) on each side = outerW − 12.
  // Card grid: 3 columns with gap var(--space-9). cardW = (inner − 18) / 3.
  const inner = s.outerW - 12;
  const cardW = Math.floor((inner - 18) / 3);
  const containerClasses = getSkeletonContainerClasses('page', size);

  return (
    <div
      ref={ref}
      className={cn('flex flex-col', ...containerClasses, className)}
      style={style}
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      {/* Header — nav breadcrumbs */}
      <div className="flex flex-row items-center gap-[var(--space-6)]">
        <SkeletonBlock shimmer={shimmer} width={55} height={s.navBlockH} radius="var(--radius-default)" />
        <SkeletonBlock shimmer={shimmer} width={31} height={s.navBlockH} radius="var(--radius-default)" />
        <SkeletonBlock shimmer={shimmer} width={22} height={s.navBlockH} radius="var(--radius-default)" />
      </div>

      {/* Hero block */}
      <SkeletonBlock shimmer={shimmer} width="100%" height={s.heroPx} radius="var(--radius-medium)" />

      {/* Subtitle lines */}
      <SkeletonBlock shimmer={shimmer} width={s.subtitleW1} height={8} radius="var(--radius-default)" />
      <SkeletonBlock shimmer={shimmer} width={s.subtitleW2} height={8} radius="var(--radius-default)" />

      {/* Tags row */}
      <div className="flex flex-row gap-[var(--space-8)]">
        {s.tagWidths.map((w, i) => (
          <SkeletonBlock key={i} shimmer={shimmer} width={w} height={12} radius="var(--radius-full)" />
        ))}
      </div>

      {/* Card grid — 3 cards, gap var(--space-9) */}
      <div className="flex flex-row gap-[var(--space-9)]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-[var(--space-8)] rounded-[var(--radius-medium)]"
            style={{ width: cardW }}
          >
            <SkeletonBlock shimmer={shimmer} width={cardW} height={s.cardMediaPx} radius="var(--radius-medium)" />
            <div className="flex flex-col gap-[var(--space-6)] px-[var(--space-8)]">
              <SkeletonBlock shimmer={shimmer} width={s.cardContentTitleW} height={8} radius="var(--radius-default)" />
              <SkeletonBlock shimmer={shimmer} width={s.cardContentDescW} height={8} radius="var(--radius-default)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

SkeletonPageInner.displayName = 'SkeletonPage';
export const SkeletonPage = React.memo(SkeletonPageInner);
