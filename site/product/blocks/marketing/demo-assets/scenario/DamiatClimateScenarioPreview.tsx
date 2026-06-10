import React from 'react';
import { cn } from '@ai-ds/core/shared';
import {
  DamiatScenarioPreviewFrame,
  HudFadingValue,
  SCENARIO_CHART_CARD_CLASS,
  SCENARIO_CHART_HEADER_CLASS,
  SCENARIO_CHART_TITLE_CLASS,
  SCENARIO_CHART_SUBTITLE_CLASS,
  SCENARIO_CORRIDOR_CHART_CLASS,
  SCENARIO_FOOTER_CLASS,
  SCENARIO_WEEK_DAY_LABELS,
  ScenarioCorridorPlot,
  ScenarioHudMetric,
  isHudMetricDanger,
  SCENARIO_HUD_CYCLE_MS,
  useFrameCycle,
  useInViewAnimation,
} from './scenarioShared';
import { ScenarioCorridorChart } from './ScenarioCorridorChart';

export const TEMP_CORRIDOR = {
  min: 3.5,
  max: 4.5,
  yMin: 3.0,
  yMax: 5.0,
  unit: '°C',
} as const;

export const RH_CORRIDOR = {
  min: 85,
  max: 92,
  yMin: 78,
  yMax: 96,
  unit: '%',
} as const;

/** 4 усреднённых замера в сутки × 7 дней — стабильно в коридоре */
export const TEMP_WEEK_SERIES: number[] = [
  4.0, 4.1, 4.0, 4.1,
  4.1, 4.1, 4.2, 4.1,
  4.1, 4.2, 4.1, 4.2,
  4.2, 4.1, 4.2, 4.2,
  4.2, 4.3, 4.2, 4.3,
  4.2, 4.3, 4.3, 4.2,
  4.2, 4.3, 4.2, 4.2,
];

/** Просадка RH к «сегодня» ниже коридора 85 % */
export const RH_WEEK_SERIES: number[] = [
  87, 88, 87, 86,
  87, 86, 87, 86,
  86, 87, 86, 87,
  86, 85, 86, 85,
  85, 86, 85, 84,
  84, 85, 83, 84,
  83, 82, 83, 82,
];

const DAY_LABELS = [...SCENARIO_WEEK_DAY_LABELS];

const HUD_FRAMES = [
  { temp: '+4.2', rh: '87' },
  { temp: '+4.2', rh: '87' },
  { temp: '+4.2', rh: '86' },
  { temp: '+4.2', rh: '86' },
  { temp: '+4.1', rh: '85' },
  { temp: '+4.2', rh: '82' },
];

const formatTemp = (value: number) => value.toFixed(1);
const formatRh = (value: number) => String(Math.round(value));

function ChartLegendItem({
  color,
  label,
  dashed = false,
  variant = 'line',
}: {
  color: string;
  label: string;
  dashed?: boolean;
  variant?: 'line' | 'band';
}) {
  return (
    <span className="inline-flex items-center gap-[var(--space-3)] text-[10px] font-normal leading-none text-[var(--color-text-secondary)]">
      {variant === 'band' ? (
        <span
          className="inline-block h-[8px] w-[var(--space-12)] rounded-[2px]"
          style={{ background: color }}
          aria-hidden
        />
      ) : (
        <span
          className="inline-block h-0 w-[var(--space-12)] border-t-2"
          style={{ borderColor: color, borderStyle: dashed ? 'dashed' : 'solid' }}
          aria-hidden
        />
      )}
      {label}
    </span>
  );
}

function ChartCard({
  title,
  subtitle,
  legend,
  children,
}: {
  title: string;
  subtitle: string;
  legend: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={SCENARIO_CHART_CARD_CLASS}>
      <div className={SCENARIO_CHART_HEADER_CLASS}>
        <span className={SCENARIO_CHART_TITLE_CLASS}>{title}</span>
        <span className={SCENARIO_CHART_SUBTITLE_CLASS}>{subtitle}</span>
      </div>
      <ScenarioCorridorPlot>{children}</ScenarioCorridorPlot>
      <div className="mt-[var(--space-2)] flex shrink-0 flex-wrap items-center justify-start gap-x-[var(--space-6)] gap-y-[var(--space-2)] border-t border-[var(--color-border-base)] pt-[var(--space-2)]">
        {legend}
      </div>
    </div>
  );
}

export const DamiatClimateScenarioPreview: React.FC<{ className?: string }> = ({ className }) => {
  const { rootRef, animating } = useInViewAnimation(true);
  const frame = useFrameCycle(HUD_FRAMES, animating, SCENARIO_HUD_CYCLE_MS);
  const rhLow = isHudMetricDanger(frame.rh, RH_CORRIDOR, 'below');
  const tempHigh = isHudMetricDanger(frame.temp, TEMP_CORRIDOR, 'above');

  return (
    <div ref={rootRef} className={cn('h-full w-full min-w-0', className)}>
      <DamiatScenarioPreviewFrame sectionLabel="Секция 2 · T° / RH">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--space-6)] overflow-hidden">
          <div className="grid shrink-0 grid-cols-2 gap-[var(--space-6)]">
            <ScenarioHudMetric label="T° средняя · 6 точек">
              <HudFadingValue value={frame.temp} large danger={tempHigh} />
            </ScenarioHudMetric>
            <ScenarioHudMetric label="Влажность RH">
              <HudFadingValue value={frame.rh} large danger={rhLow} />
              <span className="damiat-hud-sensor__label text-[11px]">{RH_CORRIDOR.unit}</span>
            </ScenarioHudMetric>
          </div>

          <div className="grid min-h-0 min-w-0 flex-1 grid-rows-2 gap-[var(--space-4)]">
            <ChartCard
              title="T° продукта"
              subtitle={`7 сут · ${formatTemp(TEMP_CORRIDOR.min)}–${formatTemp(TEMP_CORRIDOR.max)} ${TEMP_CORRIDOR.unit}`}
              legend={
                <>
                  <ChartLegendItem color="var(--color-brand-primary)" label="Факт · в коридоре" />
                  <ChartLegendItem
                    color="color-mix(in srgb, var(--color-brand-primary) 14%, transparent)"
                    label="Допустимый коридор"
                    variant="band"
                  />
                  <ChartLegendItem color="var(--color-danger-base)" label="Выше 4,5 °C" />
                </>
              }
            >
              <ScenarioCorridorChart
                series={TEMP_WEEK_SERIES}
                corridorMin={TEMP_CORRIDOR.min}
                corridorMax={TEMP_CORRIDOR.max}
                yMin={TEMP_CORRIDOR.yMin}
                yMax={TEMP_CORRIDOR.yMax}
                xLabels={DAY_LABELS}
                unit={TEMP_CORRIDOR.unit}
                formatValue={formatTemp}
                dangerOutside="above"
                className={SCENARIO_CORRIDOR_CHART_CLASS}
                ariaLabel={`T° продукта за 7 суток, коридор ${formatTemp(TEMP_CORRIDOR.min)}–${formatTemp(TEMP_CORRIDOR.max)} ${TEMP_CORRIDOR.unit}`}
                highlightIndex={TEMP_WEEK_SERIES.length - 1}
              />
            </ChartCard>

            <ChartCard
              title="Влажность RH"
              subtitle={`7 сут · ${RH_CORRIDOR.min}–${RH_CORRIDOR.max} ${RH_CORRIDOR.unit}`}
              legend={
                <>
                  <ChartLegendItem color="var(--color-brand-primary)" label="Факт · в коридоре" />
                  <ChartLegendItem
                    color="color-mix(in srgb, var(--color-brand-primary) 14%, transparent)"
                    label="Коридор КГС"
                    variant="band"
                  />
                  <ChartLegendItem color="var(--color-danger-base)" label="Ниже 85 %" />
                </>
              }
            >
              <ScenarioCorridorChart
                series={RH_WEEK_SERIES}
                corridorMin={RH_CORRIDOR.min}
                corridorMax={RH_CORRIDOR.max}
                yMin={RH_CORRIDOR.yMin}
                yMax={RH_CORRIDOR.yMax}
                xLabels={DAY_LABELS}
                unit={RH_CORRIDOR.unit}
                formatValue={formatRh}
                dangerOutside="below"
                className={SCENARIO_CORRIDOR_CHART_CLASS}
                ariaLabel={`Влажность RH за 7 суток, коридор ${RH_CORRIDOR.min}–${RH_CORRIDOR.max} ${RH_CORRIDOR.unit}`}
                highlightIndex={RH_WEEK_SERIES.length - 1}
              />
            </ChartCard>
          </div>

          <p className={SCENARIO_FOOTER_CLASS}>
            {rhLow
              ? 'Влажность ниже коридора — проверьте увлажнение'
              : tempHigh
                ? 'Перегрев секции — скорректируйте охлаждение'
                : 'T° и RH в целевом диапазоне'}
          </p>
        </div>
      </DamiatScenarioPreviewFrame>
    </div>
  );
};

DamiatClimateScenarioPreview.displayName = 'DamiatClimateScenarioPreview';
