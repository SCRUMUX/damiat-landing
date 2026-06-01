import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  WHY_US_DECORATIVE_HIGHLIGHT_CLASS,
  WHY_US_FEATURED_CLASS,
  WHY_US_FEATURED_DESCRIPTION_CLASS,
  WHY_US_FEATURED_MEDIA_SCRIM_CLASS,
  WHY_US_FEATURED_PRIMARY_CLASS,
  WHY_US_FEATURED_TITLE_CLASS,
} from '../../_shared/blockLayout';
import { DEMO_PALETTE } from '../demo-assets/demoMediaPalette';
import type { WhyUsFeaturedItem } from './WhyUsBlock.types';

function WhyUsFeaturedTitle({
  title,
  titleBreakBefore,
  titleClassName,
}: Pick<WhyUsFeaturedItem, 'title' | 'titleBreakBefore'> & { titleClassName?: string }) {
  if (!titleBreakBefore || !title.includes(titleBreakBefore)) {
    return <div className={cn(WHY_US_FEATURED_TITLE_CLASS, titleClassName)}>{title}</div>;
  }

  const [before, after] = title.split(titleBreakBefore);

  return (
    <div className={cn(WHY_US_FEATURED_TITLE_CLASS, titleClassName)}>
      {before}
      <br className="min-[1024px]:hidden" />
      {titleBreakBefore}
      {after}
    </div>
  );
}

function DefaultFeaturedMedia() {
  return (
    <div className="absolute inset-[-1px] h-[101%] w-[101%]" aria-hidden="true">
      <div className="absolute inset-0 bg-[var(--color-brand-primary)]" />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-brand-hover) 70%, black) 0%, var(--color-brand-primary) 45%, color-mix(in srgb, var(--color-brand-primary) 60%, transparent) 100%)',
        }}
      />
      <div
        className={WHY_US_DECORATIVE_HIGHLIGHT_CLASS}
        style={{ background: `color-mix(in srgb, ${DEMO_PALETTE.white} 35%, var(--color-brand-hover))` }}
      />
      <svg
        viewBox="0 0 200 200"
        fill="none"
        className="absolute bottom-[-10%] right-[-5%] h-[75%] w-[75%] opacity-35"
      >
        <path d="M40 120L100 40L160 120L100 200Z" fill={DEMO_PALETTE.white} opacity="0.55" />
        <path d="M100 40L160 120V160L100 200L40 160V120Z" fill={DEMO_PALETTE.white} opacity="0.35" />
      </svg>
    </div>
  );
}

export interface WhyUsFeaturedCardProps extends WhyUsFeaturedItem {
  className?: string;
  titleClassName?: string;
}

export const WhyUsFeaturedCard: React.FC<WhyUsFeaturedCardProps> = ({
  title,
  titleBreakBefore,
  description,
  media,
  videoSrc,
  videoPoster,
  variant = 'neutral',
  className,
  titleClassName,
}) => {
  const isPrimary = variant === 'primary';

  return (
  <article
    className={cn(
      WHY_US_FEATURED_CLASS,
      isPrimary && WHY_US_FEATURED_PRIMARY_CLASS,
      className,
    )}
  >
    {media ? (
      <>
        {isPrimary ? <div className="absolute inset-0 bg-[var(--color-brand-primary)]" aria-hidden /> : null}
        <div className="absolute inset-[-1px] h-[101%] w-[101%]">{media}</div>
        {isPrimary ? <div className={WHY_US_FEATURED_MEDIA_SCRIM_CLASS} aria-hidden /> : null}
      </>
    ) : videoSrc ? (
      <video
        className="absolute inset-[-1px] h-[101%] w-[101%] object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={videoPoster}
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/webm" />
      </video>
    ) : isPrimary ? (
      <div className="absolute inset-0 bg-[var(--color-brand-primary)]" aria-hidden />
    ) : (
      <DefaultFeaturedMedia />
    )}

    <div className="relative z-10 min-[1024px]:max-w-[var(--space-350)]">
      <WhyUsFeaturedTitle
        title={title}
        titleBreakBefore={titleBreakBefore}
        titleClassName={titleClassName}
      />
      <p className={WHY_US_FEATURED_DESCRIPTION_CLASS}>{description}</p>
    </div>
  </article>
  );
};

WhyUsFeaturedCard.displayName = 'WhyUsFeaturedCard';
