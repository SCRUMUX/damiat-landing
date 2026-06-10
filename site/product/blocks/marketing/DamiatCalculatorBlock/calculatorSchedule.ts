import { STORAGE_MONTHS } from './calculatorConfig';

export type SalesPlanMode = 'uniform' | 'custom';

export type SeasonSchedule = readonly number[];

export interface CalculatorScheduleInput {
  plannedSalesTons: SeasonSchedule;
  opexRub: SeasonSchedule;
}

export interface ScheduleValidation {
  salesSumTons: number;
  volumeTons: number;
  salesOverflowTons: number;
  hasNegative: boolean;
}

export function roundTons1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function parseScheduleCell(raw: string, fallback = 0): number {
  const trimmed = String(raw).trim();
  if (!trimmed) return fallback;
  const n = Number(trimmed.replace(/\s/g, '').replace(',', '.'));
  if (!Number.isFinite(n)) return fallback;
  return n;
}

/** Равномерно распределить объём по `count` месяцам; остаток округления — в последний. */
function distributeEvenlyTons(total: number, count: number): number[] {
  if (count <= 0) return [];
  if (total <= 0) return Array(count).fill(0);

  const perMonth = roundTons1(total / count);
  const plan: number[] = [];
  let remaining = roundTons1(total);

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    const val = isLast
      ? roundTons1(Math.max(0, remaining))
      : roundTons1(Math.max(0, Math.min(remaining, perMonth)));
    plan.push(val);
    remaining = roundTons1(Math.max(0, remaining - val));
  }

  return plan;
}

/**
 * После правки месяца `throughMonthIndex` пересчитывает реализацию
 * в последующих месяцах равномерно на оставшийся объём.
 */
export function redistributeSalesFromMonth(
  volumeTons: number,
  salesRaw: string[],
  throughMonthIndex: number,
): string[] {
  if (volumeTons <= 0) return Array(STORAGE_MONTHS).fill('');

  const clampedIndex = Math.max(0, Math.min(throughMonthIndex, STORAGE_MONTHS - 1));
  const padded =
    salesRaw.length === STORAGE_MONTHS ? [...salesRaw] : buildUniformSalesStrings(volumeTons);
  const plan = parseSalesPlan(padded, volumeTons);

  let sumBefore = 0;
  for (let i = 0; i < clampedIndex; i++) {
    sumBefore = roundTons1(sumBefore + plan[i]);
  }
  const maxForMonth = roundTons1(Math.max(0, volumeTons - sumBefore));
  plan[clampedIndex] = roundTons1(Math.min(plan[clampedIndex], maxForMonth));

  let committedSum = 0;
  for (let i = 0; i <= clampedIndex; i++) {
    committedSum = roundTons1(committedSum + plan[i]);
  }

  const result: string[] = [];
  for (let i = 0; i <= clampedIndex; i++) {
    result[i] = plan[i] > 0 ? formatSalesCell(plan[i]) : '';
  }

  const remainingMonthCount = STORAGE_MONTHS - clampedIndex - 1;
  const remaining = roundTons1(Math.max(0, volumeTons - committedSum));
  const tail = distributeEvenlyTons(remaining, remainingMonthCount);

  for (let j = 0; j < remainingMonthCount; j++) {
    const val = tail[j] ?? 0;
    result[clampedIndex + 1 + j] = val > 0 ? formatSalesCell(val) : '';
  }

  return result;
}

/** Равномерный план продаж; остаток от округления — в последний месяц сезона. */
export function buildUniformSalesPlan(volumeTons: number): number[] {
  return distributeEvenlyTons(volumeTons, STORAGE_MONTHS);
}

export function formatSalesCell(value: number): string {
  if (value <= 0) return '';
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
}

export function formatOpexCell(value: number): string {
  return Math.max(0, Math.round(value)).toLocaleString('ru-RU');
}

export function buildUniformSalesStrings(volumeTons: number): string[] {
  return buildUniformSalesPlan(volumeTons).map(formatSalesCell);
}

export function emptyOpexStrings(): string[] {
  return Array(STORAGE_MONTHS).fill('0');
}

export function emptyOpexPlan(): number[] {
  return Array(STORAGE_MONTHS).fill(0);
}

export function parseSalesPlan(raw: string[], volumeTons: number): number[] {
  return Array.from({ length: STORAGE_MONTHS }, (_, i) => {
    const n = roundTons1(Math.max(0, parseScheduleCell(raw[i] ?? '', 0)));
    return n;
  });
}

export function parseOpexPlan(raw: string[]): number[] {
  return Array.from({ length: STORAGE_MONTHS }, (_, i) =>
    Math.max(0, Math.round(parseScheduleCell(raw[i] ?? '', 0))),
  );
}

export function validateSchedule(
  plannedSalesTons: SeasonSchedule,
  volumeTons: number,
): ScheduleValidation {
  const salesSumTons = roundTons1(plannedSalesTons.reduce((a, b) => a + b, 0));
  const hasNegative = plannedSalesTons.some((v) => v < 0);
  return {
    salesSumTons,
    volumeTons,
    salesOverflowTons: roundTons1(Math.max(0, salesSumTons - volumeTons)),
    hasNegative,
  };
}

export function clampSalesPlanToVolume(plan: number[], volumeTons: number): number[] {
  let remaining = roundTons1(Math.max(0, volumeTons));
  return plan.map((planned) => {
    const clamped = roundTons1(Math.max(0, Math.min(planned, remaining)));
    remaining = roundTons1(Math.max(0, remaining - clamped));
    return clamped;
  });
}

export function buildScheduleInput(
  salesRaw: string[],
  opexRaw: string[],
  volumeTons: number,
): CalculatorScheduleInput {
  const parsed = parseSalesPlan(salesRaw, volumeTons);
  return {
    plannedSalesTons: clampSalesPlanToVolume(parsed, volumeTons),
    opexRub: parseOpexPlan(opexRaw),
  };
}

export function ensureScheduleStrings(
  salesTonsByMonth: string[] | undefined,
  opexRubByMonth: string[] | undefined,
  volumeTons: number,
  mode: SalesPlanMode,
): { salesTonsByMonth: string[]; opexRubByMonth: string[]; salesPlanMode: SalesPlanMode } {
  const opex = opexRubByMonth?.length === STORAGE_MONTHS ? [...opexRubByMonth] : emptyOpexStrings();

  if (volumeTons <= 0) {
    return {
      salesTonsByMonth: Array(STORAGE_MONTHS).fill(''),
      opexRubByMonth: opex,
      salesPlanMode: mode,
    };
  }

  if (mode === 'uniform' || !salesTonsByMonth?.length || salesTonsByMonth.length !== STORAGE_MONTHS) {
    return {
      salesTonsByMonth: buildUniformSalesStrings(volumeTons),
      opexRubByMonth: opex,
      salesPlanMode: 'uniform',
    };
  }

  return {
    salesTonsByMonth: [...salesTonsByMonth],
    opexRubByMonth: opex,
    salesPlanMode: 'custom',
  };
}
