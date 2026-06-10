import React, { useCallback, useMemo } from 'react';
import { Input } from '@ai-ds/core/components/Input';
import { Slider } from '@ai-ds/core/components/Slider';
import { Button } from '@ai-ds/core/components/Button';
import { Switch } from '@ai-ds/core/components/Switch';
import { cn } from '@ai-ds/core/shared';
import { POTATO_CROP } from './calculatorCropsData';
import { PRICE_ADJUST_MAX, PRICE_ADJUST_MIN } from './calculatorConfig';
import {
  averagePricePerTon,
  buildPriceForecast,
  defaultSeptemberPricePerTon,
  formatTons,
  totalTonsFromFields,
} from './calculatorEngine';
import type { DamiatCalculatorBlockProps, DamiatCalculatorFormValues } from './DamiatCalculatorBlock.types';

function SidebarSection({
  title,
  children,
  divided,
  className,
}: {
  title: string;
  children: React.ReactNode;
  divided?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        divided
          ? 'border-t border-[var(--color-border-base)] pt-[var(--space-section-content-m)]'
          : undefined,
        className,
      )}
    >
      <h3 className="m-0 mb-[var(--space-section-stack-s)] text-style-h4 text-[var(--color-text-primary)]">
        {title}
      </h3>
      {children}
    </section>
  );
}

function FieldLabel({ children, unit }: { children: React.ReactNode; unit?: string }) {
  return (
    <span className="mb-[var(--space-6)] block text-style-body font-medium text-[var(--color-text-secondary)]">
      {children}
      {unit ? <span className="font-normal text-[var(--color-text-muted)]">, {unit}</span> : null}
    </span>
  );
}

const numericInputProps = {
  type: 'text' as const,
  inputMode: 'decimal' as const,
  autoComplete: 'off',
};

export interface DamiatCalculatorFormProps
  extends Pick<DamiatCalculatorBlockProps, 'devicesTitle'> {
  values: DamiatCalculatorFormValues;
  onValuesChange: (values: DamiatCalculatorFormValues) => void;
  onDeviceChange: (device1: boolean) => void;
  /** Суммарная прибыль за сезон по активному сценарию; null — нет объёма */
  seasonProfitRub: string | null;
  onResetUniformSales: () => void;
}

/** Левая панель калькулятора (параметры урожая + цена). */
export const DamiatCalculatorForm: React.FC<DamiatCalculatorFormProps> = ({
  values,
  onValuesChange,
  onDeviceChange,
  seasonProfitRub,
  onResetUniformSales,
  devicesTitle = 'Генератор DAMIAT',
}) => {
  const update = useCallback(
    (patch: Partial<DamiatCalculatorFormValues>) => {
      onValuesChange({ ...values, ...patch });
    },
    [onValuesChange, values],
  );

  const totalTons = useMemo(() => {
    const ha = Number(values.hectares) || 0;
    const y = Number(values.yieldTonsPerHa) || 0;
    return totalTonsFromFields(ha, y);
  }, [values.hectares, values.yieldTonsPerHa]);

  const defaultBasePrice = useMemo(() => defaultSeptemberPricePerTon(POTATO_CROP), []);

  const pricePreview = useMemo(() => {
    const manual = Number(String(values.manualBasePricePerTon).replace(/\s/g, '').replace(',', '.'));
    const manualBase = Number.isFinite(manual) && manual > 0 ? manual : undefined;
    return buildPriceForecast(POTATO_CROP, values.priceAdjustPercent, manualBase);
  }, [values.manualBasePricePerTon, values.priceAdjustPercent]);

  const avgPriceYear = useMemo(() => averagePricePerTon(pricePreview), [pricePreview]);

  const adjustLabel =
    values.priceAdjustPercent !== 0
      ? `${values.priceAdjustPercent > 0 ? '+' : ''}${values.priceAdjustPercent}%`
      : '0%';

  return (
    <aside className="flex h-full min-h-full w-full min-w-0 flex-col text-style-body">
      <div className="flex min-h-0 flex-1 flex-col">
        <SidebarSection title="Параметры урожая">
          <div className="flex flex-col gap-[var(--space-section-content-m)]">
            <div className="grid grid-cols-2 gap-[var(--space-12)]">
              <div className="min-w-0">
                <FieldLabel unit="га">Площадь</FieldLabel>
                <Input
                  size="lg"
                  fullWidth
                  placeholder="500"
                  value={values.hectares}
                  onChange={(e) => update({ hectares: e.target.value })}
                  inputProps={numericInputProps}
                />
              </div>
              <div className="min-w-0">
                <FieldLabel unit="т/га">Урожайность</FieldLabel>
                <Input
                  size="lg"
                  fullWidth
                  placeholder={String(POTATO_CROP.defaultYieldTonsPerHa)}
                  value={values.yieldTonsPerHa}
                  onChange={(e) => update({ yieldTonsPerHa: e.target.value })}
                  inputProps={numericInputProps}
                />
              </div>
            </div>
            <div>
              <FieldLabel unit="т">Общий объём урожая</FieldLabel>
              <span className="text-style-h4 text-style-tabular block font-semibold leading-tight text-[var(--color-brand-primary)]">
                {totalTons > 0 ? formatTons(totalTons) : '—'}
              </span>
              <Button
                type="button"
                appearance="ghost"
                size="sm"
                className="mt-[var(--space-4)] h-auto px-0 font-normal"
                onClick={onResetUniformSales}
                disabled={totalTons <= 0}
              >
                Распределить продажи
              </Button>
            </div>
          </div>
        </SidebarSection>

        <SidebarSection title="Параметры стоимости" className="mt-[var(--space-48)]">
          <div className="flex flex-col gap-[var(--space-section-content-m)]">
            <div>
              <FieldLabel unit="₽/т">Цена при сборке урожая</FieldLabel>
              <Input
                size="lg"
                fullWidth
                placeholder={defaultBasePrice > 0 ? String(Math.round(defaultBasePrice)) : '15600'}
                value={values.manualBasePricePerTon}
                onChange={(e) => update({ manualBasePricePerTon: e.target.value })}
                inputProps={numericInputProps}
              />
            </div>

            <div className="flex items-baseline justify-between gap-[var(--space-8)]">
              <FieldLabel unit="₽/т">Средняя цена за год</FieldLabel>
              <span className="text-style-body-lg text-style-tabular shrink-0 font-semibold leading-tight text-[var(--color-brand-primary)]">
                {avgPriceYear}
              </span>
            </div>

            <div>
              <FieldLabel>Корректировка цены</FieldLabel>
              <div className="flex items-center gap-[var(--space-8)]">
                <span className="w-[var(--space-36)] shrink-0 text-style-body-sm text-[var(--color-text-muted)]">
                  {PRICE_ADJUST_MIN}%
                </span>
                <Slider
                  size="md"
                  className="flex-1"
                  min={PRICE_ADJUST_MIN}
                  max={PRICE_ADJUST_MAX}
                  step={1}
                  value={values.priceAdjustPercent}
                  onChange={(v) => update({ priceAdjustPercent: v })}
                />
                <span className="w-[var(--space-36)] shrink-0 text-right text-style-body-sm text-[var(--color-text-muted)]">
                  +{PRICE_ADJUST_MAX}%
                </span>
              </div>
              <p className="m-0 mt-[var(--space-8)] text-center text-style-body font-medium text-[var(--color-text-primary)]">
                {adjustLabel}
              </p>
            </div>
          </div>
        </SidebarSection>
      </div>

      <div className="mt-auto flex shrink-0 flex-col pt-[var(--space-section-content-m)]">
        <label className="mb-[var(--space-32)] flex cursor-pointer items-center justify-center gap-[var(--space-32)]">
          <span className="text-style-body font-medium leading-snug text-[var(--color-text-primary)]">
            {devicesTitle}
          </span>
          <Switch
            size="md"
            state={values.device1 ? 'on' : 'off'}
            onToggle={onDeviceChange}
            aria-label={devicesTitle}
          />
        </label>

        <div
          className={cn(
            'rounded-[var(--radius-medium)] border px-[var(--space-inset-l)] py-[var(--space-10)] shadow-elevation-1',
            values.device1
              ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-muted)]'
              : 'border-[var(--color-danger-base)] bg-[var(--color-danger-subtle)]',
          )}
        >
          <span className="text-style-body font-medium leading-snug text-[var(--color-text-muted)]">
            Прибыль за сезон
          </span>
          <span
            className={cn(
              'text-style-h3 text-style-tabular mt-[var(--space-4)] block font-semibold leading-none tracking-tight',
              seasonProfitRub && values.device1 && 'text-[var(--color-brand-primary)]',
              seasonProfitRub && !values.device1 && 'text-[var(--color-danger-base)]',
              !seasonProfitRub && 'text-[var(--color-text-muted)]',
            )}
          >
            {seasonProfitRub ?? '—'}
          </span>
          <p className="m-0 mt-[var(--space-4)] text-style-caption font-normal leading-snug text-[var(--color-text-muted)]">
            {seasonProfitRub
              ? 'продажи − потери − расходы'
              : values.device1
                ? 'В сценарии есть DAMIAT — ниже эффект экономии'
                : 'Без DAMIAT — ниже упущенная выгода и потери'}
          </p>
        </div>
      </div>
    </aside>
  );
};

DamiatCalculatorForm.displayName = 'DamiatCalculatorForm';
