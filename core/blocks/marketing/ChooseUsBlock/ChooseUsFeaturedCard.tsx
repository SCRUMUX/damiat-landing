import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  CHOOSE_US_FEATURED_CLASS,
  CHOOSE_US_FEATURED_DESCRIPTION_CLASS,
  CHOOSE_US_FEATURED_TITLE_CLASS,
} from '../../_shared/blockLayout';
import type { ChooseUsFeaturedItem } from './ChooseUsBlock.types';

function ChooseUsFeaturedTitle({
  title,
  titleBreakBefore,
}: Pick<ChooseUsFeaturedItem, 'title' | 'titleBreakBefore'>) {
  if (!titleBreakBefore || !title.includes(titleBreakBefore)) {
    return <h3 className={CHOOSE_US_FEATURED_TITLE_CLASS}>{title}</h3>;
  }

  const [before, after] = title.split(titleBreakBefore);

  return (
    <h3 className={CHOOSE_US_FEATURED_TITLE_CLASS}>
      {before}
      <br className="desktop:hidden" />
      {titleBreakBefore}
      {after}
    </h3>
  );
}

function DefaultFeaturedMedia() {
  return (
    <>
      <div
        className="absolute inset-0 bg-[var(--color-brand-primary)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-brand-primary) 10%, transparent) 0%, color-mix(in srgb, var(--color-brand-primary) 85%, black) 100%)',
        }}
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 200 200"
        fill="none"
        className="absolute bottom-[-5%] right-[-10%] h-[65%] w-[65%] opacity-25"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="72" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <circle cx="100" cy="100" r="48" stroke="white" strokeWidth="1.5" opacity="0.45" />
        <circle cx="100" cy="100" r="24" fill="white" opacity="0.35" />
      </svg>
    </>
  );
}

export interface ChooseUsFeaturedCardProps extends ChooseUsFeaturedItem {
  className?: string;
}

export const ChooseUsFeaturedCard: React.FC<ChooseUsFeaturedCardProps> = ({
  title,
  titleBreakBefore,
  description,
  media,
  imageSrc,
  imageSrcMobile,
  imageAlt = '',
  className,
}) => (
  <article className={cn(CHOOSE_US_FEATURED_CLASS, className)}>
    {media ? (
      <div className="absolute inset-[-1px]">{media}</div>
    ) : imageSrc || imageSrcMobile ? (
      <>
        {imageSrcMobile ? (
          <img
            src={imageSrcMobile}
            alt={imageAlt}
            className="absolute inset-[-1px] h-[calc(100%+2px)] w-[calc(100%+2px)] object-cover desktop:hidden"
          />
        ) : null}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn(
              'absolute inset-[-1px] h-[calc(100%+2px)] w-[calc(100%+2px)] object-cover',
              imageSrcMobile ? 'hidden desktop:block' : undefined,
            )}
          />
        ) : null}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--color-brand-primary)_90%,black)] via-[color-mix(in_srgb,var(--color-brand-primary)_35%,transparent)] to-transparent"
          aria-hidden="true"
        />
      </>
    ) : (
      <DefaultFeaturedMedia />
    )}

    <div className="relative z-10 flex flex-col gap-[var(--space-8)] desktop:gap-[var(--space-16)]">
      <ChooseUsFeaturedTitle title={title} titleBreakBefore={titleBreakBefore} />
      <p className={CHOOSE_US_FEATURED_DESCRIPTION_CLASS}>{description}</p>
    </div>
  </article>
);

ChooseUsFeaturedCard.displayName = 'ChooseUsFeaturedCard';
