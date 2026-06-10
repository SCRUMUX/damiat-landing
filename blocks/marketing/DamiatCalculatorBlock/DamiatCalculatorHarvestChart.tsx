import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '../../../components/primitives/_shared';
import { buildDynamicsPageTabLabels, DYNAMICS_MONTHS_PER_PAGE } from './calculatorConfig';
import { Tab, TabList, Tabs } from '../../../components/primitives/Tab';
import type { ChartSeriesData, ScenarioBreakdown } from './calculatorEngine';
import { formatRubCompact, formatTonsCompact } from './calculatorEngine';
import { DamiatCalculatorScheduleCell } from './DamiatCalculatorScheduleCell';
import type { ScheduleValidation } from './calculatorSchedule';
import { formatTons } from './calculatorEngine';

import {
  CALC_AXIS_FONT_SIZE,
  CALC_AXIS_LABEL_OFFSET,
  CALC_BAR_X_OFFSET,
  CALC_BAR_ZONE_FILL,
  CALC_CHART_HEIGHT,
  CALC_CHART_PAD,
  CALC_FORECAST_X_OFFSET,
  CALC_LABEL_COL_WIDTH,
  CALC_LEGEND_SWATCH_SIZE,
  CALC_METRIC_ROW_HEIGHT,
  CALC_METRIC_ROW_HEIGHT_STACKED,
  CALC_MONTH_ROW_HEIGHT,
  CALC_PRICE_BAR_MAX_WIDTH,
  CALC_SLOT_VIEW_WIDTH,
} from './calculatorLayout';

export interface DamiatCalculatorHarvestChartProps {
  series: ChartSeriesData | null;
  scenarioWithout: ScenarioBreakdown | null;
  scenarioWith: ScenarioBreakdown | null;
  withGenerator: boolean;
  volumeTons: number;
  salesTonsByMonth: string[];
  opexRubByMonth: string[];
  onSalesCellChange: (monthIndex: number, value: string) => void;
  onSalesCellCommit: (monthIndex: number, value: string) => void;
  onOpexCellChange: (monthIndex: number, value: string) => void;
  scheduleValidation?: ScheduleValidation | null;
  className?: string;
}

const LEGEND = [
  { key: 'past', label: 'Цена прошлая', fill: 'var(--color-text-muted)' },
  { key: 'forecast', label: 'Цена прогноз', fill: 'var(--color-brand-primary)' },
  { key: 'loss', label: 'Потери', fill: 'var(--color-danger-base)' },
] as const;

type RowDef = {
  key: string;
  label: string;
  labelTitle?: string;
  format: (m: ScenarioBreakdown['months'][0]) => string;
  tone?: 'loss' | 'result' | 'stock';
  editable?: 'sales' | 'opex';
  /** Две строки в ячейке: тонны сверху, ₽ снизу */
  stackedCell?: boolean;
};

function metricRowHeight(row: RowDef): number {
  return row.stackedCell ? CALC_METRIC_ROW_HEIGHT_STACKED : CALC_METRIC_ROW_HEIGHT;
}

type BarLayout = {
  label: string;
  past: { x: number; y: number; w: number; h: number };
  forecast: { x: number; y: number; w: number; h: number };
  loss: { x: number; y: number; w: number; h: number };
};

/** Шкалы осей по всему периоду (12 мес.) — не пересчитываются при смене таба */
type AxisScale = {
  zeroY: number;
  priceMax: number;
  lossMax: number;
  priceTicks: number[];
  lossTicks: number[];
  yPriceKg: (kg: number) => number;
  hLossRub: (rub: number) => number;
};

type PageGeometry = AxisScale & {
  viewW: number;
  viewH: number;
  bars: BarLayout[];
};

function pricePerKg(pricePerTon: number): number {
  return pricePerTon / 1000;
}

function sliceSeries(series: ChartSeriesData, start: number, end: number): ChartSeriesData {
  return {
    labels: series.labels.slice(start, end),
    priceLastYear: series.priceLastYear.slice(start, end),
    priceForecast: series.priceForecast.slice(start, end),
    lossRubWithout: series.lossRubWithout.slice(start, end),
    lossRubWith: series.lossRubWith.slice(start, end),
  };
}

function buildAxisScale(fullSeries: ChartSeriesData): AxisScale {
  const zeroY = CALC_CHART_HEIGHT / 2;
  const priceZoneH = (zeroY - CALC_CHART_PAD) * CALC_BAR_ZONE_FILL;
  const lossZoneH = (CALC_CHART_HEIGHT - zeroY - CALC_CHART_PAD) * CALC_BAR_ZONE_FILL;

  const priceKgAll = [
    ...fullSeries.priceLastYear.map(pricePerKg),
    ...fullSeries.priceForecast.map(pricePerKg),
  ];
  const priceMax = Math.max(...priceKgAll, 0.1) * 1.05;
  /** Фиксированная шкала потерь по сценарию «без DAMIAT» на весь период */
  const lossMax = Math.max(...fullSeries.lossRubWithout, 1) * 1.05;

  const yPriceKg = (kg: number) => zeroY - (kg / priceMax) * priceZoneH;
  const hLossRub = (rub: number) => (rub / lossMax) * lossZoneH;

  return {
    zeroY,
    priceMax,
    lossMax,
    priceTicks: [0, 0.5, 1].map((t) => priceMax * t),
    lossTicks: [0, 0.5, 1].map((t) => lossMax * t),
    yPriceKg,
    hLossRub,
  };
}

function buildPageGeometry(
  pageSeries: ChartSeriesData,
  axis: AxisScale,
  withGenerator: boolean,
): PageGeometry {
  const n = pageSeries.labels.length;
  const viewW = Math.max(n * CALC_SLOT_VIEW_WIDTH, CALC_SLOT_VIEW_WIDTH);
  const slotW = viewW / n;
  const lossRubPage = withGenerator ? pageSeries.lossRubWith : pageSeries.lossRubWithout;
  const priceBarW = Math.min(CALC_PRICE_BAR_MAX_WIDTH, slotW * 0.2);
  const forecastXOffset = CALC_FORECAST_X_OFFSET;

  const bars: BarLayout[] = pageSeries.labels.map((label, i) => {
    const cx = (i + 0.5) * slotW;
    const pastKg = pricePerKg(pageSeries.priceLastYear[i]);
    const forecastKg = pricePerKg(pageSeries.priceForecast[i]);
    const lossRub = lossRubPage[i];
    const forecastX = cx + forecastXOffset;

    return {
      label,
      past: {
        x: cx - priceBarW - CALC_BAR_X_OFFSET,
        y: axis.yPriceKg(pastKg),
        w: priceBarW,
        h: axis.zeroY - axis.yPriceKg(pastKg),
      },
      forecast: {
        x: forecastX,
        y: axis.yPriceKg(forecastKg),
        w: priceBarW,
        h: axis.zeroY - axis.yPriceKg(forecastKg),
      },
      loss: {
        x: forecastX,
        y: axis.zeroY,
        w: priceBarW,
        h: axis.hLossRub(lossRub),
      },
    };
  });

  return {
    ...axis,
    viewW,
    viewH: CALC_CHART_HEIGHT,
    bars,
  };
}

function formatLossTick(rub: number): string {
  if (rub >= 1_000_000) return `${(rub / 1_000_000).toFixed(1).replace('.', ',')}M`;
  return `${Math.round(rub / 1000)}k`;
}

function UnifiedChartSvg({ geometry }: { geometry: PageGeometry }) {
  return (
    <svg
      viewBox={`0 0 ${geometry.viewW} ${geometry.viewH}`}
      className="block w-full"
      style={{ height: CALC_CHART_HEIGHT }}
      preserveAspectRatio="none"
      aria-hidden
    >
      {geometry.bars.map((b) => (
        <g key={b.label}>
          <rect
            x={b.loss.x}
            y={b.loss.y}
            width={b.loss.w}
            height={b.loss.h}
            fill="var(--color-danger-base)"
            rx={2}
          />
          <rect
            x={b.past.x}
            y={b.past.y}
            width={b.past.w}
            height={b.past.h}
            fill="var(--color-text-muted)"
            fillOpacity={0.55}
            rx={2}
          />
          <rect
            x={b.forecast.x}
            y={b.forecast.y}
            width={b.forecast.w}
            height={b.forecast.h}
            fill="var(--color-brand-primary)"
            rx={2}
          />
        </g>
      ))}
      <line
        x1={0}
        y1={geometry.zeroY}
        x2={geometry.viewW}
        y2={geometry.zeroY}
        stroke="var(--color-border-base)"
        strokeWidth={1}
      />
    </svg>
  );
}

export const DamiatCalculatorHarvestChart: React.FC<DamiatCalculatorHarvestChartProps> = ({
  series,
  scenarioWithout,
  scenarioWith,
  withGenerator,
  volumeTons,
  salesTonsByMonth,
  opexRubByMonth,
  onSalesCellChange,
  onSalesCellCommit,
  onOpexCellChange,
  scheduleValidation,
  className,
}) => {
  const salesOverflowTons = scheduleValidation?.salesOverflowTons ?? 0;
  const [page, setPage] = useState(0);

  const monthCount = series?.labels.length ?? 0;
  const pageCount = Math.max(1, Math.ceil(monthCount / DYNAMICS_MONTHS_PER_PAGE));

  useEffect(() => {
    setPage(0);
  }, [series, scenarioWithout, scenarioWith]);

  useEffect(() => {
    if (page > pageCount - 1) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  const sliceStart = page * DYNAMICS_MONTHS_PER_PAGE;
  const sliceEnd = Math.min(sliceStart + DYNAMICS_MONTHS_PER_PAGE, monthCount);

  const pageSeries = useMemo(
    () => (series && monthCount > 0 ? sliceSeries(series, sliceStart, sliceEnd) : null),
    [series, sliceStart, sliceEnd, monthCount],
  );

  const activeScenario = useMemo(
    () => (withGenerator ? scenarioWith : scenarioWithout) ?? null,
    [withGenerator, scenarioWith, scenarioWithout],
  );

  const pageMonths = useMemo(
    () => activeScenario?.months.slice(sliceStart, sliceEnd) ?? [],
    [activeScenario, sliceStart, sliceEnd],
  );

  const pageTabLabels = useMemo(
    () => (series?.labels ? buildDynamicsPageTabLabels(series.labels) : []),
    [series?.labels],
  );

  const activePageTabLabel = pageTabLabels[page] ?? '';

  /** Шкалы Y — только при смене расчёта (series), не при переключении таба */
  const axisScale = useMemo(() => (series ? buildAxisScale(series) : null), [series]);

  const geometry = useMemo(
    () => (pageSeries && axisScale ? buildPageGeometry(pageSeries, axisScale, withGenerator) : null),
    [pageSeries, axisScale, withGenerator],
  );

  const lossLegend = withGenerator ? 'с DAMIAT' : 'без DAMIAT';

  const coreRows: RowDef[] = useMemo(
    () => [
      {
        key: 'price',
        label: 'Цена ₽/т',
        labelTitle: 'Прогноз продаж за месяц. На графике шкала цены — ₽/кг.',
        format: (m) =>
          m.priceForecast >= 1000
            ? `${Math.round(m.priceForecast / 1000)}k`
            : String(Math.round(m.priceForecast)),
      },
      {
        key: 'loss',
        label: 'Потери мес.',
        labelTitle: `Потери за месяц, сценарий ${lossLegend}`,
        format: (m) => `${formatTonsCompact(m.lossTons)} · ${formatRubCompact(m.lossRub)}`,
        tone: 'loss',
        stackedCell: true,
      },
      {
        key: 'cum-r',
        label: 'Σ потерь ₽',
        labelTitle: 'Накопительные потери в ₽ с начала сезона (не сумма столбцов на экране)',
        format: (m) => formatRubCompact(m.cumLossRub),
        tone: 'loss',
      },
    ],
    [lossLegend],
  );

  const detailRows: RowDef[] = useMemo(
    () => [
      {
        key: 'cum-t',
        label: 'Σ потерь т',
        labelTitle: 'Накопительные потери в тоннах с начала сезона',
        format: (m) => formatTonsCompact(m.cumLossTons),
        tone: 'loss',
      },
    ],
    [],
  );

  const resultRow: RowDef = useMemo(
    () => ({
      key: 'result',
      label: 'Итог мес.',
      labelTitle: 'Выручка от продаж − потери − расходы на хранение и DAMIAT',
      format: (m) => formatRubCompact(Math.max(0, m.monthResult)),
      tone: 'result',
    }),
    [],
  );

  const scheduleRows: RowDef[] = useMemo(
    () => [
      {
        key: 'sales',
        label: 'Продажи, т',
        labelTitle: 'Плановые продажи урожая за месяц (один план для обоих сценариев)',
        format: () => '',
        editable: 'sales',
      },
      {
        key: 'opex',
        label: 'Расходы, ₽',
        labelTitle: 'Операционные расходы: хранение, логистика и прочее',
        format: () => '',
        editable: 'opex',
      },
      {
        key: 'stock',
        label: 'Остаток, т',
        labelTitle: `Остаток на конец месяца, сценарий ${lossLegend}`,
        format: (m) => formatTonsCompact(Math.max(0, m.stockEnd)),
        tone: 'stock',
      },
    ],
    [lossLegend],
  );

  const visibleRows = useMemo(
    () => [...coreRows, ...detailRows, ...scheduleRows, resultRow],
    [coreRows, detailRows, scheduleRows, resultRow],
  );

  const hasData =
    pageSeries &&
    geometry &&
    pageMonths.length > 0 &&
    scenarioWithout &&
    scenarioWith &&
    activeScenario;
  const monthColCount = geometry?.bars.length ?? 0;

  const gridMonthCols =
    monthColCount > 0
      ? `repeat(${monthColCount}, minmax(0, 1fr))`
      : '';
  const gridCols = monthColCount > 0 ? `${CALC_LABEL_COL_WIDTH}px ${gridMonthCols}` : `${CALC_LABEL_COL_WIDTH}px`;

  const metricRowHeights = visibleRows.map((row) => `${metricRowHeight(row)}px`).join(' ');

  return (
    <div
      className={cn(
        'w-full min-w-0 overflow-hidden text-style-body',
        className,
      )}
    >
      {salesOverflowTons > 0 ? (
        <div
          role="alert"
          className="mb-[var(--space-section-content-m)] rounded-[var(--radius-medium)] border border-[var(--color-warning-base)] bg-[color-mix(in_srgb,var(--color-warning-hover-bg)_75%,var(--color-surface-1))] px-[var(--space-inset-m)] py-[var(--space-10)] text-style-body-sm text-[var(--color-text-primary)]"
        >
          План продаж превышает объём урожая на{' '}
          <span className="font-semibold tabular-nums">{formatTons(salesOverflowTons)}</span>.
          Уменьшите продажи по месяцам или нажмите «Распределить продажи» в форме слева.
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-[var(--space-section-stack-m)] pb-[var(--space-section-content-m)]">
        <div className="flex min-w-0 flex-col gap-[var(--space-8)]">
          <div className="flex min-w-0 flex-wrap items-center gap-[var(--space-12)]">
            <h3 className="m-0 shrink-0 text-style-h4 text-[var(--color-text-primary)]">Динамика по месяцам</h3>
            {hasData && pageTabLabels.length > 1 ? (
              <Tabs
                value={String(page)}
                onValueChange={(v) => setPage(Number(v))}
                size="md"
                appearance="brand"
              >
                <TabList className="flex flex-wrap gap-[var(--space-4)]">
                  {pageTabLabels.map((label, i) => (
                    <Tab
                      key={label}
                      value={String(i)}
                      showLeftIcon={false}
                      showRightIcon={false}
                      showBadge={false}
                    >
                      {label}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            ) : null}
          </div>
          {hasData ? (
            <span
              className={cn(
                'text-style-caption font-medium leading-snug',
                withGenerator
                  ? 'text-[var(--color-brand-primary)]'
                  : 'text-[var(--color-danger-base)]',
              )}
            >
              {withGenerator ? 'Сценарий хранения с DAMIAT' : 'Сценарий убытков без DAMIAT'}
            </span>
          ) : null}
        </div>
        {hasData ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-[var(--space-10)] gap-y-[var(--space-6)] text-style-body-sm text-[var(--color-text-secondary)]">
            {LEGEND.map((item) => (
              <span key={item.key} className="flex items-center gap-[var(--space-4)] whitespace-nowrap">
                <span
                  className="inline-block rounded-[var(--radius-2)]"
                  style={{
                    width: CALC_LEGEND_SWATCH_SIZE,
                    height: CALC_LEGEND_SWATCH_SIZE,
                    background: item.fill,
                    opacity: 1,
                  }}
                  aria-hidden
                />
                {item.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center py-[var(--space-section-content-l)] text-style-body text-[var(--color-text-muted)]">
          Укажите площадь и урожайность
        </div>
      ) : (
        <div className="pt-[var(--space-section-content-m)]">
          <div
            className="grid w-full min-w-0 gap-x-0"
            style={{
              gridTemplateColumns: gridCols,
              gridTemplateRows: `${CALC_CHART_HEIGHT}px ${CALC_MONTH_ROW_HEIGHT}px ${metricRowHeights}`,
            }}
            role="grid"
            aria-label={`Динамика: ${activePageTabLabel}`}
          >
            {/* Шкала Y + подписи таблицы — один столбец */}
            <div
              className="relative shrink-0 overflow-hidden border-r border-b border-[var(--color-border-base)] pr-[var(--space-4)]"
              style={{ gridRow: 1, gridColumn: 1, height: CALC_CHART_HEIGHT, minHeight: CALC_CHART_HEIGHT, maxHeight: CALC_CHART_HEIGHT }}
            >
              <div className="relative h-full w-full">
                {geometry.priceTicks.map((kg) => (
                  <span
                    key={`pk-${kg}`}
                    className="absolute right-0 whitespace-nowrap text-style-body-sm text-[var(--color-text-muted)]"
                    style={{ top: geometry.yPriceKg(kg) - CALC_AXIS_LABEL_OFFSET, fontSize: CALC_AXIS_FONT_SIZE }}
                  >
                    {kg.toFixed(0).replace('.', ',')}
                  </span>
                ))}
                {geometry.lossTicks.slice(1).map((rub) => (
                  <span
                    key={`lk-${rub}`}
                    className="absolute right-0 whitespace-nowrap text-style-body-sm text-[var(--color-danger-base)]"
                    style={{
                      top: geometry.zeroY + geometry.hLossRub(rub) - CALC_AXIS_LABEL_OFFSET,
                      fontSize: CALC_AXIS_FONT_SIZE,
                    }}
                  >
                    {formatLossTick(rub)}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="min-w-0 overflow-hidden border-b border-[var(--color-border-base)]"
              style={{
                gridRow: 1,
                gridColumn: `2 / span ${monthColCount}`,
                height: CALC_CHART_HEIGHT,
                minHeight: CALC_CHART_HEIGHT,
                maxHeight: CALC_CHART_HEIGHT,
              }}
            >
              <UnifiedChartSvg geometry={geometry} />
            </div>

            {/* Месяцы — под графиком, в колонках с данными */}
            <div
              aria-hidden
              className="border-r border-[var(--color-border-base)]"
              style={{
                gridRow: 2,
                gridColumn: 1,
                height: CALC_MONTH_ROW_HEIGHT,
                minHeight: CALC_MONTH_ROW_HEIGHT,
                maxHeight: CALC_MONTH_ROW_HEIGHT,
              }}
            />
            {geometry.bars.map((b, i) => (
              <div
                key={`hdr-${b.label}`}
                className={cn(
                  'flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap px-[var(--space-2)] text-style-caption font-semibold leading-none text-[var(--color-text-primary)]',
                  i < monthColCount - 1 && 'border-r border-[var(--color-border-base)]',
                )}
                style={{
                  gridRow: 2,
                  gridColumn: i + 2,
                  height: CALC_MONTH_ROW_HEIGHT,
                  minHeight: CALC_MONTH_ROW_HEIGHT,
                  maxHeight: CALC_MONTH_ROW_HEIGHT,
                }}
              >
                {b.label}
              </div>
            ))}

            {/* Метрики */}
            {visibleRows.map((row, rowIndex) => {
              const rowHeight = metricRowHeight(row);
              return (
              <React.Fragment key={row.key}>
                <div
                  className="flex items-center whitespace-nowrap border-t border-r border-[var(--color-border-base)] pl-[var(--space-4)] pr-[var(--space-6)] text-style-body-sm font-medium leading-none text-[var(--color-text-secondary)]"
                  style={{
                    gridRow: rowIndex + 3,
                    gridColumn: 1,
                    height: rowHeight,
                    minHeight: rowHeight,
                    maxHeight: rowHeight,
                  }}
                  title={row.labelTitle}
                >
                  {row.label}
                </div>
                {pageMonths.map((m, i) => {
                  const globalMonthIndex = sliceStart + i;
                  return (
                  <div
                    key={`${row.key}-${m.label}`}
                    className={cn(
                      'text-style-tabular flex min-w-0 items-center justify-center overflow-hidden border-t border-[var(--color-border-base)] px-[var(--space-1)] text-center text-style-body-sm leading-none',
                      i < monthColCount - 1 && 'border-r border-[var(--color-border-base)]',
                      row.tone === 'loss' && 'text-[var(--color-danger-base)]',
                      row.tone === 'result' && 'font-semibold text-[var(--color-brand-primary)]',
                      row.tone === 'stock' && 'text-[var(--color-text-primary)]',
                      !row.tone && !row.editable && 'text-[var(--color-text-primary)]',
                    )}
                    style={{
                      gridRow: rowIndex + 3,
                      gridColumn: i + 2,
                      height: rowHeight,
                      minHeight: rowHeight,
                      maxHeight: rowHeight,
                    }}
                    title={row.editable ? undefined : row.format(m)}
                  >
                    {row.editable === 'sales' ? (
                      <DamiatCalculatorScheduleCell
                        kind="sales"
                        monthIndex={globalMonthIndex}
                        value={salesTonsByMonth[globalMonthIndex] ?? ''}
                        onChange={onSalesCellChange}
                        onCommit={onSalesCellCommit}
                      />
                    ) : row.editable === 'opex' ? (
                      <DamiatCalculatorScheduleCell
                        kind="opex"
                        monthIndex={globalMonthIndex}
                        value={opexRubByMonth[globalMonthIndex] ?? '0'}
                        onChange={onOpexCellChange}
                      />
                    ) : row.stackedCell ? (
                      <div className="flex flex-col items-center justify-center gap-[var(--space-2)] leading-tight">
                        <span>{formatTonsCompact(m.lossTons)}</span>
                        <span className="text-style-caption font-normal">{formatRubCompact(m.lossRub)}</span>
                      </div>
                    ) : (
                      row.format(m)
                    )}
                  </div>
                );
                })}
              </React.Fragment>
            );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

DamiatCalculatorHarvestChart.displayName = 'DamiatCalculatorHarvestChart';
