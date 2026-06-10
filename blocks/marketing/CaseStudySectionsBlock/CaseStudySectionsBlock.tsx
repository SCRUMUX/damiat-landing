import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import {
  CASE_STUDY_BULLETS_CLASS,
  CASE_STUDY_QUOTE_ATTRIBUTION_CLASS,
  CASE_STUDY_QUOTE_CLASS,
  CASE_STUDY_SECTION_BODY_CLASS,
  CASE_STUDY_SECTION_PARAGRAPH_CLASS,
  CASE_STUDY_SECTION_TITLE_CLASS,
  CASE_STUDY_SECTIONS_STACK_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import type { CaseStudySectionsBlockProps } from './CaseStudySectionsBlock.types';

export type {
  CaseStudySectionsBlockProps,
  CaseStudySection,
  CaseStudyQuote,
} from './CaseStudySectionsBlock.types';

function CaseStudySectionsContent({ sections }: Pick<CaseStudySectionsBlockProps, 'sections'>) {
  return (
    <div className={CASE_STUDY_SECTIONS_STACK_CLASS}>
      {sections.map((section) => {
        const sectionKey = section.id ?? section.title;
        return (
          <article
            key={sectionKey}
            id={section.id}
            data-case-section={section.id ? '' : undefined}
            className={cn(
              'flex w-full min-w-0 flex-col gap-[var(--space-section-content-m)]',
              section.id &&
                'scroll-mt-[calc(var(--navbar-chrome-height,0px)+var(--space-section-stack-m))]',
            )}
          >
            <h2 className={CASE_STUDY_SECTION_TITLE_CLASS}>{section.title}</h2>

            <div className={CASE_STUDY_SECTION_BODY_CLASS}>
              {(section.paragraphs ?? []).map((paragraph) => (
                <p key={paragraph} className={CASE_STUDY_SECTION_PARAGRAPH_CLASS}>
                  {paragraph}
                </p>
              ))}

              {section.bullets && section.bullets.length > 0 ? (
                <ul className={CASE_STUDY_BULLETS_CLASS}>
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {section.quote ? (
                <blockquote className={CASE_STUDY_QUOTE_CLASS} cite="anonymous">
                  <p className="m-0">{section.quote.text}</p>
                  <footer className={CASE_STUDY_QUOTE_ATTRIBUTION_CLASS}>
                    {section.quote.attribution}
                  </footer>
                </blockquote>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export const CaseStudySectionsBlock: React.FC<CaseStudySectionsBlockProps> = ({
  sections,
  embedded = false,
  className,
}) => {
  const content = <CaseStudySectionsContent sections={sections} />;

  if (embedded) {
    return <div className={cn('w-full min-w-0', className)}>{content}</div>;
  }

  return (
    <SectionShell
      recipe="section.case-sections"
      appearance="surface"
      className={className}
      aria-label="Case study narrative"
    >
      {content}
    </SectionShell>
  );
};

CaseStudySectionsBlock.displayName = 'CaseStudySectionsBlock';
