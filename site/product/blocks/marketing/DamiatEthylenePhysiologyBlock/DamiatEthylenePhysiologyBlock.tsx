import React from 'react';
import { SectionShell } from '@ai-ds/core/blocks/_shared/SectionShell';
import { BlockSectionHeader } from '@ai-ds/core/blocks/_shared/BlockSectionHeader';
import {
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
} from '@ai-ds/core/blocks/_shared/blockLayout';
import { cn } from '@ai-ds/core/shared';
import type {
  DamiatEthylenePhysiologyBlockProps,
  EthyleneModeCard,
} from './DamiatEthylenePhysiologyBlock.types';

export type {
  DamiatEthylenePhysiologyBlockProps,
  EthyleneModeCard,
} from './DamiatEthylenePhysiologyBlock.types';

function ModeBadge({ text, variant }: { text: string; variant: 'brand' | 'muted' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center self-start rounded-[var(--radius-medium)]',
        'px-[var(--space-10)] py-[var(--space-4)]',
        'text-style-caption-xs font-semibold uppercase tracking-wide',
        variant === 'brand'
          ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
          : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]',
      )}
    >
      {text}
    </span>
  );
}

function PpmDisplay({ ppm, isBrand }: { ppm: string; isBrand: boolean }) {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <span
        className={cn(
          'text-style-caption-xs uppercase tracking-wide',
          isBrand
            ? 'text-[var(--color-brand-primary)]'
            : 'text-[var(--color-text-muted)]',
        )}
      >
        Концентрация
      </span>
      <span
        className={cn(
          'text-style-h3 font-semibold tabular-nums',
          isBrand
            ? 'text-[var(--color-brand-primary)]'
            : 'text-[var(--color-text-secondary)]',
        )}
      >
        {ppm}
      </span>
    </div>
  );
}

function ModeCard({ card, isBrand }: { card: EthyleneModeCard; isBrand: boolean }) {
  return (
    <div
      className={cn(
        BLOCK_CARD_STANDARD_SHELL_CLASS,
        BLOCK_CARD_STANDARD_INSET_CLASS,
        'flex flex-col gap-[var(--space-section-content-m)]',
        isBrand && 'border-[var(--color-brand-primary)]',
      )}
    >
      <div className="flex flex-col gap-[var(--space-section-stack-s)]">
        {card.badge && (
          <ModeBadge text={card.badge} variant={card.badgeVariant ?? 'muted'} />
        )}
        <h3 className="m-0 text-style-h4 font-semibold text-[var(--color-text-primary)]">
          {card.label}
        </h3>
      </div>

      <PpmDisplay ppm={card.ppm} isBrand={isBrand} />

      <div className="flex flex-col gap-[var(--space-section-stack-xs)]">
        <span className="text-style-caption-xs uppercase tracking-wide text-[var(--color-text-muted)]">
          Режим подачи
        </span>
        <p className="m-0 text-style-body-sm font-medium text-[var(--color-text-primary)]">
          {card.rhythm}
        </p>
      </div>

      <div
        className={cn(
          'flex flex-col gap-[var(--space-section-stack-xs)]',
          'border-t border-[var(--color-border-base)] pt-[var(--space-section-content-s)]',
        )}
      >
        <span className="text-style-caption-xs uppercase tracking-wide text-[var(--color-text-muted)]">
          Физиология
        </span>
        <p className="m-0 text-style-body-sm text-[var(--color-text-secondary)]">
          {card.mechanism}
        </p>
      </div>

      <div
        className={cn(
          'flex flex-col gap-[var(--space-section-stack-xs)]',
          'rounded-[var(--radius-medium)] bg-[var(--color-surface-2)]',
          'px-[var(--space-16)] py-[var(--space-12)]',
        )}
      >
        <span className="text-style-caption-xs uppercase tracking-wide text-[var(--color-text-muted)]">
          Результат
        </span>
        <p
          className={cn(
            'm-0 text-style-body-sm font-medium',
            isBrand
              ? 'text-[var(--color-brand-primary)]'
              : 'text-[var(--color-text-secondary)]',
          )}
        >
          {card.effect}
        </p>
      </div>
    </div>
  );
}

export const DamiatEthylenePhysiologyBlock: React.FC<DamiatEthylenePhysiologyBlockProps> = ({
  title = 'Этилен для картофеля работает иначе',
  subtitle,
  modes,
  footnote,
  className,
}) => {
  const [storageMode, ripeningMode] = modes;

  return (
    <SectionShell
      recipe="section.features"
      appearance="surface"
      className={className}
      aria-label="Физиология этилена"
    >
      <BlockSectionHeader title={title} subtitle={subtitle} />

      <div
        className="grid grid-cols-1 gap-[var(--space-section-content-m)] min-[768px]:grid-cols-2"
      >
        <ModeCard card={storageMode} isBrand />
        <ModeCard card={ripeningMode} isBrand={false} />
      </div>

      {footnote && (
        <p
          className={cn(
            'm-0 max-w-[var(--space-545)] text-style-body-sm text-[var(--color-text-muted)]',
            'border-t border-[var(--color-border-base)] pt-[var(--space-section-content-m)]',
          )}
        >
          {footnote}
        </p>
      )}
    </SectionShell>
  );
};

DamiatEthylenePhysiologyBlock.displayName = 'DamiatEthylenePhysiologyBlock';
