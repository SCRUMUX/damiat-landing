import React, { useMemo } from 'react';

import { cn } from '../../../components/primitives/_shared';

import type { DamiatCalculatorSummaryData } from './DamiatCalculatorBlock.types';

export interface DamiatCalculatorSummaryProps {
  data: DamiatCalculatorSummaryData | null;
  device1: boolean;
  hasVolume?: boolean;
  className?: string;
}

type SummaryChip = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  primary?: boolean;
  neutral?: boolean;
};

function SummaryChipCard({ chip, withDamiat }: { chip: SummaryChip; withDamiat: boolean }) {
  const isPrimary = chip.primary === true;
  const isNeutral = chip.neutral === true;

  return (
    <div
      className={cn(
        'flex h-full min-h-[var(--space-80)] min-w-[140px] flex-1 flex-col justify-end rounded-[var(--radius-medium)] border px-[var(--space-inset-l)] py-[var(--space-10)]',
        isNeutral && 'border-[var(--color-border-base)] bg-[var(--color-surface-2)]',
        !isNeutral &&
          isPrimary &&
          withDamiat &&
          'border-[var(--color-brand-primary)] bg-[var(--color-brand-muted)] shadow-elevation-1',
        !isNeutral &&
          isPrimary &&
          !withDamiat &&
          'border-[var(--color-danger-base)] bg-[var(--color-danger-subtle)] shadow-elevation-1',
        !isNeutral &&
          !isPrimary &&
          withDamiat &&
          'border-[var(--color-brand-primary)] bg-[var(--color-surface-2)]',
        !isNeutral &&
          !isPrimary &&
          !withDamiat &&
          'border-[var(--color-danger-base)] bg-[var(--color-surface-2)]',
      )}
    >
      <span className="text-style-body font-medium leading-snug text-[var(--color-text-muted)]">
        {chip.label}
      </span>
      <span
        className={cn(
          'text-style-h3 text-style-tabular mt-[var(--space-4)] block font-semibold leading-none tracking-tight',
          isPrimary && withDamiat && 'text-[var(--color-brand-primary)]',
          isPrimary && !withDamiat && 'text-[var(--color-danger-base)]',
          isNeutral && 'text-[var(--color-text-primary)]',
          !isPrimary && !isNeutral && withDamiat && 'text-[var(--color-brand-primary)]',
          !isPrimary && !isNeutral && !withDamiat && 'text-[var(--color-danger-base)]',
        )}
      >
        {chip.value}
      </span>
      {chip.hint ? (
        <span className="mt-[var(--space-4)] whitespace-nowrap text-style-body font-normal leading-snug text-[var(--color-text-muted)]">
          {chip.hint}
        </span>
      ) : null}
    </div>
  );
}

function buildChips(data: DamiatCalculatorSummaryData, device1: boolean): SummaryChip[] {
  if (device1) {
    return [
      {
        id: 'money',
        label: 'Выгода',
        value: data.moneyWithRub,
        hint: 'Выгода с DAMIAT',
        primary: true,
      },
      {
        id: 'mass',
        label: 'Сохранено',
        value: data.massWithTons,
        hint: 'Тонн урожая с DAMIAT',
      },
      {
        id: 'cost',
        label: 'Расходы на DAMIAT',
        value: data.deviceCostRub,
        hint: data.deviceCostHint,
        neutral: true,
      },
    ];
  }

  return [
    {
      id: 'money',
      label: 'Потеряно',
      value: data.moneyWithoutRub,
      hint: 'Убытки без DAMIAT',
      primary: true,
    },
    {
      id: 'mass',
      label: 'Потеряно',
      value: data.massWithoutTons,
      hint: 'Тонн урожая без DAMIAT',
    },
    {
      id: 'cost',
      label: 'Расходы на DAMIAT',
      value: '0 ₽',
      hint: 'Генератор не используется',
      neutral: true,
    },
  ];
}

export const DamiatCalculatorSummary: React.FC<DamiatCalculatorSummaryProps> = ({
  data,
  device1,
  hasVolume = false,
  className,
}) => {
  const chips = useMemo(() => (data ? buildChips(data, device1) : []), [data, device1]);

  if (!hasVolume || !data) {
    return (
      <p className={cn('m-0 text-style-caption text-[var(--color-text-muted)]', className)}>
        Заполните параметры урожая в панели слева — итоги появятся ниже
      </p>
    );
  }

  return (
    <div className={cn('flex w-full min-w-0 flex-col', className)}>
      <div className="flex items-stretch gap-[var(--space-8)] overflow-x-auto pb-[var(--space-2)] [-webkit-overflow-scrolling:touch] min-[1024px]:gap-[var(--grid-desktop-gutter)] min-[1024px]:overflow-visible">
        {chips.map((chip) => (
          <SummaryChipCard key={`${device1}-${chip.id}`} chip={chip} withDamiat={device1} />
        ))}
      </div>
    </div>
  );
};

DamiatCalculatorSummary.displayName = 'DamiatCalculatorSummary';
