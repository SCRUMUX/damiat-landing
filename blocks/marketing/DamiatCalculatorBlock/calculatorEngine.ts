import type { CalculatorCropData } from './calculatorCropsData';
import { CALCULATOR_MONTHS, monthLabelsFromHarvest } from './calculatorCropsData';
import {
  buildScheduleInput,
  type CalculatorScheduleInput,
  type ScheduleValidation,
  validateSchedule,
} from './calculatorSchedule';
import {
  DOC_MASS_DELTA_FRACTION,
  DEVICE_TONS_CAPACITY,
  ETHYLENE_COST_PER_TON_RUB,
  STORAGE_MONTHS,
  TARGET_LOSS_FRACTION_WITHOUT,
  TARGET_LOSS_FRACTION_WITH,
} from './calculatorConfig';

export interface MonthRow {
  label: string;
  priceForecast: number;
  priceLastYear: number;
  lossTons: number;
  lossRub: number;
  cumLossTons: number;
  cumLossRub: number;
  stockStart: number;
  plannedSalesTons: number;
  soldTons: number;
  soldRub: number;
  stockEnd: number;
  opexRub: number;
  /** @deprecated Используйте soldRub */
  marketValue: number;
  monthResult: number;
}

export interface ScenarioBreakdown {
  labels: string[];
  priceLastYear: number[];
  priceForecast: number[];
  months: MonthRow[];
  totalLossRub: number;
  totalLossTons: number;
  totalSoldTons: number;
  totalSoldRub: number;
  totalOpexRub: number;
  totalProfit: number;
  finalStock: number;
}

export interface CalculatorResult {
  volumeTons: number;
  deviceCount: number;
  deviceCostTotal: number;
  deviceCostPerMonth: number;
  without: ScenarioBreakdown;
  with: ScenarioBreakdown;
  schedule: CalculatorScheduleInput;
  scheduleValidation: ScheduleValidation;
  lossSavings: number;
  /** Чистый эффект: totalProfitWith − totalProfitWithout */
  netBenefit: number;
  profitDelta: number;
  totalProfitWithout: number;
  totalProfitWith: number;
  /** Упрощённая оценка по документу: объём × 8% × средняя цена реализации */
  docGrossEffect: number;
  docNetEffect: number;
  docSavedMassTons: number;
  avgRealizationPricePerTon: number;
}

export interface ChartSeriesData {
  labels: string[];
  /** ₽/т */
  priceLastYear: number[];
  priceForecast: number[];
  lossRubWithout: number[];
  lossRubWith: number[];
}

function monthIndex(calendarMonth: number) {
  return calendarMonth - 1;
}

export function pricesFromHarvest(
  monthly: number[],
  harvestMonth: number,
  count = CALCULATOR_MONTHS,
): number[] {
  const start = monthIndex(harvestMonth);
  const out: number[] = [];
  for (let m = 0; m < count; m++) {
    out.push(monthly[(start + m) % 12]);
  }
  return out;
}

export function applyPriceAdjust(base: number[], percent: number): number[] {
  const factor = 1 + percent / 100;
  return base.map((p) => Math.round(p * factor));
}

export function parseManualBasePrice(value: string): number | undefined {
  const n = Number(String(value).replace(/\s/g, '').replace(',', '.'));
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return n;
}

/** База сентября, ₽/т — из оптового ряда хранения или legacy-кривой. */
export function defaultSeptemberPricePerTon(crop: CalculatorCropData): number {
  return basePriceCurve(crop)[0] ?? 0;
}

function basePriceCurve(crop: CalculatorCropData): number[] {
  if (crop.priceStorageForecast?.length === CALCULATOR_MONTHS) {
    return [...crop.priceStorageForecast];
  }
  return pricesFromHarvest(crop.priceMonthlyCurrent, crop.harvestMonth);
}

function basePricePastCurve(crop: CalculatorCropData): number[] {
  if (crop.priceStoragePast?.length === CALCULATOR_MONTHS) {
    return [...crop.priceStoragePast];
  }
  return pricesFromHarvest(crop.priceMonthlyPast, crop.harvestMonth);
}

/** Прогноз: опт по сезону хранения, опционально масштаб по базе сентября, затем ±%. */
export function buildPriceForecast(
  crop: CalculatorCropData,
  priceAdjustPercent: number,
  manualBasePricePerTon?: number,
): number[] {
  const baseCurve = basePriceCurve(crop);
  let curve = baseCurve;
  if (manualBasePricePerTon != null && manualBasePricePerTon > 0 && baseCurve[0] > 0) {
    const scale = manualBasePricePerTon / baseCurve[0];
    curve = baseCurve.map((p) => Math.round(p * scale));
  }
  return applyPriceAdjust(curve, priceAdjustPercent);
}

/** Прошлый год (опт 2026): без масштаба по ручной базе — только ±% корректировка. */
export function buildPricePast(crop: CalculatorCropData, priceAdjustPercent: number): number[] {
  return applyPriceAdjust(basePricePastCurve(crop), priceAdjustPercent);
}

export function totalTonsFromFields(hectares: number, yieldTonsPerHa: number): number {
  return Math.max(0, hectares * yieldTonsPerHa);
}

export function countDevices(volumeTons: number): number {
  if (volumeTons <= 0) return 0;
  return Math.ceil(volumeTons / DEVICE_TONS_CAPACITY);
}

/** Затраты на этилен/КГС за период хранения (модель из анализа потерь). */
export function deviceCostTotal(volumeTons: number): number {
  if (volumeTons <= 0) return 0;
  return volumeTons * ETHYLENE_COST_PER_TON_RUB;
}

export function averageRealizationPricePerTon(priceForecastPerTon: number[]): number {
  if (!priceForecastPerTon.length) return 0;
  return priceForecastPerTon.reduce((a, b) => a + b, 0) / priceForecastPerTon.length;
}

/** Упрощённый эффект как в документе: V × Δ% × средняя цена − затраты на этилен. */
export function computeDocStyleEffect(
  volumeTons: number,
  avgPricePerTon: number,
): { savedMassTons: number; grossRub: number; netRub: number; operatingCostRub: number } {
  const savedMassTons = volumeTons * DOC_MASS_DELTA_FRACTION;
  const grossRub = savedMassTons * avgPricePerTon;
  const operatingCostRub = deviceCostTotal(volumeTons);
  return {
    savedMassTons,
    grossRub,
    netRub: grossRub - operatingCostRub,
    operatingCostRub,
  };
}

/** Симуляция доли потерь массы от урожая при заданном плане продаж (без цен). */
export function simulateLossFraction(
  volumeTons: number,
  spoilageRates: number[],
  plannedSales: readonly number[],
): number {
  if (volumeTons <= 0) return 0;
  let stock = volumeTons;
  let totalLossTons = 0;
  for (let m = 0; m < CALCULATOR_MONTHS; m++) {
    const stockStart = stock;
    const rate = Math.min(0.999, Math.max(0, spoilageRates[m] ?? 0));
    const lossTons = stockStart * rate;
    const afterLoss = stockStart - lossTons;
    const planned = plannedSales[m] ?? 0;
    const soldTons = Math.min(Math.max(0, planned), Math.max(0, afterLoss));
    totalLossTons += lossTons;
    stock = Math.max(0, afterLoss - soldTons);
  }
  return totalLossTons / volumeTons;
}

/**
 * Масштабирует базовые ставки порчи, чтобы totalLossTons/volume ≈ targetFraction
 * при текущем плане реализации.
 */
export function calibrateSpoilageRates(
  baseRates: readonly number[],
  targetFraction: number,
  volumeTons: number,
  plannedSales: readonly number[],
): number[] {
  if (volumeTons <= 0 || targetFraction <= 0) {
    return baseRates.map(() => 0);
  }

  const scaleRates = (scale: number) =>
    baseRates.map((r) => Math.min(0.999, Math.max(0, r * scale)));

  let lo = 0;
  let hi = 1;
  while (simulateLossFraction(volumeTons, scaleRates(hi), plannedSales) < targetFraction && hi < 512) {
    hi *= 2;
  }

  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    const frac = simulateLossFraction(volumeTons, scaleRates(mid), plannedSales);
    if (frac < targetFraction) lo = mid;
    else hi = mid;
  }

  return scaleRates((lo + hi) / 2);
}

function buildScenario(
  crop: CalculatorCropData,
  volumeTons: number,
  spoilageRates: number[],
  priceForecast: number[],
  priceLastYear: number[],
  deviceCostPerMonth: number,
  schedule: CalculatorScheduleInput,
): ScenarioBreakdown {
  const labels = monthLabelsFromHarvest(crop.harvestMonth);
  const months: MonthRow[] = [];
  let stock = volumeTons;
  let cumLossTons = 0;
  let cumLossRub = 0;
  let totalProfit = 0;
  let totalSoldTons = 0;
  let totalSoldRub = 0;
  let totalOpexRub = 0;

  for (let m = 0; m < CALCULATOR_MONTHS; m++) {
    const stockStart = stock;
    const lossTons = stockStart * spoilageRates[m];
    const afterLoss = stockStart - lossTons;
    const planned = schedule.plannedSalesTons[m] ?? 0;
    const soldTons = Math.min(Math.max(0, planned), Math.max(0, afterLoss));
    const stockEnd = afterLoss - soldTons;
    const soldRub = soldTons * priceForecast[m];
    const lossRub = lossTons * priceForecast[m];
    const opexRub = schedule.opexRub[m] ?? 0;
    cumLossTons += lossTons;
    cumLossRub += lossRub;
    totalSoldTons += soldTons;
    totalSoldRub += soldRub;
    totalOpexRub += opexRub;
    const monthResult = soldRub - lossRub - deviceCostPerMonth - opexRub;
    totalProfit += monthResult;
    stock = Math.max(0, stockEnd);

    months.push({
      label: labels[m],
      priceForecast: priceForecast[m],
      priceLastYear: priceLastYear[m],
      lossTons,
      lossRub,
      cumLossTons,
      cumLossRub,
      stockStart,
      plannedSalesTons: planned,
      soldTons,
      soldRub,
      stockEnd: Math.max(0, stockEnd),
      opexRub,
      marketValue: soldRub,
      monthResult,
    });
  }

  return {
    labels,
    priceLastYear,
    priceForecast,
    months,
    totalLossRub: cumLossRub,
    totalLossTons: cumLossTons,
    totalSoldTons,
    totalSoldRub,
    totalOpexRub,
    totalProfit,
    finalStock: stock,
  };
}

export function computeFullResult(
  crop: CalculatorCropData,
  volumeTons: number,
  priceAdjustPercent = 0,
  manualBasePricePerTon?: number,
  salesTonsByMonth: string[] = [],
  opexRubByMonth: string[] = [],
): CalculatorResult | null {
  if (volumeTons <= 0) return null;

  const schedule = buildScheduleInput(salesTonsByMonth, opexRubByMonth, volumeTons);
  const scheduleValidation = validateSchedule(schedule.plannedSalesTons, volumeTons);

  const priceLastYear = buildPricePast(crop, priceAdjustPercent);
  const priceForecast = buildPriceForecast(crop, priceAdjustPercent, manualBasePricePerTon);

  const deviceCount = countDevices(volumeTons);
  const costTotal = deviceCostTotal(volumeTons);
  const costPerMonthWith = volumeTons > 0 ? costTotal / STORAGE_MONTHS : 0;

  const plannedSales = schedule.plannedSalesTons;
  const spoilageWithout = calibrateSpoilageRates(
    crop.spoilageRateWithout,
    TARGET_LOSS_FRACTION_WITHOUT,
    volumeTons,
    plannedSales,
  );
  const spoilageWith = calibrateSpoilageRates(
    crop.spoilageRateWith,
    TARGET_LOSS_FRACTION_WITH,
    volumeTons,
    plannedSales,
  );

  const without = buildScenario(
    crop,
    volumeTons,
    spoilageWithout,
    priceForecast,
    priceLastYear,
    0,
    schedule,
  );

  const withScenario = buildScenario(
    crop,
    volumeTons,
    spoilageWith,
    priceForecast,
    priceLastYear,
    costPerMonthWith,
    schedule,
  );

  const lossSavings = without.totalLossRub - withScenario.totalLossRub;
  const profitDelta = withScenario.totalProfit - without.totalProfit;
  const netBenefit = profitDelta;
  const avgRealizationPricePerTon = averageRealizationPricePerTon(priceForecast);
  const doc = computeDocStyleEffect(volumeTons, avgRealizationPricePerTon);

  return {
    volumeTons,
    deviceCount,
    deviceCostTotal: costTotal,
    deviceCostPerMonth: costPerMonthWith,
    without,
    with: withScenario,
    schedule,
    scheduleValidation,
    lossSavings,
    netBenefit,
    profitDelta,
    totalProfitWithout: without.totalProfit,
    totalProfitWith: withScenario.totalProfit,
    docGrossEffect: doc.grossRub,
    docNetEffect: doc.netRub,
    docSavedMassTons: doc.savedMassTons,
    avgRealizationPricePerTon,
  };
}

/** Столбчатый график: цены + потери без/с DAMIAT */
export function getComparisonChartSeries(result: CalculatorResult): ChartSeriesData {
  const base = result.without;
  return {
    labels: base.labels,
    priceLastYear: base.priceLastYear,
    priceForecast: base.priceForecast,
    lossRubWithout: result.without.months.map((m) => m.lossRub),
    lossRubWith: result.with.months.map((m) => m.lossRub),
  };
}

/** Для совместимости; график всегда использует getComparisonChartSeries */
export function getChartSeries(result: CalculatorResult, withGenerator: boolean): ChartSeriesData {
  const comparison = getComparisonChartSeries(result);
  if (!withGenerator) return comparison;
  return comparison;
}

export function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatRubCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace('.', ',')} млн ₽`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} тыс. ₽`;
  }
  return formatRub(value);
}

export function formatTons(value: number): string {
  if (value >= 1_000) {
    return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} т`;
  }
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} т`;
}

/** Средняя прогнозная цена за период хранения, ₽/кг */
export function averagePricePerKg(priceForecastPerTon: number[]): string {
  if (!priceForecastPerTon.length) return '—';
  const avg = priceForecastPerTon.reduce((a, b) => a + b, 0) / priceForecastPerTon.length;
  return `${(avg / 1000).toFixed(1).replace('.', ',')} ₽/кг`;
}

/** Средняя прогнозная цена за период хранения (12 мес.), ₽/т */
export function averagePricePerTon(priceForecastPerTon: number[]): string {
  if (!priceForecastPerTon.length) return '—';
  const avg = priceForecastPerTon.reduce((a, b) => a + b, 0) / priceForecastPerTon.length;
  return `${Math.round(avg).toLocaleString('ru-RU')} ₽/т`;
}

export function formatTonsCompact(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace('.', ',')} тыс. т`;
  }
  return `${value.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} т`;
}
