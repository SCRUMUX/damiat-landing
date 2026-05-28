import React from 'react';
import { BLOCK_SUPPORT_STAT_CARD_SHELL_CLASS } from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import type { SupportStatItem } from './SupportBlock.types';

export interface SupportStatCardProps extends SupportStatItem {
  className?: string;
  compact?: boolean;
}

const STAT_VALUE_CLASS = cn(
  'm-0 font-medium text-style-h1',
  'min-[1024px]:text-style-display',
);

const STAT_LABEL_CLASS = cn(
  'm-0 mt-[var(--space-section-stack-s)] text-style-body-sm opacity-90',
  'min-[1024px]:text-style-body',
);

export const SupportStatCard: React.FC<SupportStatCardProps> = ({
  value,
  label,
  imageSrc,
  imageAlt,
  cover,
  className,
  compact = false,
}) => (
  <article
    className={cn(
      BLOCK_SUPPORT_STAT_CARD_SHELL_CLASS,
      compact ? 'h-[var(--space-200)]' : 'min-h-[var(--space-160)] h-full',
      className,
    )}
  >
    {imageSrc ? (
      <img
        src={imageSrc}
        alt={imageAlt ?? ''}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
    ) : null}
    {cover ? <div className="absolute inset-0 z-0">{cover}</div> : null}
    <div
      className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-[var(--color-brand-primary)]/85 via-[var(--color-brand-primary)]/70 to-[var(--color-brand-hover)]/80"
      aria-hidden="true"
    />
    <div className="relative z-[2] text-[var(--color-text-on-brand)]">
      <p className={STAT_VALUE_CLASS}>{value}</p>
      <p className={STAT_LABEL_CLASS}>{label}</p>
    </div>
  </article>
);

SupportStatCard.displayName = 'SupportStatCard';
