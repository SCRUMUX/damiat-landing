import React from 'react';
import {
  BLOCK_CARD_STANDARD_RADIUS_CLASS,
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  TRUST_PILLAR_ICON_SLOT_CLASS,
  WHY_US_FEATURED_MEDIA_SCRIM_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import type { TrustPillarItem } from './TrustBlock.types';

export interface TrustPillarCardProps extends TrustPillarItem {
  className?: string;
}

const PILLAR_LAYOUT_CLASS = cn(
  'relative flex min-h-[var(--space-160)] w-full min-w-0 flex-col justify-between overflow-hidden',
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'min-[1024px]:h-full min-[1024px]:justify-end',
);
export const TrustPillarCard: React.FC<TrustPillarCardProps> = ({
  title,
  description,
  featured = false,
  imageSrc,
  imageAlt,
  cover,
  className,
}) => {
  const isFeatured = featured;

  return (
    <article
      className={cn(
        PILLAR_LAYOUT_CLASS,
        isFeatured
          ? cn(
              BLOCK_CARD_STANDARD_RADIUS_CLASS,
              'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
            )
          : cn(BLOCK_CARD_STANDARD_SHELL_CLASS, 'text-[var(--color-text-primary)]'),
        className,
      )}
    >
      {isFeatured ? (
        <>
          <div className="absolute inset-0 z-0 bg-[var(--color-brand-primary)]" aria-hidden />
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt ?? ''}
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
          ) : null}
          {cover ? <div className="absolute inset-0 z-0">{cover}</div> : null}
          {cover && !imageSrc ? (
            <div className={WHY_US_FEATURED_MEDIA_SCRIM_CLASS} aria-hidden />
          ) : imageSrc ? (
            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-[var(--color-brand-primary)]/40 min-[1024px]:bg-gradient-to-t min-[1024px]:from-[var(--color-brand-primary)]/95 min-[1024px]:via-[var(--color-brand-primary)]/70 min-[1024px]:to-transparent"
              aria-hidden="true"
            />
          ) : null}
        </>
      ) : null}

      <div
        className={cn('relative z-[2] flex flex-col', isFeatured ? 'gap-[var(--space-section-stack-s)]' : 'h-full gap-[var(--space-section-stack-m)]')}
      >
        {!isFeatured ? (
          <div className="flex min-h-0 flex-1 flex-col justify-start gap-[var(--space-section-stack-m)]">
            {imageSrc || cover ? (
              <div className={TRUST_PILLAR_ICON_SLOT_CLASS}>
                {imageSrc ? (
                  <img src={imageSrc} alt={imageAlt ?? ''} className="h-full w-full object-cover" />
                ) : (
                  cover
                )}
              </div>
            ) : null}
            <h3 className="m-0 font-medium text-style-h3 min-[1024px]:text-style-h4">{title}</h3>
            <p
              className={cn(
                'm-0 max-w-[var(--space-280)] text-style-body-sm text-[var(--color-text-secondary)]',
                'min-[1024px]:text-style-body min-[1024px]:mt-[var(--space-3)]',
              )}
            >
              {description}
            </p>
          </div>
        ) : (
          <>
            <h3 className="m-0 max-w-[var(--space-280)] font-medium text-style-h3 min-[1024px]:text-style-h4">
              {title}
            </h3>
            <p className="m-0 max-w-[var(--space-280)] text-style-body-sm opacity-80 min-[1024px]:text-style-body">
              {description}
            </p>
          </>
        )}
      </div>
    </article>
  );
};

TrustPillarCard.displayName = 'TrustPillarCard';
