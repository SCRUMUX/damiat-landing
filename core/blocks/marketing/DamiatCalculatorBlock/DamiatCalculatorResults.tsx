import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { BlockGrid } from '../../_shared/BlockGrid';
import {
  BLOCK_CARD_COMPACT_CLASS,
  BLOCK_CARD_COMPACT_INSET_CLASS,
} from '../../_shared/blockLayout';
import type { DamiatCalculatorResultMetric } from './DamiatCalculatorBlock.types';

export interface DamiatCalculatorResultsProps {
  title?: string;
  metrics: DamiatCalculatorResultMetric[];
  visible: boolean;
}

export const DamiatCalculatorResults: React.FC<DamiatCalculatorResultsProps> = ({
  title = 'Результат расчёта',
  metrics,
  visible,
}) => {
  if (!visible) {
    return (
      <div
        className={cn(
          BLOCK_CARD_COMPACT_CLASS,
          BLOCK_CARD_COMPACT_INSET_CLASS,
          'flex min-h-[var(--space-240)] items-center justify-center bg-[var(--color-surface-2)]',
        )}
      >
        <p className="m-0 text-center text-style-body-sm text-[var(--color-text-muted)]">
          Заполните параметры и нажмите «Рассчитать», чтобы увидеть DAMIAT Index и прогноз
        </p>
      </div>
    );
  }

  const primary = metrics.find((m) => m.primary);
  const rest = metrics.filter((m) => !m.primary);

  return (
    <div className={cn(BLOCK_CARD_COMPACT_CLASS, BLOCK_CARD_COMPACT_INSET_CLASS, 'bg-[var(--color-surface-2)]')}>
      <p className="m-0 mb-[var(--space-16)] text-style-body-strong text-[var(--color-text-primary)]">{title}</p>
      {primary ? (
        <div
          className="mb-[var(--space-24)] rounded-[var(--radius-medium)] bg-[var(--color-brand-muted)] p-[var(--space-inset-l)]"
          style={{ borderWidth: 'var(--border-width-base)', borderStyle: 'solid', borderColor: 'var(--color-border-base)' }}
        >
          <span className="block text-style-caption text-[var(--color-text-secondary)]">{primary.label}</span>
          <span className="text-style-tabular mt-[var(--space-4)] block text-style-display font-semibold text-[var(--color-brand-primary)]">
            {primary.value}
          </span>
        </div>
      ) : null}
      <BlockGrid columns={2}>
        {rest.map((metric) => (
          <div key={metric.id} className="flex flex-col gap-[var(--space-4)]">
            <span className="text-style-caption text-[var(--color-text-muted)]">{metric.label}</span>
            <span className="text-style-body-strong text-style-tabular text-[var(--color-text-primary)]">
              {metric.value}
            </span>
          </div>
        ))}
      </BlockGrid>
    </div>
  );
};

DamiatCalculatorResults.displayName = 'DamiatCalculatorResults';
