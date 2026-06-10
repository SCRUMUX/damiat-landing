import React from 'react';
import {
  CASE_STUDY_INLINE_STAT_LABEL_CLASS,
  CASE_STUDY_INLINE_STAT_VALUE_CLASS,
  CASE_STUDY_INLINE_STATS_GRID_CLASS,
  CASE_STUDY_SECTION_TITLE_CLASS,
  CASE_STUDY_STAT_CARD_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import type { CaseStudyInlineStatsBlockProps } from './CaseStudyInlineStatsBlock.types';

export type { CaseStudyInlineStatsBlockProps, CaseStudyInlineStat } from './CaseStudyInlineStatsBlock.types';

export const CaseStudyInlineStatsBlock: React.FC<CaseStudyInlineStatsBlockProps> = ({
  title = 'Бизнес-результаты',
  stats,
  sectionId,
  className,
}) => (
  <section
    id={sectionId}
    data-case-section={sectionId ? '' : undefined}
    className={cn(
      'flex w-full min-w-0 flex-col gap-[var(--space-section-content-m)] scroll-mt-[calc(var(--navbar-chrome-height,0px)+var(--space-section-stack-m))]',
      className,
    )}
    aria-label={title}
  >
    <h2 className={CASE_STUDY_SECTION_TITLE_CLASS}>{title}</h2>
    <div className={CASE_STUDY_INLINE_STATS_GRID_CLASS}>
      {stats.map((stat) => (
        <article key={stat.label} className={CASE_STUDY_STAT_CARD_CLASS}>
          <p className={CASE_STUDY_INLINE_STAT_VALUE_CLASS}>{stat.value}</p>
          <p className={CASE_STUDY_INLINE_STAT_LABEL_CLASS}>{stat.label}</p>
        </article>
      ))}
    </div>
  </section>
);

CaseStudyInlineStatsBlock.displayName = 'CaseStudyInlineStatsBlock';
