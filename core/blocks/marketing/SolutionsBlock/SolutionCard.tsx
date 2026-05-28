import React from 'react';
import {
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  SOLUTION_ARROW_BUTTON_CLASS,
  SOLUTION_CATEGORY_PILL_CLASS,
  SOLUTION_META_PILL_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { ArrowUpRightIcon, SolutionCategoryIcon } from './SolutionsBlockIcons';
import type { SolutionItem } from './SolutionsBlock.types';

export interface SolutionCardProps extends SolutionItem {
  className?: string;
}

const CATEGORY_PILL_CLASS = SOLUTION_CATEGORY_PILL_CLASS;

const META_PILL_CLASS = SOLUTION_META_PILL_CLASS;

const CARD_SHELL_CLASS = cn(
  'group relative flex h-full w-full min-w-0 cursor-pointer overflow-hidden',
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'transition-[border-color,box-shadow] duration-200 ease-out',
  'hover:border-transparent',
  'no-underline text-inherit',
);

const ARROW_BUTTON_CLASS = SOLUTION_ARROW_BUTTON_CLASS;

const CATEGORY_ICON_CLASS = cn(
  'h-[var(--space-16)] w-[var(--space-16)] text-[var(--color-brand-primary)]',
  'transition-colors duration-200',
  'desktop:group-hover:text-[var(--color-brand-primary)]',
);

function SolutionCardCover({
  imageSrc,
  imageAlt,
  cover,
}: Pick<SolutionItem, 'imageSrc' | 'imageAlt' | 'cover'>) {
  return (
    <>
      <div
        className={cn(
          'absolute inset-0 z-0 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-hover)]',
          'opacity-[0.08] transition-opacity duration-200',
          'desktop:group-hover:opacity-100',
        )}
        aria-hidden="true"
      />
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt ?? ''}
          className={cn(
            'absolute inset-0 z-[1] h-full w-full object-cover',
            'opacity-[0.22] transition-opacity duration-200',
            'desktop:group-hover:opacity-70 desktop:group-hover:mix-blend-overlay',
          )}
        />
      ) : null}
      {cover ? (
        <div
          className={cn(
            'absolute inset-0 z-[1] opacity-0 transition-opacity duration-200',
            'desktop:group-hover:opacity-100',
          )}
        >
          {cover}
        </div>
      ) : null}
    </>
  );
}

function SolutionCardBody({ item }: { item: SolutionItem }) {
  const bodyLines = item.highlights ?? (item.description ? [item.description] : []);

  return (
    <>
      <div className={CATEGORY_PILL_CLASS}>
        {item.categoryIcon ?? <SolutionCategoryIcon className={CATEGORY_ICON_CLASS} />}
        <span>{item.category}</span>
      </div>

      <h3
        className={cn(
          'm-0 mt-[var(--space-section-stack-m)] font-medium text-[var(--color-text-primary)]',
          'text-style-h3 min-[1024px]:text-style-h4',
          'transition-colors duration-200',
          'desktop:group-hover:text-[var(--color-text-on-brand)]',
        )}
      >
        {item.title}
      </h3>

      {bodyLines.length > 0 ? (
        <div
          className={cn(
            'mt-[var(--space-section-stack-m)] overflow-hidden text-[var(--color-text-secondary)]',
            'text-style-body-sm desktop:min-h-[var(--space-80)] desktop:text-style-body',
            'desktop:transition-opacity desktop:duration-200',
            'desktop:group-hover:pointer-events-none desktop:group-hover:opacity-0',
          )}
        >
          {bodyLines.map((line, index) => (
            <p key={`${line}-${index}`} className="m-0">
              {line}
            </p>
          ))}
        </div>
      ) : null}
    </>
  );
}

function SolutionCardFooter({ client, date }: Pick<SolutionItem, 'client' | 'date'>) {
  return (
    <div className="flex w-full items-end justify-between gap-[var(--space-section-stack-s)]">
      <div className="flex min-w-0 flex-wrap items-center gap-[var(--space-2)]">
        <span className={META_PILL_CLASS}>{client}</span>
        <time className={META_PILL_CLASS} dateTime={date}>
          {date}
        </time>
      </div>
      <span className={ARROW_BUTTON_CLASS} aria-hidden="true">
        <ArrowUpRightIcon className="h-[var(--space-16)] w-[var(--space-16)]" />
      </span>
    </div>
  );
}

export const SolutionCard: React.FC<SolutionCardProps> = (props) => {
  const {
    category,
    categoryIcon,
    title,
    description,
    highlights,
    client,
    date,
    href,
    imageSrc,
    imageAlt,
    cover,
    className,
    id,
  } = props;

  const item: SolutionItem = {
    id,
    category,
    categoryIcon,
    title,
    description,
    highlights,
    client,
    date,
    href,
    imageSrc,
    imageAlt,
    cover,
  };

  const content = (
    <>
      <SolutionCardCover imageSrc={imageSrc} imageAlt={imageAlt} cover={cover} />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-[2] bg-[var(--color-surface-1)]',
          'opacity-100 transition-opacity duration-200',
          'desktop:group-hover:opacity-0',
        )}
        aria-hidden="true"
      />
      <div className="relative z-[3] grid h-full min-h-0 grid-rows-[1fr_auto]">
        <div className="min-h-0">
          <SolutionCardBody item={item} />
        </div>
        <div className="mt-[var(--space-section-content-m)] self-end">
          <SolutionCardFooter client={client} date={date} />
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cn(CARD_SHELL_CLASS, className)}>
        {content}
      </a>
    );
  }

  return <article className={cn(CARD_SHELL_CLASS, className)}>{content}</article>;
};

SolutionCard.displayName = 'SolutionCard';
