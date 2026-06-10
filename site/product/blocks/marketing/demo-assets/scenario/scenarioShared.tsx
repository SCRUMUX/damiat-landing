import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@ai-ds/core/shared';
import '../damiatGasOscilloscope.css';

/** Interval between HUD reading updates (~inertial drift in multi‑kt cells). */
export const SCENARIO_HUD_CYCLE_MS = 10_000;

/** Slower refresh for cumulative metrics (loss %, fuel). */
export const SCENARIO_HUD_SLOW_CYCLE_MS = 14_000;

const SCENARIO_HUD_FADE_MS = 800;

export const SCENARIO_WEEK_DAY_LABELS = ['−6', '−5', '−4', '−3', '−2', '−1', 'сегодня'] as const;

export const SCENARIO_MONTH_FORECAST_LABELS = ['сегодня', '+4', '+7', '+14', '+21', '+30'] as const;

export type ScenarioCorridorBounds = { min: number; max: number };

export type ScenarioHudDangerMode = 'above' | 'below' | 'outside';

/** Parses HUD counter strings like "+4.2", "4,2", "912". */
export function parseHudMetricValue(raw: string): number {
  return Number(raw.replace(/^\+/, '').replace(',', '.'));
}

export function isHudMetricDanger(
  raw: string,
  corridor: ScenarioCorridorBounds,
  mode: ScenarioHudDangerMode = 'outside',
): boolean {
  const value = parseHudMetricValue(raw);
  if (Number.isNaN(value)) return false;
  if (mode === 'above') return value > corridor.max;
  if (mode === 'below') return value < corridor.min;
  return value < corridor.min || value > corridor.max;
}

export function useInViewAnimation(enabled: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { rootRef, animating: enabled && inView };
}

export function useFrameCycle<T>(frames: T[], animating: boolean, intervalMs = SCENARIO_HUD_CYCLE_MS) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!animating) return undefined;
    const id = window.setInterval(() => {
      setFrameIndex((i) => (i + 1) % frames.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [animating, frames.length, intervalMs]);

  return frames[frameIndex];
}

export function HudFadingValue({
  value,
  large,
  className,
  danger = false,
}: {
  value: string;
  large?: boolean;
  className?: string;
  /** Highlights value in danger color when outside the acceptable corridor. */
  danger?: boolean;
}) {
  const [shown, setShown] = useState(value);
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    if (value === shown) return undefined;
    setFaded(true);
    const swap = window.setTimeout(() => {
      setShown(value);
      setFaded(false);
    }, SCENARIO_HUD_FADE_MS);
    return () => window.clearTimeout(swap);
  }, [value, shown]);

  return (
    <span
      className={cn(
        'damiat-hud-sensor__digit damiat-hud-sensor__digit-value font-normal leading-none',
        large ? 'text-[22px] min-[1024px]:text-[28px]' : 'text-[14px] min-[1024px]:text-[16px]',
        danger && 'damiat-hud-sensor__digit--danger',
        className,
      )}
      style={{ ['--damiat-digit-opacity' as string]: faded ? 0.14 : 0.85 }}
    >
      {shown}
    </span>
  );
}

export function DamiatScenarioPreviewFrame({
  sectionLabel,
  children,
  className,
}: {
  sectionLabel: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'damiat-hud-sensor damiat-hud-sensor--surface flex h-full w-full min-h-[280px] min-w-0 flex-col overflow-hidden bg-[var(--color-surface-1)] p-[var(--space-inset-l)] min-[1024px]:min-h-0 min-[1024px]:p-[var(--space-inset-xl)]',
        className,
      )}
    >
      <header className="mb-[var(--space-8)] flex shrink-0 items-center justify-between border-b border-[var(--color-border-base)] pb-[var(--space-6)]">
        <span className="text-style-body-sm font-medium text-[var(--color-text-secondary)]">
          DAMIAT · {sectionLabel}
        </span>
        <span className="flex items-center gap-[var(--space-6)] text-style-caption font-normal text-[var(--color-brand-primary)]">
          <span className="h-[6px] w-[6px] rounded-full bg-[var(--color-brand-primary)]" aria-hidden />
          online
        </span>
      </header>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}

export function ScenarioHudMetric({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('text-center', className)}>
      <span className="damiat-hud-sensor__label block text-[10px] uppercase tracking-[0.14em]">{label}</span>
      <div className="mt-[var(--space-4)] flex items-baseline justify-center gap-[var(--space-4)]">{children}</div>
    </div>
  );
}

export const SCENARIO_FOOTER_CLASS =
  'm-0 shrink-0 px-[var(--space-2)] text-center text-balance text-style-caption font-normal text-[var(--color-text-secondary)]';

export const SCENARIO_CHART_CARD_CLASS =
  'flex h-full min-h-0 min-w-0 flex-col rounded-[var(--radius-medium)] border border-[var(--color-border-base)] bg-[var(--color-surface-2)] p-[var(--space-inset-l)]';

export const SCENARIO_CHART_HEADER_CLASS = 'mb-[var(--space-2)] shrink-0 text-left';

export const SCENARIO_CHART_TITLE_CLASS =
  'block text-[11px] font-medium leading-snug text-[var(--color-text-primary)] min-[1024px]:text-[12px]';

export const SCENARIO_CHART_SUBTITLE_CLASS =
  'mt-[var(--space-1)] block text-[10px] font-normal leading-snug text-[var(--color-text-secondary)]';

export const SCENARIO_CHART_CAPTION_CLASS =
  'mb-[var(--space-3)] block text-left text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]';

export type ScenarioPlotSize = { w: number; h: number };

const ScenarioPlotSizeContext = React.createContext<ScenarioPlotSize | null>(null);

export function useScenarioPlotSize(): ScenarioPlotSize | null {
  return React.useContext(ScenarioPlotSizeContext);
}

/**
 * Plot slot that fills card width and available row height.
 * Measures via ResizeObserver and exposes size to ScenarioCorridorChart through context.
 */
export function ScenarioCorridorPlot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [plotSize, setPlotSize] = useState<ScenarioPlotSize>({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setPlotSize({
        w: Math.max(1, Math.round(width)),
        h: Math.max(1, Math.round(height)),
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const measured = plotSize.w > 0 && plotSize.h > 0;

  return (
    <ScenarioPlotSizeContext.Provider value={measured ? plotSize : null}>
      <div
        ref={ref}
        className={cn('min-h-0 flex-1 overflow-hidden w-full min-w-0', className)}
      >
        {measured ? <div className="h-full w-full">{children}</div> : null}
      </div>
    </ScenarioPlotSizeContext.Provider>
  );
}

export const SCENARIO_CORRIDOR_CHART_CLASS = 'block h-full w-full';

/** Simple polyline in 0..100 coords mapped to viewBox */
export function Sparkline({
  points,
  stroke,
  fill,
  className,
  viewW = 320,
  viewH = 120,
}: {
  points: number[];
  stroke: string;
  fill?: string;
  className?: string;
  viewW?: number;
  viewH?: number;
}) {
  if (points.length < 2) return null;

  const pad = 8;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = (viewW - pad * 2) / (points.length - 1);

  const coords = points.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (viewH - pad * 2) * (1 - (v - min) / range);
    return `${x},${y}`;
  });

  const linePath = `M ${coords.join(' L ')}`;
  const areaPath = `${linePath} L ${pad + (points.length - 1) * stepX},${viewH - pad} L ${pad},${viewH - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      className={cn('h-full w-full', className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      {fill ? <path d={areaPath} fill={fill} /> : null}
      <path d={linePath} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
