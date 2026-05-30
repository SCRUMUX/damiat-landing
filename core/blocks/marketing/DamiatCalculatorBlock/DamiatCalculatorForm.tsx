import React, { useCallback, useMemo } from 'react';
import { Input } from '../../../components/primitives/Input';
import { Slider } from '../../../components/primitives/Slider';
import { Button } from '../../../components/primitives/Button';
import { Switch } from '../../../components/primitives/Switch';
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
  number,
  title,
  children,
  divided,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  divided?: boolean;
}) {
  return (
    <section
      className={
        divided
          ? 'border-t border-[var(--color-border-base)] pt-[var(--space-section-content-m)]'
          : undefined
      }
    >
      <div className="mb-[var(--space-section-stack-s)] flex items-center gap-[var(--space-8)]">
        <span
          className="flex h-[var(--space-28)] w-[var(--space-28)] shrink-0 items-center justify-center rounded-full border border-[var(--color-brand-primary)] text-style-caption font-semibold text-[var(--color-brand-primary)]"
          aria-hidden
        >
          {number}
        </span>
        <h3 className="m-0 text-style-h4 text-[var(--color-text-primary)]">{title}</h3>
      </div>
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
  extends Pick<DamiatCalculatorBlockProps, 'devicesTitle' | 'recommendationsHref' | 'recommendationsLabel'> {
  values: DamiatCalculatorFormValues;
  onValuesChange: (values: DamiatCalculatorFormValues) => void;
  onDeviceChange: (device1: boolean) => void;
}

/** Левая панель калькулятора (параметры урожая + цена). */
export const DamiatCalculatorForm: React.FC<DamiatCalculatorFormProps> = ({
  values,
  onValuesChange,
  onDeviceChange,
  devicesTitle = 'Генератор DAMIAT',
  recommendationsHref = '#scenarios',
  recommendationsLabel = 'Перейти в рекомендации',
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
    <aside className="flex h-full min-h-full w-full min-w-0 flex-col gap-[var(--space-section-content-m)] text-style-body">
      <SidebarSection number={1} title="Параметры урожая">
        <div className="flex flex-col gap-[var(--space-section-content-m)]">
          <div>
            <FieldLabel unit="га">Площадь посева</FieldLabel>
            <Input
              size="lg"
              fullWidth
              placeholder="500"
              value={values.hectares}
              onChange={(e) => update({ hectares: e.target.value })}
              inputProps={numericInputProps}
            />
          </div>
          <div>
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
          <div>
            <FieldLabel unit="т">Общий объём урожая</FieldLabel>
            <span className="text-style-h4 text-style-tabular block font-semibold leading-tight text-[var(--color-brand-primary)]">
              {totalTons > 0 ? formatTons(totalTons) : '—'}
            </span>
          </div>
        </div>
      </SidebarSection>

      <SidebarSection number={2} title="Базовая цена" divided>
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

          <div className="flex flex-col gap-[var(--space-8)] pt-[var(--space-section-content-m)]">
            <label className="flex cursor-pointer items-center gap-[var(--space-8)] text-style-caption text-[var(--color-text-primary)]">
              <Switch
                size="md"
                state={values.device1 ? 'on' : 'off'}
                onToggle={onDeviceChange}
                aria-label={devicesTitle}
              />
              <span className="font-medium">{devicesTitle}</span>
            </label>
            <p className="m-0 text-style-caption leading-snug text-[var(--color-text-muted)]">
              {values.device1
                ? 'В сценарии есть DAMIAT — ниже эффект экономии'
                : 'Без DAMIAT — ниже упущенная выгода и потери'}
            </p>
          </div>
        </div>
      </SidebarSection>

      <div className="mt-auto pt-[var(--space-section-content-m)]">
        <Button
          appearance="brand"
          size="md"
          type="button"
          className="w-full"
          onClick={() => {
            document.querySelector(recommendationsHref)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          {recommendationsLabel}
        </Button>
      </div>
    </aside>
  );
};

DamiatCalculatorForm.displayName = 'DamiatCalculatorForm';
