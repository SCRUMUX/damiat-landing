import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SectionShell } from '@ai-ds/core/blocks/_shared/SectionShell';
import { BlockAction } from '@ai-ds/core/blocks/_shared/BlockAction';
import {
  BLOG_DESKTOP_TRACK_CLASS,
  BLOG_DESKTOP_TRACK_VIEWPORT_CLASS,
  BLOG_HEADER_ROW_CLASS,
  BLOG_HEADER_TITLE_GROUP_CLASS,
  BLOG_SCROLL_STRIP_CLASS,
  BLOG_SCROLL_VIEWPORT_CLASS,
} from '@ai-ds/core/blocks/_shared/blockLayout';
import { cn } from '@ai-ds/core/shared';
import { useMinBreakpoint } from '@ai-ds/core/hooks/useBreakpoint';
import { BlogChevronLeftIcon, BlogChevronRightIcon } from '@ai-ds/core/blocks/BlogBlock/BlogBlockIcons';
import { CaseStudyCard } from './CaseStudyCard';
import type { DamiatCaseStudiesBlockProps } from './DamiatCaseStudiesBlock.types';

export type {
  CaseStudyItem,
  CaseStudyStat,
  CaseStudiesViewAllAction,
  DamiatCaseStudiesBlockProps,
} from './DamiatCaseStudiesBlock.types';

const caseNavButtonClass = (onBrand: boolean) =>
  cn(
    'inline-flex items-center justify-center rounded-[var(--radius-pill)] transition-colors duration-150',
    'h-[var(--space-40)] w-[var(--space-40)] shrink-0',
    'disabled:pointer-events-none disabled:opacity-40',
    'min-[1024px]:h-[var(--space-56)] min-[1024px]:w-[var(--space-56)]',
    onBrand
      ? 'border border-solid border-[var(--color-text-on-brand)]/40 bg-transparent text-[var(--color-text-on-brand)] hover:bg-[var(--color-text-on-brand)]/10'
      : 'border border-solid border-[var(--color-border-base)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]',
  );

function CaseStudiesNavigation({
  onPrevious,
  onNext,
  canPrevious,
  canNext,
  onBrand,
}: {
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
  onBrand: boolean;
}) {
  return (
    <div
      className="flex items-center"
      style={{ gap: 'var(--space-section-stack-s)' }}
      aria-label="Навигация по кейсам"
    >
      <button
        type="button"
        disabled={!canPrevious}
        onClick={onPrevious}
        aria-label="Предыдущий кейс"
        className={caseNavButtonClass(onBrand)}
      >
        <BlogChevronLeftIcon />
      </button>
      <button
        type="button"
        disabled={!canNext}
        onClick={onNext}
        aria-label="Следующий кейс"
        className={caseNavButtonClass(onBrand)}
      >
        <BlogChevronRightIcon />
      </button>
    </div>
  );
}

const CASE_STUDIES_DESKTOP_VIEWPORT_CLASS = cn(
  BLOG_DESKTOP_TRACK_VIEWPORT_CLASS,
  'py-[var(--space-4)]',
);

const CASE_STUDIES_CARD_SLOT_CLASS = 'shrink-0 py-[var(--space-4)]';

function CaseStudyCardList({ cases }: Pick<DamiatCaseStudiesBlockProps, 'cases'>) {
  return (
    <>
      {cases.map((item) => (
        <div key={item.id ?? item.title} data-case-study-card className={CASE_STUDIES_CARD_SLOT_CLASS}>
          <CaseStudyCard {...item} />
        </div>
      ))}
    </>
  );
}

export const DamiatCaseStudiesBlock: React.FC<DamiatCaseStudiesBlockProps> = ({
  title = 'Истории внедрения',
  subtitle,
  cases,
  viewAll,
  showNavigation = true,
  embeddedInPhotoHero = false,
  className,
}) => {
  const isDesktop = useMinBreakpoint('desktop');
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepPx, setStepPx] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  const measureDesktopMetrics = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-case-study-card]');
    if (!viewport || !track || !card) return;

    const gap = parseInt(getComputedStyle(track).gap || '12', 10) || 12;
    const step = card.offsetWidth + gap;
    const visibleCount = Math.max(1, Math.floor((viewport.clientWidth + gap) / step));

    setStepPx(step);
    setMaxIndex(Math.max(0, cases.length - visibleCount));
    setActiveIndex((index) => Math.min(index, Math.max(0, cases.length - visibleCount)));
  }, [cases.length]);

  useEffect(() => {
    if (!isDesktop) return undefined;

    measureDesktopMetrics();
    window.addEventListener('resize', measureDesktopMetrics);
    return () => window.removeEventListener('resize', measureDesktopMetrics);
  }, [isDesktop, measureDesktopMetrics, cases.length]);

  const canPrevious = activeIndex > 0;
  const canNext = activeIndex < maxIndex;

  const goPrevious = useCallback(() => {
    setActiveIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((index) => Math.min(maxIndex, index + 1));
  }, [maxIndex]);

  if (cases.length === 0) return null;

  const viewAllLabel = viewAll?.label ?? 'Все истории';
  const onBrand = embeddedInPhotoHero;

  return (
    <SectionShell
      recipe="section.case-studies"
      appearance="brand"
      className={cn(onBrand && '!bg-transparent', className)}
      aria-label="Case studies"
    >
      <div className={BLOG_HEADER_ROW_CLASS}>
        <div className={BLOG_HEADER_TITLE_GROUP_CLASS}>
          <h2
            className={cn(
              'm-0 font-medium text-style-h1',
              onBrand ? 'text-[var(--color-text-on-brand)]' : 'text-[var(--color-text-primary)]',
            )}
          >
            {title}
          </h2>
          {subtitle ? (
            <p
              className={cn(
                'm-0 max-w-[var(--space-545)] text-style-body min-[1024px]:text-style-body-lg',
                onBrand
                  ? 'text-[var(--color-text-on-brand)] opacity-85'
                  : 'text-[var(--color-text-secondary)]',
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        <div
          className="hidden items-center min-[1024px]:flex"
          style={{ gap: 'var(--space-section-content-m)' }}
        >
          {viewAll ? (
            <BlockAction
              label={viewAllLabel}
              href={viewAll.href}
              appearance="outline"
              size="lg"
              onBrand={onBrand}
            />
          ) : null}
          {showNavigation ? (
            <CaseStudiesNavigation
              onPrevious={goPrevious}
              onNext={goNext}
              canPrevious={canPrevious}
              canNext={canNext}
              onBrand={onBrand}
            />
          ) : null}
        </div>
      </div>

      <div className={BLOG_SCROLL_VIEWPORT_CLASS}>
        {isDesktop ? (
          <div ref={viewportRef} className={CASE_STUDIES_DESKTOP_VIEWPORT_CLASS}>
            <div
              ref={trackRef}
              className={BLOG_DESKTOP_TRACK_CLASS}
              style={{ transform: stepPx ? `translateX(-${activeIndex * stepPx}px)` : undefined }}
            >
              <CaseStudyCardList cases={cases} />
            </div>
          </div>
        ) : (
          <div className={BLOG_SCROLL_STRIP_CLASS}>
            <CaseStudyCardList cases={cases} />
          </div>
        )}
      </div>
    </SectionShell>
  );
};

DamiatCaseStudiesBlock.displayName = 'DamiatCaseStudiesBlock';
