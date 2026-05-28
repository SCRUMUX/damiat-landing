import React from 'react';
import { BLOG_CARD_CLASS, BLOCK_BLOG_ARROW_LINK_CLASS, BLOCK_BLOG_DATE_PILL_CLASS, BLOCK_CARD_MEDIA_CLASS } from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { BlogArrowUpRightIcon } from './BlogBlockIcons';
import type { BlogPostItem } from './BlogBlock.types';

export interface BlogPostCardProps extends BlogPostItem {
  className?: string;
}

const DATE_PILL_CLASS = BLOCK_BLOG_DATE_PILL_CLASS;

const ARROW_LINK_CLASS = BLOCK_BLOG_ARROW_LINK_CLASS;

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  excerpt,
  date,
  href,
  imageSrc,
  imageAlt,
  cover,
  className,
}) => {
  const media = cover ?? (
    imageSrc ? (
      <img
        src={imageSrc}
        alt={imageAlt ?? title}
        className={BLOCK_CARD_MEDIA_CLASS}
      />
    ) : (
      <div
        className={cn(BLOCK_CARD_MEDIA_CLASS, 'bg-[var(--color-surface-2)]')}
        aria-hidden="true"
      />
    )
  );

  const footer = (
    <div className="flex shrink-0 items-center justify-between">
      <time className={DATE_PILL_CLASS} dateTime={date}>
        {date}
      </time>
      {href ? (
        <a href={href} className={ARROW_LINK_CLASS} aria-label={`Читать: ${title}`}>
          <BlogArrowUpRightIcon />
        </a>
      ) : (
        <span className={ARROW_LINK_CLASS} aria-hidden="true">
          <BlogArrowUpRightIcon />
        </span>
      )}
    </div>
  );

  const body = (
    <>
      {media}
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          'mt-[var(--space-section-content-m)] px-[var(--space-3)] min-[1024px]:px-[var(--space-section-content-m)]',
        )}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <h3 className="m-0 font-medium text-style-h4 min-[1024px]:text-style-h3">{title}</h3>
          <p
            className={cn(
              'm-0 mt-[var(--space-section-stack-s)] line-clamp-5 text-style-body-sm text-[var(--color-text-secondary)]',
              'min-[1024px]:mt-[var(--space-section-stack-m)] min-[1024px]:text-style-body',
            )}
          >
            {excerpt}
          </p>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[var(--space-40)] bg-gradient-to-t from-[var(--color-surface-1)] to-transparent"
            aria-hidden="true"
          />
        </div>
        {footer}
      </div>
    </>
  );

  return <article className={cn(BLOG_CARD_CLASS, className)}>{body}</article>;
};

BlogPostCard.displayName = 'BlogPostCard';
