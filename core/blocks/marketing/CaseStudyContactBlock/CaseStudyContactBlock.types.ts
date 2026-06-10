import type React from 'react';

export interface CaseStudyContactFormLabels {
  name?: string;
  company?: string;
}

export interface CaseStudyContactFormValues {
  name: string;
  company: string;
  consent: boolean;
}

export interface CaseStudyContactBlockProps {
  title?: string;
  description?: string;
  submitLabel?: string;
  consentLabel?: React.ReactNode;
  labels?: CaseStudyContactFormLabels;
  values?: Partial<CaseStudyContactFormValues>;
  defaultValues?: Partial<CaseStudyContactFormValues>;
  onSubmit?: (values: CaseStudyContactFormValues) => void;
  onChange?: (values: CaseStudyContactFormValues) => void;
  className?: string;
}
