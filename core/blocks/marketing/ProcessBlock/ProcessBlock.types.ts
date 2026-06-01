import type React from 'react';

export interface ProcessStepItem {
  id?: string;
  /** Step label — defaults to zero-padded index (01, 02…). */
  number?: string;
  title: string;
  titleBreakBefore?: string;
  description: string;
}

export interface ProcessBlockProps {
  title?: string;
  steps: ProcessStepItem[];
  className?: string;
  /** Step card titles — brand primary on DAMIAT device block. */
  headingAppearance?: 'default' | 'primary';
}
