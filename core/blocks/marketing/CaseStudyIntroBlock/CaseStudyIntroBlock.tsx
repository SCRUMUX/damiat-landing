import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import {
  CASE_STUDY_HIGHLIGHT_CELL_CLASS,
  CASE_STUDY_HIGHLIGHT_LABEL_CLASS,
  CASE_STUDY_HIGHLIGHT_VALUE_CLASS,
  CASE_STUDY_HIGHLIGHTS_GRID_CLASS,
  CASE_STUDY_PROSE_CLASS,
  CASE_STUDY_PROSE_PARAGRAPH_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import type { CaseStudyIntroBlockProps } from './CaseStudyIntroBlock.types';

export type { CaseStudyIntroBlockProps, CaseStudyHighlight } from './CaseStudyIntroBlock.types';

function CaseStudyIntroContent({
  leadParagraphs,
  highlights = [],
  trailParagraphs = [],
}: Pick<CaseStudyIntroBlockProps, 'leadParagraphs' | 'highlights' | 'trailParagraphs'>) {
  return (
    <>
      {leadParagraphs && leadParagraphs.length > 0 ? (
        <div className={CASE_STUDY_PROSE_CLASS}>
          {leadParagraphs.map((paragraph) => (
            <p key={paragraph} className={CASE_STUDY_PROSE_PARAGRAPH_CLASS}>
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {highlights.length > 0 ? (
        <div className={CASE_STUDY_HIGHLIGHTS_GRID_CLASS}>
          {highlights.map((highlight) => (
            <div key={highlight.label} className={CASE_STUDY_HIGHLIGHT_CELL_CLASS}>
              <p className={CASE_STUDY_HIGHLIGHT_VALUE_CLASS}>{highlight.value}</p>
              <p className={CASE_STUDY_HIGHLIGHT_LABEL_CLASS}>{highlight.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      {trailParagraphs && trailParagraphs.length > 0 ? (
        <div className={CASE_STUDY_PROSE_CLASS}>
          {trailParagraphs.map((paragraph) => (
            <p key={paragraph} className={CASE_STUDY_PROSE_PARAGRAPH_CLASS}>
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </>
  );
}

export const CaseStudyIntroBlock: React.FC<CaseStudyIntroBlockProps> = ({
  leadParagraphs: leadParagraphsProp,
  paragraphs,
  highlights = [],
  trailParagraphs = [],
  embedded = false,
  className,
}) => {
  const leadParagraphs = leadParagraphsProp ?? paragraphs ?? [];
  const content = (
    <CaseStudyIntroContent
      leadParagraphs={leadParagraphs}
      highlights={highlights}
      trailParagraphs={trailParagraphs}
    />
  );

  if (embedded) {
    return <div className={cn('flex w-full min-w-0 flex-col gap-[var(--space-section-content-l)]', className)}>{content}</div>;
  }

  return (
    <SectionShell
      recipe="section.case-intro"
      appearance="surface"
      className={className}
      aria-label="Case study introduction"
    >
      {content}
    </SectionShell>
  );
};

CaseStudyIntroBlock.displayName = 'CaseStudyIntroBlock';
