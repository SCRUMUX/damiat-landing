/** Константы маркетингового калькулятора (mock → API). */



/**

 * Затраты на КГС/этилен по документу «Анализ изменения % потерь»:

 * для 15 000 т за 11 мес. = 3 750 000 ₽ → 250 ₽/т на весь период (не лизинг прибора).

 */

export const ETHYLENE_COST_PER_TON_RUB = 250;



/** Ёмкость одной линии для оценки числа генераторов (информативно). */

export const DEVICE_TONS_CAPACITY = 2_500;



/** Период симуляции в UI: сентябрь → август (12 календарных месяцев). */
export const STORAGE_MONTHS = 12;

/** Месяцев на одной «странице» графика и таблицы (полгода). */
export const DYNAMICS_MONTHS_PER_PAGE = 6;

/** Подписи табов динамики, напр. «Сентябрь — Февраль» (monthLabels — полные имена). */
export function buildDynamicsPageTabLabels(
  monthLabels: string[],
  monthsPerPage = DYNAMICS_MONTHS_PER_PAGE,
): string[] {
  if (monthLabels.length === 0) return [];
  const tabs: string[] = [];
  for (let start = 0; start < monthLabels.length; start += monthsPerPage) {
    const chunk = monthLabels.slice(start, start + monthsPerPage);
    tabs.push(`${chunk[0]} — ${chunk[chunk.length - 1]}`);
  }
  return tabs;
}



/** @deprecated Используйте ETHYLENE_COST_PER_TON_RUB; оставлено для совместимости подписей. */

export const DEVICE_MONTHLY_COST_RUB = 300_000;



export const PRICE_DISCLAIMER =
  'Прогноз оптовых цен на картофель по месяцам хранения. Не является офертой.';



export const PRICE_ADJUST_HINT = 'Скорректируйте прогноз, если не согласны с оценкой системы.';



/** Диапазон ручной корректировки прогнозной цены, % */

export const PRICE_ADJUST_MIN = -30;

export const PRICE_ADJUST_MAX = 30;



/** Целевые суммарные потери массы за период хранения (калибровка ставок, см. документ). */

export const TARGET_LOSS_FRACTION_WITHOUT = 0.145;



/** С КГС: 14,5% − 8 п.п. = 6,5% (диапазон документа 4–6,5%). */

export const TARGET_LOSS_FRACTION_WITH = 0.065;



/** Разница долей потерь в упрощённом примере документа (Агро холдинг). */

export const DOC_MASS_DELTA_FRACTION = 0.08;



/** Пресет «как в анализе»: 15 000 т, 35 000 ₽/т (сентябрь). */

export const AGRO_HOLDING_PRESET = {

  hectares: '536',

  yieldTonsPerHa: '28',

  manualBasePricePerTon: '18000',

  priceAdjustPercent: 0,

} as const;


