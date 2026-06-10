import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import {
  TRUST_PILLARS_ROW_CLASS,
  TRUST_STANDARDS_GRID_CLASS,
  TRUST_STANDARDS_SPLIT_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { TrustPillarCard } from './TrustPillarCard';
import { TrustStandardLink } from './TrustStandardLink';
import type { TrustBlockProps } from './TrustBlock.types';

export type { TrustBlockProps, TrustPillarItem, TrustStandardItem } from './TrustBlock.types';

const TRUST_DIVIDER_CLASS = cn(
  'hidden h-px w-full min-[1024px]:block',
  'my-[var(--space-section-content-l)]',
);

function TrustDivider() {
  return (
    <div
      className={TRUST_DIVIDER_CLASS}
      style={{
        background:
          'linear-gradient(90deg, color-mix(in srgb, var(--color-border-base) 20%, transparent) 0%, var(--color-border-base) 50%, color-mix(in srgb, var(--color-border-base) 20%, transparent) 100%)',
      }}
      aria-hidden="true"
    />
  );
}

export const TrustBlock: React.FC<TrustBlockProps> = ({
  title = 'Надёжность и предсказуемость',
  pillars,
  standardsTitle = 'Стандарты и контракты для consumer-проектов',
  standards,
  className,
}) => {
  if (pillars.length === 0) return null;

  const resolvedPillars = pillars.map((pillar, index) => ({
    ...pillar,
    featured: pillar.featured ?? index === 0,
  }));

  return (
    <SectionShell recipe="section.trust" appearance="muted" className={className} aria-label="Trust">
      <h2 className="m-0 mb-[var(--space-section-content-m)] font-medium text-style-h1 text-[var(--color-text-primary)] min-[1024px]:mb-[var(--space-48)]">
        {title}
      </h2>

      <div className={TRUST_PILLARS_ROW_CLASS}>
        {resolvedPillars.map((pillar) => (
          <TrustPillarCard
            key={pillar.id ?? pillar.title}
            {...pillar}
            className="min-[1024px]:min-w-0 min-[1024px]:flex-1"
          />
        ))}
      </div>

      {standards.length > 0 ? (
        <>
          <TrustDivider />
          <div className={TRUST_STANDARDS_SPLIT_CLASS}>
            <p className="m-0 max-w-[var(--space-280)] text-style-body text-[var(--color-text-secondary)] min-[1024px]:text-style-body-lg">
              {standardsTitle}
            </p>
            <div className={TRUST_STANDARDS_GRID_CLASS}>
              {standards.map((standard) => (
                <TrustStandardLink key={standard.id ?? standard.title} {...standard} />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </SectionShell>
  );
};

TrustBlock.displayName = 'TrustBlock';
