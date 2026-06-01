import React, { useMemo } from 'react';
import { cn } from '../../../../components/primitives/_shared';
import { useScenarioPlotSize } from './scenarioShared';

export type ScenarioCorridorChartProps = {
  series: number[];
  corridorMin: number;
  corridorMax: number;
  yMin?: number;
  yMax?: number;
  /** One label per day boundary (length = day count). Placed evenly across the series. */
  xLabels: string[];
  unit?: string;
  highlightIndex?: number;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  className?: string;
  viewW?: number;
  viewH?: number;
  /** Stretch SVG to fill the container (for dual-chart layouts). */
  fillContainer?: boolean;
  /** How the chart scales inside its box: contain = letterbox, cover = crop, stretch = fill (may distort). */
  fitMode?: 'contain' | 'cover' | 'stretch';
  /** Dash pattern for the line segments (e.g. forecast). */
  lineDasharray?: string;
  /** Fill area under the line. */
  showArea?: boolean;
  /** Vertical marker on the X axis (e.g. forecast threshold day). */
  milestoneIndex?: number;
  milestoneLabel?: string;
  /** Which corridor breach paints segments and highlight in danger color. Default: above max. */
  dangerOutside?: 'above' | 'below' | 'both';
};

const CHART_AXIS_LABEL_FILL = 'var(--color-text-secondary)';
const CHART_AXIS_LABEL_SIZE = 9;
const VIEW_W = 360;
const VIEW_H = 160;
const PAD = { left: 34, right: 42, top: 10, bottom: 22 };

function defaultFormatValue(value: number): string {
  return value.toFixed(2);
}

function valueToY(value: number, yMin: number, yMax: number, plotTop: number, plotBottom: number): number {
  const range = yMax - yMin || 1;
  return plotTop + (plotBottom - plotTop) * (1 - (value - yMin) / range);
}

function isOutsideCorridor(
  value: number,
  corridorMin: number,
  corridorMax: number,
  dangerOutside: 'above' | 'below' | 'both',
): boolean {
  if (dangerOutside === 'below') return value < corridorMin;
  if (dangerOutside === 'both') return value > corridorMax || value < corridorMin;
  return value > corridorMax;
}

function buildSegments(
  points: { x: number; y: number; value: number }[],
  corridorMin: number,
  corridorMax: number,
  dangerOutside: 'above' | 'below' | 'both',
): { path: string; over: boolean }[] {
  const segments: { path: string; over: boolean }[] = [];

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const over =
      isOutsideCorridor(a.value, corridorMin, corridorMax, dangerOutside) ||
      isOutsideCorridor(b.value, corridorMin, corridorMax, dangerOutside);
    segments.push({ path: `M ${a.x},${a.y} L ${b.x},${b.y}`, over });
  }

  return segments;
}

function buildAreaSegments(
  points: { x: number; y: number; value: number }[],
  plotBottom: number,
  corridorMin: number,
  corridorMax: number,
  dangerOutside: 'above' | 'below' | 'both',
): { path: string; over: boolean }[] {
  return buildSegments(points, corridorMin, corridorMax, dangerOutside).map((seg, i) => {
    const a = points[i];
    const b = points[i + 1];
    return {
      over: seg.over,
      path: `M ${a.x},${a.y} L ${b.x},${b.y} L ${b.x},${plotBottom} L ${a.x},${plotBottom} Z`,
    };
  });
}

export function ScenarioCorridorChart({
  series,
  corridorMin,
  corridorMax,
  yMin: yMinProp,
  yMax: yMaxProp,
  xLabels,
  unit = 'ppm',
  highlightIndex,
  formatValue = defaultFormatValue,
  ariaLabel,
  className,
  viewW: viewWProp,
  viewH: viewHProp,
  fillContainer = false,
  fitMode: fitModeProp,
  lineDasharray,
  showArea = true,
  milestoneIndex,
  milestoneLabel,
  dangerOutside = 'above',
}: ScenarioCorridorChartProps) {
  const plotSize = useScenarioPlotSize();
  const responsive = plotSize !== null && viewWProp === undefined && viewHProp === undefined;
  const viewW = viewWProp ?? plotSize?.w ?? VIEW_W;
  const viewH = viewHProp ?? plotSize?.h ?? VIEW_H;

  const scaleX = viewW / VIEW_W;
  const scaleY = viewH / VIEW_H;
  const geomScale = Math.min(scaleX, scaleY);
  const axisFontSize = Math.max(7, CHART_AXIS_LABEL_SIZE * geomScale);
  const milestoneFontSize = Math.max(7, 8 * geomScale);
  const lineStrokeWidth = Math.max(1.25, 2 * geomScale);
  const markerRadius = Math.max(2.5, 4 * geomScale);
  const markerInnerRadius = Math.max(1, 1.5 * geomScale);

  const yMin = yMinProp ?? corridorMin - 0.02;
  const yMax = yMaxProp ?? corridorMax + 0.02;
  const plotLeft = PAD.left * scaleX;
  const plotRight = viewW - PAD.right * scaleX;
  const plotTop = PAD.top * scaleY;
  const plotBottom = viewH - PAD.bottom * scaleY;
  const plotW = plotRight - plotLeft;
  const plotH = plotBottom - plotTop;

  const toY = (value: number) => valueToY(value, yMin, yMax, plotTop, plotBottom);

  const chart = useMemo(() => {
    if (series.length < 2) return null;

    const stepX = plotW / (series.length - 1);
    const coords = series.map((value, i) => ({
      x: plotLeft + i * stepX,
      y: toY(value),
      value,
    }));

    const yCorridorMin = toY(corridorMin);
    const yCorridorMax = toY(corridorMax);
    const segments = buildSegments(coords, corridorMin, corridorMax, dangerOutside);
    const areaSegments = buildAreaSegments(coords, plotBottom, corridorMin, corridorMax, dangerOutside);

    const dayCount = xLabels.length;
    const pointsPerDay = (series.length - 1) / (dayCount - 1);
    const dayLines = Array.from({ length: dayCount }, (_, day) => {
      const index = Math.min(Math.round(day * pointsPerDay), series.length - 1);
      return plotLeft + index * stepX;
    });

    const yTicks = [yMin, corridorMin, (corridorMin + corridorMax) / 2, corridorMax, yMax];

    const highlight =
      highlightIndex !== undefined && coords[highlightIndex]
        ? coords[highlightIndex]
        : coords[coords.length - 1];

    const milestone =
      milestoneIndex !== undefined && coords[milestoneIndex]
        ? { x: coords[milestoneIndex].x, label: milestoneLabel }
        : null;

    return { coords, yCorridorMin, yCorridorMax, segments, areaSegments, dayLines, yTicks, highlight, stepX, milestone };
  }, [
    series,
    corridorMin,
    corridorMax,
    yMin,
    yMax,
    xLabels.length,
    highlightIndex,
    milestoneIndex,
    milestoneLabel,
    plotLeft,
    plotW,
    plotBottom,
    plotTop,
    viewW,
    viewH,
    dangerOutside,
  ]);

  if (!chart) return null;

  const { yCorridorMin, yCorridorMax, segments, areaSegments, dayLines, yTicks, highlight, milestone } = chart;
  const highlightDanger = isOutsideCorridor(highlight.value, corridorMin, corridorMax, dangerOutside);

  const resolvedAriaLabel =
    ariaLabel ??
    `График за ${xLabels.length} суток, коридор ${formatValue(corridorMin)}–${formatValue(corridorMax)} ${unit}`;

  const fitMode = fitModeProp ?? (fillContainer ? 'stretch' : responsive ? 'stretch' : 'contain');
  const preserveAspectRatio = responsive
    ? 'none'
    : fitMode === 'stretch'
      ? 'none'
      : fitMode === 'cover'
        ? 'xMinYMid slice'
        : 'xMidYMid meet';

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      className={cn('h-full w-full', className)}
      preserveAspectRatio={preserveAspectRatio}
      overflow="hidden"
      role="img"
      aria-label={resolvedAriaLabel}
    >
      {/* Y grid + labels */}
      {yTicks.map((tick) => {
        const y = toY(tick);
        const isBoundary = tick === corridorMin || tick === corridorMax;
        return (
          <g key={tick}>
            <line
              x1={plotLeft}
              x2={plotRight}
              y1={y}
              y2={y}
              stroke="var(--color-border-base)"
              strokeWidth={isBoundary ? 0 : 1}
              strokeDasharray={isBoundary ? undefined : '2 4'}
              opacity={isBoundary ? 0 : 0.55}
            />
            <text
              x={plotLeft - 6 * scaleX}
              y={y + 3 * scaleY}
              textAnchor="end"
              fontSize={axisFontSize}
              fill={CHART_AXIS_LABEL_FILL}
            >
              {formatValue(tick)}
            </text>
          </g>
        );
      })}

      {/* Corridor band */}
      <rect
        x={plotLeft}
        y={yCorridorMax}
        width={plotW}
        height={Math.max(0, yCorridorMin - yCorridorMax)}
        fill="color-mix(in srgb, var(--color-brand-primary) 14%, transparent)"
      />

      {/* Milestone marker */}
      {milestone ? (
        <g>
          <line
            x1={milestone.x}
            x2={milestone.x}
            y1={plotTop}
            y2={plotBottom}
            stroke="var(--color-danger-base)"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.75}
          />
          {milestone.label ? (
            <text
              x={milestone.x}
              y={plotTop + 8 * scaleY}
              textAnchor="middle"
              fontSize={milestoneFontSize}
              fill="var(--color-danger-base)"
            >
              {milestone.label}
            </text>
          ) : null}
        </g>
      ) : null}

      {/* Day dividers */}
      {dayLines.map((x, i) => (
        <g key={`day-${xLabels[i] ?? i}`}>
          <line
            x1={x}
            x2={x}
            y1={plotTop}
            y2={plotBottom}
            stroke="var(--color-border-base)"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={0.45}
          />
          <text
            x={x}
            y={viewH - 6 * scaleY}
            textAnchor="middle"
            fontSize={axisFontSize}
            fill={CHART_AXIS_LABEL_FILL}
          >
            {xLabels[i]}
          </text>
        </g>
      ))}

      {/* Corridor boundary lines */}
      {[corridorMin, corridorMax].map((bound) => {
        const y = toY(bound);
        return (
          <g key={bound}>
            <line
              x1={plotLeft}
              x2={plotRight}
              y1={y}
              y2={y}
              stroke="var(--color-brand-primary)"
              strokeWidth={1}
              strokeDasharray="4 3"
              opacity={0.85}
            />
            <text
              x={plotRight + 4 * scaleX}
              y={y + 3 * scaleY}
              textAnchor="start"
              fontSize={axisFontSize}
              fill="var(--color-brand-primary)"
            >
              {formatValue(bound)}
            </text>
          </g>
        );
      })}

      {/* Area under line — tinted by corridor breach per segment */}
      {showArea
        ? areaSegments.map((seg, i) => (
            <path
              key={`area-${i}`}
              d={seg.path}
              fill={
                seg.over
                  ? 'color-mix(in srgb, var(--color-danger-base) 14%, transparent)'
                  : 'color-mix(in srgb, var(--color-brand-primary) 10%, transparent)'
              }
            />
          ))
        : null}

      {/* Line segments — danger when above corridor */}
      {segments.map((seg, i) => (
        <path
          key={`seg-${i}`}
          d={seg.path}
          fill="none"
          stroke={seg.over ? 'var(--color-danger-base)' : 'var(--color-brand-primary)'}
          strokeWidth={lineStrokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={lineDasharray}
        />
      ))}

      {/* Current / highlight point */}
      {highlight ? (
        <>
          <circle
            cx={highlight.x}
            cy={highlight.y}
            r={markerRadius}
            fill="var(--color-surface-1)"
            stroke={highlightDanger ? 'var(--color-danger-base)' : 'var(--color-brand-primary)'}
            strokeWidth={lineStrokeWidth}
          />
          <circle
            cx={highlight.x}
            cy={highlight.y}
            r={markerInnerRadius}
            fill={highlightDanger ? 'var(--color-danger-base)' : 'var(--color-brand-primary)'}
          />
        </>
      ) : null}
    </svg>
  );
}

ScenarioCorridorChart.displayName = 'ScenarioCorridorChart';
