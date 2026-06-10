import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import {
  BLOG_DESKTOP_TRACK_CLASS,
  BLOG_DESKTOP_TRACK_VIEWPORT_CLASS,
  BLOG_HEADER_ROW_CLASS,
  BLOG_HEADER_TITLE_GROUP_CLASS,
  BLOG_SCROLL_STRIP_CLASS,
  BLOG_SCROLL_VIEWPORT_CLASS,
  BLOCK_BLOG_CHROME_CONTROL_CLASS,
  BLOCK_CHROME_ICON_CHIP_CLASS,
  BLOCK_CHROME_SQUARE_CONTROL_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { useMinBreakpoint } from '../../../hooks/useBreakpoint';
import { BlogChevronLeftIcon, BlogChevronRightIcon, BlogViewAllIcon } from './BlogBlockIcons';
import { BlogPostCard } from './BlogPostCard';
import type { BlogBlockProps } from './BlogBlock.types';

export type { BlogBlockProps, BlogPostItem, BlogViewAllAction } from './BlogBlock.types';

const BLOG_NAV_BUTTON_CLASS = cn(
  BLOCK_CHROME_SQUARE_CONTROL_CLASS,
  'h-[var(--space-40)] w-[var(--space-40)] shrink-0 text-[var(--color-text-primary)]',
  'hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-text-on-brand)]',
  'disabled:pointer-events-none disabled:opacity-40',
  'min-[1024px]:h-[var(--space-56)] min-[1024px]:w-[var(--space-56)]',
);

const BLOG_VIEW_ALL_CLASS = cn(
  BLOCK_BLOG_CHROME_CONTROL_CLASS,
  'min-h-[var(--space-56)] gap-[var(--space-section-stack-s)]',
  'px-[var(--space-inset-xl)] text-style-body text-[var(--color-text-primary)] no-underline',
  'min-[1024px]:min-h-[var(--space-56)]',
);

function BlogNavigation({
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--space-section-stack-s)' }} aria-label="Навигация по статьям">
      <button
        type="button"
        disabled={!canPrevious}
        onClick={onPrevious}
        aria-label="Предыдущая статья"
        className={BLOG_NAV_BUTTON_CLASS}
      >
        <BlogChevronLeftIcon />
      </button>
      <button
        type="button"
        disabled={!canNext}
        onClick={onNext}
        aria-label="Следующая статья"
        className={BLOG_NAV_BUTTON_CLASS}
      >
        <BlogChevronRightIcon />
      </button>
    </div>
  );
}

function BlogCardList({ posts }: Pick<BlogBlockProps, 'posts'>) {
  return (
    <>
      {posts.map((post) => (
        <div key={post.id ?? post.title} data-blog-card className="shrink-0">
          <BlogPostCard {...post} />
        </div>
      ))}
    </>
  );
}

export const BlogBlock: React.FC<BlogBlockProps> = ({
  title = 'Блог',
  subtitle,
  posts,
  viewAll,
  showNavigation = true,
  className,
}) => {
  const isDesktop = useMinBreakpoint('desktop');
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepPx, setStepPx] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  const measureDesktopMetrics = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-blog-card]');
    if (!viewport || !track || !card) return;

    const gap = parseInt(getComputedStyle(track).gap || '12', 10) || 12;
    const step = card.offsetWidth + gap;
    const visibleCount = Math.max(1, Math.floor((viewport.clientWidth + gap) / step));

    setStepPx(step);
    setMaxIndex(Math.max(0, posts.length - visibleCount));
    setActiveIndex((index) => Math.min(index, Math.max(0, posts.length - visibleCount)));
  }, [posts.length]);

  useEffect(() => {
    if (!isDesktop) return undefined;

    measureDesktopMetrics();
    window.addEventListener('resize', measureDesktopMetrics);
    return () => window.removeEventListener('resize', measureDesktopMetrics);
  }, [isDesktop, measureDesktopMetrics, posts.length]);

  const canPrevious = activeIndex > 0;
  const canNext = activeIndex < maxIndex;

  const goPrevious = useCallback(() => {
    setActiveIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((index) => Math.min(maxIndex, index + 1));
  }, [maxIndex]);

  if (posts.length === 0) return null;

  const viewAllLabel = viewAll?.label ?? 'Смотреть все статьи';

  return (
    <SectionShell recipe="section.blog" appearance="muted" className={className} aria-label="Blog">
      <div className={BLOG_HEADER_ROW_CLASS}>
        <div className={BLOG_HEADER_TITLE_GROUP_CLASS}>
          <h2 className="m-0 font-medium text-style-h1 text-[var(--color-text-primary)]">{title}</h2>
          {subtitle ? (
            <p className="m-0 max-w-[var(--space-545)] text-style-body text-[var(--color-text-secondary)] min-[1024px]:text-style-body-lg">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="hidden items-center min-[1024px]:flex" style={{ gap: 'var(--space-section-content-m)' }}>
          {viewAll ? (
            <a href={viewAll.href} className={BLOG_VIEW_ALL_CLASS}>
              <span className={BLOCK_CHROME_ICON_CHIP_CLASS}>
                <BlogViewAllIcon />
              </span>
              {viewAllLabel}
            </a>
          ) : null}
          {showNavigation ? (
            <BlogNavigation
              onPrevious={goPrevious}
              onNext={goNext}
              canPrevious={canPrevious}
              canNext={canNext}
            />
          ) : null}
        </div>
      </div>

      <div className={BLOG_SCROLL_VIEWPORT_CLASS}>
        {isDesktop ? (
          <div ref={viewportRef} className={BLOG_DESKTOP_TRACK_VIEWPORT_CLASS}>
            <div
              ref={trackRef}
              className={BLOG_DESKTOP_TRACK_CLASS}
              style={{ transform: stepPx ? `translateX(-${activeIndex * stepPx}px)` : undefined }}
            >
              <BlogCardList posts={posts} />
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className={BLOG_SCROLL_STRIP_CLASS}>
            <BlogCardList posts={posts} />
          </div>
        )}
      </div>
    </SectionShell>
  );
};

BlogBlock.displayName = 'BlogBlock';
