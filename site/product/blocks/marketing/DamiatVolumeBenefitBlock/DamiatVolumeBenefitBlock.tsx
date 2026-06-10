import React, { useMemo } from 'react';
import { SectionShell } from '@ai-ds/core/blocks/_shared/SectionShell';
import { BlockSectionHeader } from '@ai-ds/core/blocks/_shared/BlockSectionHeader';
import { BlockAction } from '@ai-ds/core/blocks/_shared/BlockAction';
import { BLOCK_CARD_PROMINENT_SHELL_CLASS, BLOCK_CARD_STANDARD_INSET_CLASS } from '@ai-ds/core/blocks/_shared/blockLayout';
import { cn } from '@ai-ds/core/shared';
import { POTATO_CROP } from '../DamiatCalculatorBlock/calculatorCropsData';
import { computeFullResult, formatRubCompact } from '../DamiatCalculatorBlock/calculatorEngine';
import { buildUniformSalesStrings, emptyOpexStrings } from '../DamiatCalculatorBlock/calculatorSchedule';
import type { DamiatVolumeBenefitBlockProps } from './DamiatVolumeBenefitBlock.types';

export type { DamiatVolumeBenefitBlockProps, VolumeBenefitBarItem } from './DamiatVolumeBenefitBlock.types';

const DEFAULT_VOLUME_STEPS = [1_000, 3_000, 5_000, 8_000, 10_000, 15_000, 20_000];

function formatVolumeLabel(tons: number): string {
  if (tons >= 1_000 && tons % 1_000 === 0) {
    return `${(tons / 1_000).toLocaleString('ru-RU')} тыс. т`;
  }
  return `${tons.toLocaleString('ru-RU')} т`;
}

function computeBenefitRub(volumeTons: number): number {
  const sales = buildUniformSalesStrings(volumeTons);
  const result = computeFullResult(POTATO_CROP, volumeTons, 0, undefined, sales, emptyOpexStrings());
  if (!result) return 0;
  return Math.max(0, result.profitDelta);
}

function BenefitBarColumn({
  volumeTons,
  benefitRub,
  heightPercent,
}: {
  volumeTons: number;
  benefitRub: number;
  heightPercent: number;
}) {
  return (
    <div className="flex min-w-[var(--space-56)] flex-1 flex-col items-center gap-[var(--space-8)] min-[1024px]:min-w-0">
      <div
        className="flex w-full max-w-[var(--space-72)] flex-1 flex-col justify-end"
        style={{ minHeight: 'var(--space-200)' }}
      >
        <div
          className="w-full rounded-t-[var(--radius-medium)] bg-[var(--color-brand-primary)] transition-[height] duration-300 ease-out"
          style={{ height: `${heightPercent}%`, minHeight: 'var(--space-8)' }}
          role="img"
          aria-label={`${formatVolumeLabel(volumeTons)}, выгода ${formatRubCompact(benefitRub)}`}
        />
      </div>
      <div className="flex w-full flex-col items-center gap-[var(--space-4)] text-center">
        <div className="flex flex-col gap-[var(--space-2)]">
          <span className="text-style-caption-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            Объём
          </span>
          <span className="text-style-body-sm font-medium tabular-nums text-[var(--color-text-primary)]">
            {formatVolumeLabel(volumeTons)}
          </span>
        </div>
        <div className="flex flex-col gap-[var(--space-2)]">
          <span className="text-style-caption-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            Выгода
          </span>
          <span className="text-style-body-sm font-semibold tabular-nums text-[var(--color-brand-primary)]">
            {formatRubCompact(benefitRub)}
          </span>
        </div>
      </div>
    </div>
  );
}

export const DamiatVolumeBenefitBlock: React.FC<DamiatVolumeBenefitBlockProps> = ({
  title = 'Выгода от DAMIAT по объёму хранения',
  subtitle = 'Чем больше объём хранения — тем выше чистая выгода с генератором DAMIAT. Расчёт по прогнозу оптовых цен.',
  volumeStepsTons = DEFAULT_VOLUME_STEPS,
  calculatorHref = '#calculator',
  calculatorCtaLabel = 'Рассчитать под своё хозяйство',
  className,
}) => {
  const bars = useMemo(() => {
    const steps = [...volumeStepsTons].sort((a, b) => a - b);
    return steps.map((volumeTons) => ({
      volumeTons,
      benefitRub: computeBenefitRub(volumeTons),
    }));
  }, [volumeStepsTons]);

  const maxBenefit = useMemo(
    () => Math.max(...bars.map((bar) => bar.benefitRub), 1),
    [bars],
  );

  return (
    <SectionShell
      recipe="section.features"
      appearance="surface"
      className={className}
      aria-label="Volume benefit chart"
    >
      <BlockSectionHeader title={title} subtitle={subtitle} />

      <div
        className={cn(
          BLOCK_CARD_PROMINENT_SHELL_CLASS,
          BLOCK_CARD_STANDARD_INSET_CLASS,
          'flex flex-col gap-[var(--space-section-content-l)]',
        )}
      >
        <div
          className="flex items-end gap-[var(--space-8)] overflow-x-auto pb-[var(--space-4)] min-[1024px]:gap-[var(--space-12)] min-[1024px]:overflow-visible"
          role="list"
          aria-label="Выгода по объёму хранения"
        >
          {bars.map((bar) => (
            <div key={bar.volumeTons} role="listitem" className="flex flex-1 shrink-0">
              <BenefitBarColumn
                volumeTons={bar.volumeTons}
                benefitRub={bar.benefitRub}
                heightPercent={(bar.benefitRub / maxBenefit) * 100}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-[var(--space-section-stack-m)] border-t border-[var(--color-border-base)] pt-[var(--space-section-content-m)]">
          <p className="m-0 max-w-[var(--space-545)] text-style-body-sm text-[var(--color-text-muted)]">
            Чистая выгода за сезон хранения при равномерной реализации. Точный расчёт — в калькуляторе.
          </p>
          <BlockAction label={calculatorCtaLabel} href={calculatorHref} appearance="outline" size="lg" />
        </div>
      </div>
    </SectionShell>
  );
};

DamiatVolumeBenefitBlock.displayName = 'DamiatVolumeBenefitBlock';
