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
  SCENARIO_MONTH_FORECAST_LABELS,
  SCENARIO_WEEK_DAY_LABELS,
  ScenarioCorridorPlot,
  ScenarioHudMetric,
  isHudMetricDanger,
  SCENARIO_HUD_CYCLE_MS,
  SCENARIO_HUD_SLOW_CYCLE_MS,
  useFrameCycle,
  useInViewAnimation,
} from './scenarioShared';
import { ScenarioCorridorChart } from './ScenarioCorridorChart';

export const CO2_CORRIDOR = {
  min: 800,
  max: 1100,
  yMin: 720,
  yMax: 1180,
  unit: 'ppm',
} as const;

export const LOSS_CORRIDOR = {
  min: 3.6,
  max: 4.5,
  yMin: 3.2,
  yMax: 7.0,
  unit: '%',
} as const;

/** 4 усреднённых замера в сутки × 7 дней — стабильно в коридоре */
export const CO2_WEEK_SERIES: number[] = [
  880, 900, 890, 910,
  920, 930, 915, 925,
  940, 950, 935, 945,
  960, 970, 955, 965,
  970, 980, 965, 955,
  940, 930, 925, 915,
  910, 915, 918, 920,
];

/** Прогноз потерь: 0,08 %/сут × 30 сут от текущих 4,2 % */
export const LOSS_FORECAST_SERIES: number[] = [4.2, 4.52, 4.76, 5.32, 5.88, 6.44];

const DAY_LABELS = [...SCENARIO_WEEK_DAY_LABELS];
const FORECAST_LABELS = [...SCENARIO_MONTH_FORECAST_LABELS];

const CO2_VALUE_FRAMES = ['918', '919', '920', '920', '921', '920'];
const LOSS_VALUE_FRAMES = ['4,2', '4,2', '4,2', '4,2', '4,2', '4,3'];

const formatCo2 = (value: number) => String(Math.round(value));
const formatLoss = (value: number) => value.toFixed(1);

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

export const DamiatCo2ScenarioPreview: React.FC<{ className?: string }> = ({ className }) => {
  const { rootRef, animating } = useInViewAnimation(true);
  const co2Frame = useFrameCycle(CO2_VALUE_FRAMES, animating, SCENARIO_HUD_CYCLE_MS);
  const lossFrame = useFrameCycle(LOSS_VALUE_FRAMES, animating, SCENARIO_HUD_SLOW_CYCLE_MS);
  const co2Danger = isHudMetricDanger(co2Frame, CO2_CORRIDOR, 'outside');
  const lossDanger = isHudMetricDanger(lossFrame, LOSS_CORRIDOR, 'above');

  return (
    <div ref={rootRef} className={cn('h-full w-full min-w-0', className)}>
      <DamiatScenarioPreviewFrame sectionLabel="Секция 2 · CO₂">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--space-6)] overflow-hidden">
          <div className="grid shrink-0 grid-cols-2 gap-[var(--space-6)]">
            <ScenarioHudMetric label="CO₂ сейчас">
              <HudFadingValue value={co2Frame} large danger={co2Danger} />
              <span className="damiat-hud-sensor__label text-[11px]">{CO2_CORRIDOR.unit}</span>
            </ScenarioHudMetric>
            <ScenarioHudMetric label="Потери">
              <HudFadingValue value={lossFrame} large danger={lossDanger} />
              <span className="damiat-hud-sensor__label text-[11px]">{LOSS_CORRIDOR.unit}</span>
            </ScenarioHudMetric>
          </div>

          <div className="grid min-h-0 min-w-0 flex-1 grid-rows-2 gap-[var(--space-4)]">
            <ChartCard
              title="Уровень CO₂"
              subtitle={`7 сут · ${CO2_CORRIDOR.min}–${CO2_CORRIDOR.max} ${CO2_CORRIDOR.unit}`}
              legend={
                <>
                  <ChartLegendItem color="var(--color-brand-primary)" label="Факт · в коридоре" />
                  <ChartLegendItem
                    color="color-mix(in srgb, var(--color-brand-primary) 14%, transparent)"
                    label="Допустимый коридор"
                    variant="band"
                  />
                </>
              }
            >
              <ScenarioCorridorChart
                series={CO2_WEEK_SERIES}
                corridorMin={CO2_CORRIDOR.min}
                corridorMax={CO2_CORRIDOR.max}
                yMin={CO2_CORRIDOR.yMin}
                yMax={CO2_CORRIDOR.yMax}
                xLabels={DAY_LABELS}
                unit={CO2_CORRIDOR.unit}
                formatValue={formatCo2}
                className={SCENARIO_CORRIDOR_CHART_CLASS}
                ariaLabel={`Уровень CO₂ за 7 суток, коридор ${CO2_CORRIDOR.min}–${CO2_CORRIDOR.max} ${CO2_CORRIDOR.unit}`}
                highlightIndex={CO2_WEEK_SERIES.length - 1}
              />
            </ChartCard>

            <ChartCard
              title="Прогноз потерь массы"
              subtitle={`30 сут · до ${formatLoss(LOSS_CORRIDOR.max)} ${LOSS_CORRIDOR.unit}`}
              legend={
                <>
                  <ChartLegendItem color="var(--color-brand-primary)" label="Прогноз · в коридоре" />
                  <ChartLegendItem color="var(--color-danger-base)" label="Выше 4,5 %" />
                  <ChartLegendItem color="var(--color-danger-base)" label="≈+4 сут" dashed />
                </>
              }
            >
              <ScenarioCorridorChart
                series={LOSS_FORECAST_SERIES}
                corridorMin={LOSS_CORRIDOR.min}
                corridorMax={LOSS_CORRIDOR.max}
                yMin={LOSS_CORRIDOR.yMin}
                yMax={LOSS_CORRIDOR.yMax}
                xLabels={FORECAST_LABELS}
                unit={LOSS_CORRIDOR.unit}
                formatValue={formatLoss}
                className={SCENARIO_CORRIDOR_CHART_CLASS}
                showArea={false}
                highlightIndex={0}
                milestoneIndex={1}
                milestoneLabel="≈4 сут"
                ariaLabel="Прогноз потерь массы на 30 суток при темпе 0,08 %/сут"
              />
            </ChartCard>
          </div>

          <p className={SCENARIO_FOOTER_CLASS}>
            CO₂ стабилен — режим хранения без изменений. При текущем темпе потерь выход за 4,5 % ожидается через
            ~4 сут.
          </p>
        </div>
      </DamiatScenarioPreviewFrame>
    </div>
  );
};

DamiatCo2ScenarioPreview.displayName = 'DamiatCo2ScenarioPreview';
