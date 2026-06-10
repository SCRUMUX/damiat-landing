import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { SectionShell } from '../../_shared/SectionShell';
import {
  CASE_STUDY_CONTACT_COPY_CLASS,
  CASE_STUDY_CONTACT_DESCRIPTION_CLASS,
  CASE_STUDY_CONTACT_FORM_WRAP_CLASS,
  CASE_STUDY_CONTACT_SPLIT_CLASS,
} from '../../_shared/blockLayout';
import { CaseStudyContactForm } from './CaseStudyContactForm';
import type { CaseStudyContactBlockProps } from './CaseStudyContactBlock.types';

export type {
  CaseStudyContactBlockProps,
  CaseStudyContactFormLabels,
  CaseStudyContactFormValues,
} from './CaseStudyContactBlock.types';

export const CaseStudyContactBlock: React.FC<CaseStudyContactBlockProps> = ({
  title = 'Остались вопросы по кейсу?',
  description = 'Оставьте контакты — расскажем, как решения DAMIAT снижают потери при хранении картофеля.',
  className,
  ...formProps
}) => (
  <SectionShell
    recipe="section.case-contact"
    appearance="muted"
    className={className}
    aria-label="Case study contact"
  >
    <div className={CASE_STUDY_CONTACT_SPLIT_CLASS}>
      <div className={CASE_STUDY_CONTACT_COPY_CLASS}>
        <h2 className="m-0 max-w-[var(--space-640)] text-balance font-medium text-style-h0 text-[var(--color-text-primary)]">
          {title}
        </h2>
        {description ? <p className={CASE_STUDY_CONTACT_DESCRIPTION_CLASS}>{description}</p> : null}
      </div>

      <div className={cn(CASE_STUDY_CONTACT_FORM_WRAP_CLASS)}>
        <CaseStudyContactForm {...formProps} />
      </div>
    </div>
  </SectionShell>
);

CaseStudyContactBlock.displayName = 'CaseStudyContactBlock';
