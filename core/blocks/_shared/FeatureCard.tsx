import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { BLOCK_CARD_COMPACT_CLASS, BLOCK_CARD_COMPACT_INSET_CLASS } from './blockLayout';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

/** Lightweight marketing feature tile — fills grid cell without Card max-width constraints. */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col h-full w-full min-w-0',
      BLOCK_CARD_COMPACT_CLASS,
      BLOCK_CARD_COMPACT_INSET_CLASS,
      'transition-colors duration-150 hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-surface-1)]',
      className,
    )}
    style={{
      gap: 'var(--space-section-stack-m)',
    }}
  >
    {icon && (
      <div
        className="flex items-center justify-center shrink-0 rounded-[var(--radius-default)] bg-[var(--color-brand-muted)] text-[var(--color-brand-primary)]"
        style={{
          width: 'var(--space-48)',
          height: 'var(--space-48)',
          fontSize: 'var(--font-size-20)',
        }}
      >
        {icon}
      </div>
    )}
    <div className="flex flex-col" style={{ gap: 'var(--space-section-stack-s)' }}>
      <h3 className="m-0 text-style-h4 font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="m-0 text-style-body-sm text-[var(--color-text-secondary)]">{description}</p>
    </div>
  </div>
);

FeatureCard.displayName = 'FeatureCard';
