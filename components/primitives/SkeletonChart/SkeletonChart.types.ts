import React from 'react';

/**
 * @UI/Skeleton/Chart
 * Шаблон-заглушка для графика.
 * chartType: bar (столбцы) | line (область+линия) | donut (кольцо)
 * Структура: ChartTitle → MetricValue → Legend (3 dot+label) → ChartArea.
 * size:    sm=320 / md=480 / lg=800 px
 * shimmer: true/false
 */
export type SkeletonChartSize     = 'sm' | 'md' | 'lg';
export type SkeletonChartType     = 'bar' | 'line' | 'donut';

export interface SkeletonChartProps {
  size?:      SkeletonChartSize;
  shimmer?:   boolean;
  chartType?: SkeletonChartType;
  className?: string;
  style?:     React.CSSProperties;
}
