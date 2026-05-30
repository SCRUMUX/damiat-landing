import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import {
  BLOCK_CALCULATOR_AMBIENT_CLASS,
  BLOCK_CALCULATOR_GRID_CLASS,
  BLOCK_CALCULATOR_WORKSPACE_CLASS,
} from '../../_shared/blockLayout';
import { POTATO_CROP } from './calculatorCropsData';
import {
  computeFullResult,
  formatRubCompact,
  formatTons,
  getComparisonChartSeries,
  parseManualBasePrice,
  totalTonsFromFields,
} from './calculatorEngine';
import {
  buildUniformSalesStrings,
  emptyOpexStrings,
  ensureScheduleStrings,
  redistributeSalesFromMonth,
} from './calculatorSchedule';
import { STORAGE_MONTHS } from './calculatorConfig';
import { DamiatCalculatorForm } from './DamiatCalculatorForm';
import { DamiatCalculatorHarvestChart } from './DamiatCalculatorHarvestChart';
import { DamiatCalculatorSummary } from './DamiatCalculatorSummary';
import type {
  DamiatCalculatorBlockProps,
  DamiatCalculatorFormValues,
  DamiatCalculatorSummaryData,
} from './DamiatCalculatorBlock.types';

export type {
  DamiatCalculatorBlockProps,
  DamiatCalculatorFormValues,
  DamiatCalculatorSummaryData,
} from './DamiatCalculatorBlock.types';

const INITIAL_VALUES: DamiatCalculatorFormValues = {
  hectares: '',
  yieldTonsPerHa: String(POTATO_CROP.defaultYieldTonsPerHa),
  device1: true,
  manualBasePricePerTon: '',
  priceAdjustPercent: 0,
  salesTonsByMonth: [],
  opexRubByMonth: emptyOpexStrings(),
  salesPlanMode: 'uniform',
};

function buildSummaryData(
  result: NonNullable<ReturnType<typeof computeFullResult>>,
): DamiatCalculatorSummaryData {
  const { without, with: withScenario } = result;
  const savedMassTons = without.totalLossTons - withScenario.totalLossTons;

  return {
    moneyRub: formatRubCompact(Math.max(0, result.netBenefit)),
    massTons: formatTons(Math.max(0, savedMassTons)),
    deviceCostRub: formatRubCompact(result.deviceCostTotal),
    deviceCostHint: `${result.volumeTons.toLocaleString('ru-RU')} т × 250 ₽/т`,
  };
}

function CalculatorAmbientLayer() {
  return (
    <div className={BLOCK_CALCULATOR_AMBIENT_CLASS} aria-hidden>
      <div
        className="absolute -left-[18%] top-[8%] h-[min(420px,52vw)] w-[min(420px,52vw)] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-brand-muted) 70%, transparent) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -right-[12%] bottom-[0%] h-[min(360px,48vw)] w-[min(360px,48vw)] rounded-full opacity-45 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-success-subtle) 65%, transparent) 0%, transparent 72%)',
        }}
      />
      <div
        className="absolute left-[35%] top-[55%] h-[min(280px,40vw)] w-[min(280px,40vw)] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-brand-primary) 35%, transparent) 0%, transparent 68%)',
        }}
      />
    </div>
  );
}

export const DamiatCalculatorBlock: React.FC<DamiatCalculatorBlockProps> = ({
  title = 'Рассчитайте стоимость урожая и выгоду от хранения',
  subtitle,
  devicesTitle,
  recommendationsHref = '#scenarios',
  recommendationsLabel = 'Перейти в рекомендации',
  defaultValues,
  className,
}) => {
  const [values, setValues] = useState<DamiatCalculatorFormValues>(() => ({
    ...INITIAL_VALUES,
    ...defaultValues,
    salesTonsByMonth: defaultValues?.salesTonsByMonth ?? INITIAL_VALUES.salesTonsByMonth,
    opexRubByMonth: defaultValues?.opexRubByMonth ?? INITIAL_VALUES.opexRubByMonth,
    salesPlanMode: defaultValues?.salesPlanMode ?? INITIAL_VALUES.salesPlanMode,
  }));

  const volumeTons = useMemo(() => {
    const ha = Number(values.hectares) || 0;
    const y = Number(values.yieldTonsPerHa) || 0;
    return totalTonsFromFields(ha, y);
  }, [values.hectares, values.yieldTonsPerHa]);

  useEffect(() => {
    if (volumeTons <= 0) return;
    setValues((v) => {
      if (v.salesPlanMode === 'uniform') {
        const next = ensureScheduleStrings(v.salesTonsByMonth, v.opexRubByMonth, volumeTons, 'uniform');
        return { ...v, ...next };
      }
      const opex =
        v.opexRubByMonth?.length === STORAGE_MONTHS ? v.opexRubByMonth : emptyOpexStrings();
      const sales =
        v.salesTonsByMonth?.length === STORAGE_MONTHS
          ? v.salesTonsByMonth
          : buildUniformSalesStrings(volumeTons);
      return { ...v, salesTonsByMonth: sales, opexRubByMonth: opex };
    });
  }, [volumeTons]);

  const manualBase = useMemo(
    () => parseManualBasePrice(values.manualBasePricePerTon),
    [values.manualBasePricePerTon],
  );

  const result = useMemo(() => {
    if (volumeTons <= 0) return null;
    return computeFullResult(
      POTATO_CROP,
      volumeTons,
      values.priceAdjustPercent,
      manualBase,
      values.salesTonsByMonth,
      values.opexRubByMonth,
    );
  }, [volumeTons, values.priceAdjustPercent, manualBase, values.salesTonsByMonth, values.opexRubByMonth]);

  const chartSeries = useMemo(
    () => (result ? getComparisonChartSeries(result) : null),
    [result],
  );

  const summaryData = useMemo(() => (result ? buildSummaryData(result) : null), [result]);

  const onSalesCellChange = useCallback((monthIndex: number, raw: string) => {
    setValues((v) => {
      const sales = [...(v.salesTonsByMonth.length === STORAGE_MONTHS ? v.salesTonsByMonth : buildUniformSalesStrings(volumeTons))];
      sales[monthIndex] = raw;
      return { ...v, salesTonsByMonth: sales, salesPlanMode: 'custom' };
    });
  }, [volumeTons]);

  const onSalesCellCommit = useCallback(
    (monthIndex: number, raw: string) => {
      if (volumeTons <= 0) return;
      setValues((v) => {
        const sales = [...(v.salesTonsByMonth.length === STORAGE_MONTHS ? v.salesTonsByMonth : buildUniformSalesStrings(volumeTons))];
        sales[monthIndex] = raw;
        return {
          ...v,
          salesTonsByMonth: redistributeSalesFromMonth(volumeTons, sales, monthIndex),
          salesPlanMode: 'custom',
        };
      });
    },
    [volumeTons],
  );

  const onOpexCellChange = useCallback((monthIndex: number, raw: string) => {
    setValues((v) => {
      const opex = [...(v.opexRubByMonth.length === STORAGE_MONTHS ? v.opexRubByMonth : emptyOpexStrings())];
      opex[monthIndex] = raw;
      return { ...v, opexRubByMonth: opex };
    });
  }, []);

  const onResetUniformSales = useCallback(() => {
    if (volumeTons <= 0) return;
    setValues((v) => ({
      ...v,
      salesTonsByMonth: buildUniformSalesStrings(volumeTons),
      salesPlanMode: 'uniform',
    }));
  }, [volumeTons]);

  return (
    <SectionShell recipe="section.calculator" appearance="base" className={className} aria-label="DAMIAT calculator">
      <BlockSectionHeader title={title} subtitle={subtitle} />

      <div className="relative w-full min-w-0">
        <CalculatorAmbientLayer />

        <div className={BLOCK_CALCULATOR_WORKSPACE_CLASS}>
          <div className={BLOCK_CALCULATOR_GRID_CLASS}>
            <DamiatCalculatorForm
              values={values}
              onValuesChange={setValues}
              devicesTitle={devicesTitle}
              onDeviceChange={(device1) => setValues((v) => ({ ...v, device1 }))}
              recommendationsHref={recommendationsHref}
              recommendationsLabel={recommendationsLabel}
            />

            <div className="flex min-w-0 flex-col gap-[var(--space-section-stack-m)]">
              <DamiatCalculatorHarvestChart
                series={chartSeries}
                scenarioWithout={result?.without ?? null}
                scenarioWith={result?.with ?? null}
                withGenerator={values.device1}
                volumeTons={volumeTons}
                salesTonsByMonth={values.salesTonsByMonth}
                opexRubByMonth={values.opexRubByMonth}
                onSalesCellChange={onSalesCellChange}
                onSalesCellCommit={onSalesCellCommit}
                onOpexCellChange={onOpexCellChange}
                onResetUniformSales={onResetUniformSales}
              />

              <DamiatCalculatorSummary
                data={summaryData}
                device1={values.device1}
                hasVolume={volumeTons > 0}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

DamiatCalculatorBlock.displayName = 'DamiatCalculatorBlock';
