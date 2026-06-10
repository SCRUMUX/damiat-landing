import React from 'react';
import {
  CASE_STUDY_BULLETS_CLASS,
  CASE_STUDY_PROSE_PARAGRAPH_CLASS,
  CASE_STUDY_SECTION_TITLE_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import type { CaseStudyImplementedBlockProps } from './CaseStudyImplementedBlock.types';

export type { CaseStudyImplementedBlockProps } from './CaseStudyImplementedBlock.types';

export const CaseStudyImplementedBlock: React.FC<CaseStudyImplementedBlockProps> = ({
  title = 'Что было реализовано?',
  intro,
  items,
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
    {intro ? <p className={CASE_STUDY_PROSE_PARAGRAPH_CLASS}>{intro}</p> : null}
    <ul className={CASE_STUDY_BULLETS_CLASS}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </section>
);

CaseStudyImplementedBlock.displayName = 'CaseStudyImplementedBlock';
