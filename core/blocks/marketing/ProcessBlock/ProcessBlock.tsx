import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import {
  PROCESS_STEPS_LIST_CLASS,
  PROCESS_TIMELINE_VIEWPORT_CLASS,
  PROCESS_TITLE_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { ProcessStep, ProcessTimelineTrack } from './ProcessStep';
import type { ProcessBlockProps } from './ProcessBlock.types';

export type { ProcessBlockProps, ProcessStepItem } from './ProcessBlock.types';

export const ProcessBlock: React.FC<ProcessBlockProps> = ({
  title = 'Как выглядит процесс',
  steps,
  className,
}) => {
  if (steps.length === 0) return null;

  return (
    <SectionShell
      recipe="section.process"
      appearance="base"
      className={cn(
        '!py-[var(--space-64)] min-[1024px]:!py-[var(--space-80)]',
        className,
      )}
      aria-label="Process"
    >
      <h2 className={PROCESS_TITLE_CLASS}>{title}</h2>

      <div className={PROCESS_TIMELINE_VIEWPORT_CLASS}>
        <ProcessTimelineTrack />
        <ol className={PROCESS_STEPS_LIST_CLASS}>
          {steps.map((step, index) => (
            <ProcessStep key={step.id ?? step.title} {...step} index={index} />
          ))}
        </ol>
      </div>
    </SectionShell>
  );
};

ProcessBlock.displayName = 'ProcessBlock';
