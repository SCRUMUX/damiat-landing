/** Mock-справочник (картофель — основная культура). */

import { STORAGE_MONTHS, TARGET_LOSS_FRACTION_WITHOUT, TARGET_LOSS_FRACTION_WITH } from './calculatorConfig';

export interface CalculatorCropData {
  label: string;
  harvestMonth: number;
  defaultYieldTonsPerHa: number;
  priceMonthlyPast: number[];
  priceMonthlyCurrent: number[];
  /** Оптовая цена ₽/т по месяцам хранения (сент → август), если задано — приоритет над priceMonthly* */
  priceStorageForecast?: number[];
  priceStoragePast?: number[];
  spoilageRateWithout: number[];
  spoilageRateWith: number[];
}

/**
 * Оптовые цены пользователя (₽/кг → ₽/т × 1000), порядок: заложка сент → … → август.
 * Прогноз: сен–дек 2026, янв–авг 2027. Прошлый год: те же месяцы по календарю 2026.
 */
const POTATO_STORAGE_FORECAST_RUB_PER_TON = [
  18_000, 20_000, 22_000, 25_000, 29_000, 31_000, 34_000, 38_000, 42_000, 47_000, 53_000, 32_000,
];

/** Опт 2026 для тех же месяцев сезона (серые столбцы) */
const POTATO_STORAGE_PAST_RUB_PER_TON = [
  18_000, 20_000, 22_000, 25_000, 28_000, 30_000, 33_000, 36_000, 40_000, 45_000, 50_000, 30_000,
];

export const CALCULATOR_MONTHS = STORAGE_MONTHS;

/** Полные названия по календарю (индекс 0 = январь). */
const MONTH_NAMES_FULL = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

/** Помесячные доли от остатка; суммарная потеря массы ≈ targetFraction. */
function buildSpoilageRates(targetFraction: number): number[] {
  const base = 1 - (1 - targetFraction) ** (1 / STORAGE_MONTHS);
  const rates: number[] = [];
  for (let m = 0; m < STORAGE_MONTHS; m++) {
    const ramp = 1 + m * 0.04;
    rates.push(base * ramp);
  }
  const product = rates.reduce((acc, r) => acc * (1 - r), 1);
  const actual = 1 - product;
  const scale = targetFraction / actual;
  return rates.map((r) => r * scale);
}

export function monthLabelsFromHarvest(harvestMonth: number): string[] {
  const labels: string[] = [];
  for (let m = 0; m < CALCULATOR_MONTHS; m++) {
    const cal = (harvestMonth - 1 + m) % 12;
    labels.push(MONTH_NAMES_FULL[cal]);
  }
  return labels;
}

const potatoSpoilageWithout = buildSpoilageRates(TARGET_LOSS_FRACTION_WITHOUT);
const potatoSpoilageWith = buildSpoilageRates(TARGET_LOSS_FRACTION_WITH);

export const calculatorCrops: Record<string, CalculatorCropData> = {
  potato: {
    label: 'Картофель',
    harvestMonth: 9,
    defaultYieldTonsPerHa: 28,
    /** Legacy fallback, если priceStorage* не заданы */
    priceMonthlyPast: [12800, 12700, 12650, 12500, 12450, 12550, 12700, 13800, 15200, 15800, 16200, 16500],
    priceMonthlyCurrent: [13200, 13100, 13050, 12900, 12850, 12950, 13100, 14200, 15600, 16200, 16600, 16900],
    priceStorageForecast: POTATO_STORAGE_FORECAST_RUB_PER_TON,
    priceStoragePast: POTATO_STORAGE_PAST_RUB_PER_TON,
    spoilageRateWithout: potatoSpoilageWithout,
    spoilageRateWith: potatoSpoilageWith,
  },
};

export const POTATO_CROP = calculatorCrops.potato;
