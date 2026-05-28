import React from 'react';
import type { SkeletonChartProps, SkeletonChartSize, SkeletonChartType } from './SkeletonChart.types';
import { SkeletonBlock } from '../_shared/SkeletonBlock';
import { cn, getSkeletonContainerClasses } from '../_shared';

const SHAPE: Record<SkeletonChartSize, {
  chartAreaH: number; metricValueW: number; metricValueH: number;
}> = {
  sm: { chartAreaH: 80,  metricValueW: 92,  metricValueH: 20 },
  md: { chartAreaH: 120, metricValueW: 130, metricValueH: 28 },
  lg: { chartAreaH: 180, metricValueW: 200, metricValueH: 36 },
};

const BAR_HEIGHTS = [48, 68, 36, 76, 56];

const BarChartArea: React.FC<{ shimmer: boolean; height: number }> = ({ shimmer, height }) => (
  <div
    className="flex flex-row items-end gap-[var(--space-4)] relative w-full"
    style={{ height }}
  >
    {BAR_HEIGHTS.map((bh, i) => {
      const scaledH = Math.round(bh * height / 80);
      return (
        <SkeletonBlock
          key={i}
          shimmer={shimmer}
          className="flex-1 min-w-0"
          height={scaledH}
          radius="var(--radius-subtle)"
        />
      );
    })}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-surface-3)]" aria-hidden="true" />
  </div>
);

const LineChartArea: React.FC<{ shimmer: boolean; height: number }> = ({ shimmer, height }) => {
  const areaH = Math.round(height * 0.6);
  return (
    <div className="flex flex-col justify-end w-full" style={{ height }}>
      <SkeletonBlock shimmer={shimmer} width="100%" height={areaH} radius="var(--radius-0)" />
      <SkeletonBlock shimmer={shimmer} width="100%" height={2} radius="var(--radius-subtle)" />
    </div>
  );
};

const DonutChartArea: React.FC<{ shimmer: boolean; height: number }> = ({ shimmer, height }) => {
  const donutOuter = Math.min(height, 80);
  const donutInner = Math.round(donutOuter * 0.55);
  return (
    <div className="flex items-center justify-start w-full" style={{ height }}>
      <div className="relative shrink-0" style={{ width: donutOuter, height: donutOuter }}>
        <SkeletonBlock shimmer={shimmer} width={donutOuter} height={donutOuter} radius="var(--radius-full)" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-surface-1)]"
          style={{ width: donutInner, height: donutInner }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

const LegendRow: React.FC<{ shimmer: boolean }> = ({ shimmer }) => (
  <div className="flex flex-row items-center gap-[var(--space-6)]">
    {[37, 37, 37].map((lw, i) => (
      <React.Fragment key={i}>
        <SkeletonBlock shimmer={shimmer} width={8} height={8} radius="var(--radius-full)" />
        <SkeletonBlock shimmer={shimmer} width={lw} height={6} radius="var(--radius-default)" />
      </React.Fragment>
    ))}
  </div>
);

const SkeletonChartInner = React.forwardRef<HTMLDivElement, SkeletonChartProps>(({
  size = 'sm',
  shimmer = true,
  chartType = 'bar',
  className,
  style,
}, ref) => {
  const s = SHAPE[size];
  const containerClasses = getSkeletonContainerClasses('chart', size);

  return (
    <div
      ref={ref}
      className={cn('flex flex-col', ...containerClasses, className)}
      style={style}
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      <SkeletonBlock shimmer={shimmer} width={123} height={8} radius="var(--radius-default)" />
      <SkeletonBlock shimmer={shimmer} width={s.metricValueW} height={s.metricValueH} radius="var(--radius-default)" />
      <LegendRow shimmer={shimmer} />
      {chartType === 'bar' && <BarChartArea shimmer={shimmer} height={s.chartAreaH} />}
      {chartType === 'line' && <LineChartArea shimmer={shimmer} height={s.chartAreaH} />}
      {chartType === 'donut' && <DonutChartArea shimmer={shimmer} height={s.chartAreaH} />}
    </div>
  );
});

SkeletonChartInner.displayName = 'SkeletonChart';
export const SkeletonChart = React.memo(SkeletonChartInner);
