import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import type { HeroStat } from './HeroBlock';

export interface HeroMetricsBandProps {
  stats?: HeroStat[];
  description?: string;
  onBrand?: boolean;
  /** Hairline above metrics row — off on photo-hero landings. */
  showTopBorder?: boolean;
  className?: string;
}

function StatCell({
  stat,
  onBrand,
  className,
}: {
  stat: HeroStat;
  onBrand?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col gap-[var(--space-2)] py-[var(--space-2)]',
        'pr-[var(--space-section-content-l)]',
        className,
      )}
    >
      <span
        className={cn(
          'text-style-h2 font-semibold tabular-nums leading-none',
          onBrand ? 'text-inherit' : 'text-[var(--color-text-primary)]',
        )}
      >
        {stat.value}
      </span>
      <span
        className={cn(
          'max-w-[var(--space-160)] text-style-body-sm leading-snug',
          onBrand ? 'text-inherit opacity-90' : 'text-[var(--color-text-secondary)]',
        )}
      >
        {stat.label}
      </span>
    </div>
  );
}

export const HeroMetricsBand: React.FC<HeroMetricsBandProps> = ({
  stats = [],
  description,
  onBrand = false,
  showTopBorder = true,
  className,
}) => {
  if (stats.length === 0 && !description) return null;

  const borderClass = onBrand
    ? 'border-[var(--color-text-on-brand)]/25'
    : 'border-[var(--color-border-base)]';

  const textClass = onBrand
    ? 'text-inherit opacity-90'
    : 'text-[var(--color-text-secondary)]';

  return (
    <div
      className={cn(
        'w-full pt-[var(--space-section-content-l)]',
        showTopBorder && 'border-t',
        showTopBorder && borderClass,
        className,
      )}
    >
      {/* Desktop — single row: metrics | description (Cortel band) */}
      <div className="hidden min-[1024px]:flex min-w-0 items-stretch">
        {stats.length > 0 ? (
          <div className="flex shrink-0 items-stretch" role="list" aria-label="Ключевые показатели">
            {stats.map((stat, index) => (
              <React.Fragment key={stat.label}>
                {index > 0 ? (
                  <div
                    className={cn('mx-[var(--space-section-content-m)] w-px shrink-0 self-stretch border-l', borderClass)}
                    aria-hidden="true"
                  />
                ) : null}
                <div role="listitem">
                  <StatCell
                    stat={stat}
                    onBrand={onBrand}
                    className={index === 0 ? 'pl-0' : undefined}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : null}

        {description && stats.length > 0 ? (
          <div
            className={cn(
              'mx-[var(--space-section-content-l)] w-px shrink-0 self-stretch border-l',
              borderClass,
            )}
            aria-hidden="true"
          />
        ) : null}

        {description ? (
          <p className={cn('m-0 min-w-0 flex-1 self-center text-style-body leading-relaxed', textClass)}>
            {description}
          </p>
        ) : null}
      </div>

      {/* Mobile / tablet — metrics grid, then description */}
      <div
        className="flex flex-col gap-[var(--space-section-content-l)] min-[1024px]:hidden"
        style={{ gap: 'var(--space-section-content-l)' }}
      >
        {stats.length > 0 ? (
          <div
            className="grid grid-cols-2 gap-x-[var(--space-section-content-m)] gap-y-[var(--space-section-content-l)]"
            role="list"
            aria-label="Ключевые показатели"
          >
            {stats.map((stat) => (
              <div key={stat.label} role="listitem">
                <StatCell stat={stat} onBrand={onBrand} className="min-w-0 px-0" />
              </div>
            ))}
          </div>
        ) : null}
        {description ? (
          <p className={cn('m-0 text-style-body leading-relaxed', textClass)}>{description}</p>
        ) : null}
      </div>
    </div>
  );
};

HeroMetricsBand.displayName = 'HeroMetricsBand';
