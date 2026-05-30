import type { SalesPlanMode } from './calculatorSchedule';

export interface DamiatCalculatorFormValues {
  hectares: string;
  yieldTonsPerHa: string;
  device1: boolean;
  /** Пусто = прогноз опта; иначе база сентября, ₽/т */
  manualBasePricePerTon: string;
  /** Корректировка прогнозной цены, % */
  priceAdjustPercent: number;
  /** План реализации по месяцам, т (строки для инпутов) */
  salesTonsByMonth: string[];
  /** Операционные расходы по месяцам, ₽ */
  opexRubByMonth: string[];
  salesPlanMode: SalesPlanMode;
}

/** Итоги для плашек: одни числа, подписи зависят от device1. */
export interface DamiatCalculatorSummaryData {
  moneyRub: string;
  massTons: string;
  deviceCostRub: string;
  deviceCostHint: string;
}

export interface DamiatCalculatorBlockProps {
  title?: string;
  subtitle?: string;
  devicesTitle?: string;
  recommendationsHref?: string;
  recommendationsLabel?: string;
  defaultValues?: Partial<DamiatCalculatorFormValues>;
  className?: string;
}
