import React from 'react';
import {
  BLOG_CARD_CLASS,
  BLOCK_CARD_MEDIA_CLASS,
  BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS,
} from '@ai-ds/core/blocks/_shared/blockLayout';
import { cn } from '@ai-ds/core/shared';
import { BlogArrowUpRightIcon } from '@ai-ds/core/blocks/BlogBlock/BlogBlockIcons';
import type { CaseStudyItem } from './DamiatCaseStudiesBlock.types';

export interface CaseStudyCardProps extends CaseStudyItem {
  className?: string;
}

/** Taller than blog card — room for 2×2 metrics + footer. */
const CASE_CARD_SHELL_CLASS = cn(
  BLOG_CARD_CLASS,
  'h-[var(--space-488)] min-[1024px]:h-[var(--space-584)]',
  'transition-[box-shadow] duration-200 ease-out',
);

const CASE_CARD_LINK_CLASS = cn(
  CASE_CARD_SHELL_CLASS,
  'group cursor-pointer overflow-hidden no-underline text-inherit',
  'hover:shadow-elevation-2',
);

const CASE_CARD_TITLE_CLASS = cn(
  'm-0 line-clamp-2 text-left font-medium text-style-h4 min-[1024px]:text-style-h3',
  'min-h-[calc(var(--line-height-32)*2)] min-[1024px]:min-h-[calc(var(--line-height-36)*2)]',
  'text-[var(--color-text-on-brand)] drop-shadow-[0_1px_2px_color-mix(in_srgb,var(--core-gray-95)_35%,transparent)]',
);

const CASE_CARD_META_CLASS = cn(
  'm-0 line-clamp-2 text-left text-style-body-sm opacity-95 min-[1024px]:text-style-body',
  'min-h-[calc(var(--line-height-24)*2)]',
  'text-[var(--color-text-on-brand)] drop-shadow-[0_1px_2px_color-mix(in_srgb,var(--core-gray-95)_35%,transparent)]',
);

const CASE_CARD_BODY_CLASS = cn(
  'flex min-h-0 flex-1 flex-col',
  'mt-[var(--space-section-content-m)]',
  'px-[var(--space-inset-l)] pb-[var(--space-inset-l)] min-[1024px]:px-[var(--space-inset-xl)] min-[1024px]:pb-[var(--space-inset-xl)]',
);

const CASE_STAT_CELL_CLASS = cn(
  'flex min-h-[var(--space-80)] min-w-0 flex-col items-start justify-start gap-[var(--space-4)] text-left',
  'min-[1024px]:min-h-[var(--space-96)]',
);

const CASE_STAT_LABEL_CLASS = cn(
  'line-clamp-2 text-style-body-sm text-[var(--color-text-secondary)] min-[1024px]:text-style-body',
  'min-h-[calc(var(--line-height-24)*2)]',
);

const CASE_STAT_VALUE_CLASS = cn(
  'font-semibold tabular-nums text-style-h4 text-[var(--color-brand-primary)]',
  'min-[1024px]:text-style-h3',
);

const CASE_CARD_MEDIA_SCRIM_CLASS = cn(
  'pointer-events-none absolute inset-0',
  'bg-[color-mix(in_srgb,var(--color-brand-primary)_58%,var(--core-green-900))]',
  'mix-blend-multiply',
);

const CASE_CARD_MEDIA_GRADIENT_CLASS = cn(
  'pointer-events-none absolute inset-0',
  'bg-gradient-to-t',
  'from-[color-mix(in_srgb,var(--core-green-900)_92%,transparent)]',
  'via-[color-mix(in_srgb,var(--color-brand-primary)_52%,transparent)]',
  'to-[color-mix(in_srgb,var(--color-brand-hover)_18%,transparent)]',
);

function CaseStudyCardHeader({
  title,
  meta,
  imageSrc,
  imageAlt,
  imageObjectPosition,
  cover,
}: Pick<
  CaseStudyItem,
  'title' | 'meta' | 'imageSrc' | 'imageAlt' | 'imageObjectPosition' | 'cover'
>) {
  const hasPhoto = Boolean(cover ?? imageSrc);

  return (
    <div className={cn(BLOCK_CARD_MEDIA_CLASS, 'relative shrink-0 overflow-hidden')}>
      {cover ?? (
        imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt ?? title}
            className="absolute inset-0 h-full w-full object-cover saturate-[0.72] contrast-[1.08] brightness-[0.92]"
            style={{ objectPosition: imageObjectPosition ?? '50% 45%' }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-hover)]"
            aria-hidden
          />
        )
      )}

      {hasPhoto ? (
        <>
          <div className={CASE_CARD_MEDIA_SCRIM_CLASS} aria-hidden />
          <div className={CASE_CARD_MEDIA_GRADIENT_CLASS} aria-hidden />
        </>
      ) : null}

      <div className="relative z-10 flex h-full flex-col justify-between p-[var(--space-inset-m)] text-left">
        <span className="w-fit rounded-[var(--radius-medium)] bg-[var(--color-text-on-brand)]/15 px-[var(--space-8)] py-[var(--space-2)] text-style-caption-xs text-[var(--color-text-on-brand)] backdrop-blur-[2px]">
          История
        </span>
        <div className="mt-[var(--space-8)] flex flex-col gap-[var(--space-4)]">
          <h3 className={CASE_CARD_TITLE_CLASS}>{title}</h3>
          <p className={CASE_CARD_META_CLASS}>{meta}</p>
        </div>
      </div>
    </div>
  );
}

function CaseStudyCardContent({
  title,
  meta,
  stats,
  linked,
  imageSrc,
  imageAlt,
  imageObjectPosition,
  cover,
}: Pick<
  CaseStudyItem,
  'title' | 'meta' | 'stats' | 'imageSrc' | 'imageAlt' | 'imageObjectPosition' | 'cover'
> & { linked: boolean }) {
  return (
    <>
      <CaseStudyCardHeader
        title={title}
        meta={meta}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        imageObjectPosition={imageObjectPosition}
        cover={cover}
      />

      <div className={CASE_CARD_BODY_CLASS}>
        <ul
          className={cn(
            'm-0 grid list-none grid-cols-2 grid-rows-2 gap-x-[var(--space-12)] gap-y-[var(--space-12)] p-0',
            'min-[1024px]:gap-y-[var(--space-16)]',
          )}
        >
          {stats.map((stat) => (
            <li key={stat.label} className={CASE_STAT_CELL_CLASS}>
              <span className={CASE_STAT_VALUE_CLASS}>{stat.value}</span>
              <span className={CASE_STAT_LABEL_CLASS}>{stat.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex shrink-0 justify-end pt-[var(--space-section-stack-m)] min-[1024px]:pt-[var(--space-section-content-m)]">
          <span
            className={cn(
              BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS,
              linked &&
                'group-hover:border-[var(--color-brand-primary)] group-hover:bg-[var(--color-brand-primary)] group-hover:text-[var(--color-text-on-brand)]',
            )}
            aria-hidden="true"
          >
            <BlogArrowUpRightIcon />
          </span>
        </div>
      </div>
    </>
  );
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  title,
  meta,
  stats,
  href,
  imageSrc,
  imageAlt,
  imageObjectPosition,
  cover,
  className,
}) => {
  const contentProps = {
    title,
    meta,
    stats,
    imageSrc,
    imageAlt,
    imageObjectPosition,
    cover,
  };

  if (href) {
    return (
      <a
        href={href}
        className={cn(CASE_CARD_LINK_CLASS, className)}
        aria-label={`Подробнее об истории: ${title}`}
      >
        <CaseStudyCardContent {...contentProps} linked />
      </a>
    );
  }

  return (
    <article className={cn(CASE_CARD_SHELL_CLASS, className)}>
      <CaseStudyCardContent {...contentProps} linked={false} />
    </article>
  );
};

CaseStudyCard.displayName = 'CaseStudyCard';
