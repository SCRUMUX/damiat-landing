import React from 'react';
import { cn } from '../../../../components/primitives/_shared';
import {
  DamiatScenarioPreviewFrame,
  HudFadingValue,
  SCENARIO_CHART_CAPTION_CLASS,
  SCENARIO_CHART_CARD_CLASS,
  SCENARIO_CHART_HEADER_CLASS,
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

export const C2H4_CORRIDOR = {
  min: 0.08,
  max: 0.15,
  yMin: 0.06,
  yMax: 0.17,
  unit: 'ppm',
} as const;

/** 4 усреднённых замера в сутки × 7 дней */
export const C2H4_WEEK_SERIES: number[] = [
  0.1, 0.11, 0.1, 0.09,
  0.1, 0.11, 0.12, 0.11,
  0.11, 0.12, 0.11, 0.1,
  0.12, 0.13, 0.12, 0.11,
  0.13, 0.14, 0.15, 0.16,
  0.17, 0.16, 0.15, 0.14,
  0.13, 0.12, 0.12, 0.12,
];

const DAY_LABELS = [...SCENARIO_WEEK_DAY_LABELS];

const VALUE_FRAMES = ['0.12', '0.12', '0.12', '0.13', '0.13', '0.16'];

export const DamiatC2h4ScenarioPreview: React.FC<{ className?: string }> = ({ className }) => {
  const { rootRef, animating } = useInViewAnimation(true);
  const frame = useFrameCycle(VALUE_FRAMES, animating, SCENARIO_HUD_CYCLE_MS);
  const c2h4Danger = isHudMetricDanger(frame, C2H4_CORRIDOR, 'above');

  return (
    <div ref={rootRef} className={cn('h-full w-full min-w-0', className)}>
      <DamiatScenarioPreviewFrame sectionLabel="Секция 2 · C₂H₄">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--space-6)] overflow-hidden">
          <ScenarioHudMetric label="C₂H₄ сейчас" className="shrink-0">
            <HudFadingValue value={frame} large danger={c2h4Danger} />
            <span className="damiat-hud-sensor__label text-[11px]">{C2H4_CORRIDOR.unit}</span>
          </ScenarioHudMetric>

          <div className={cn(SCENARIO_CHART_CARD_CLASS, 'min-h-[180px] flex-1')}>
            <div className={SCENARIO_CHART_HEADER_CLASS}>
              <span className={SCENARIO_CHART_CAPTION_CLASS}>Динамика · 7 суток</span>
              <span className={SCENARIO_CHART_SUBTITLE_CLASS}>
                Коридор {C2H4_CORRIDOR.min.toFixed(2)}–{C2H4_CORRIDOR.max.toFixed(2)} {C2H4_CORRIDOR.unit}
              </span>
            </div>
            <ScenarioCorridorPlot>
              <ScenarioCorridorChart
                series={C2H4_WEEK_SERIES}
                corridorMin={C2H4_CORRIDOR.min}
                corridorMax={C2H4_CORRIDOR.max}
                yMin={C2H4_CORRIDOR.yMin}
                yMax={C2H4_CORRIDOR.yMax}
                xLabels={DAY_LABELS}
                unit={C2H4_CORRIDOR.unit}
                className={SCENARIO_CORRIDOR_CHART_CLASS}
                highlightIndex={C2H4_WEEK_SERIES.length - 1}
              />
            </ScenarioCorridorPlot>
            <div className="mt-[var(--space-3)] flex shrink-0 flex-wrap items-center justify-start gap-x-[var(--space-10)] gap-y-[var(--space-4)] border-t border-[var(--color-border-base)] pt-[var(--space-3)]">
              <span className="inline-flex items-center gap-[var(--space-4)] text-style-caption font-normal text-[var(--color-text-secondary)]">
                <span
                  className="h-[2px] w-[var(--space-16)] rounded-full bg-[var(--color-brand-primary)]"
                  aria-hidden
                />
                В коридоре
              </span>
              <span className="inline-flex items-center gap-[var(--space-4)] text-style-caption font-normal text-[var(--color-text-secondary)]">
                <span
                  className="h-[2px] w-[var(--space-16)] rounded-full bg-[var(--color-danger-base)]"
                  aria-hidden
                />
                Выше границы
              </span>
            </div>
          </div>

          <p className={SCENARIO_FOOTER_CLASS}>
            Подача этилена снижена — восстановление среды 2–4 ч
          </p>
        </div>
      </DamiatScenarioPreviewFrame>
    </div>
  );
};

DamiatC2h4ScenarioPreview.displayName = 'DamiatC2h4ScenarioPreview';
