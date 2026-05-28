import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  PROCESS_STEP_CARD_CLASS,
  PROCESS_STEP_DESCRIPTION_CLASS,
  PROCESS_STEP_ITEM_CLASS,
  PROCESS_STEP_MARKER_CLASS,
  PROCESS_STEP_TITLE_CLASS,
  PROCESS_TIMELINE_TRACK_BASE_CLASS,
  PROCESS_TIMELINE_TRACK_PROGRESS_CLASS,
} from '../../_shared/blockLayout';
import { ProcessStepDotIcon, ProcessStepNumber } from './ProcessBlockIcons';
import type { ProcessStepItem } from './ProcessBlock.types';

const TRACK_BASE_STYLE = {
  background:
    'linear-gradient(180deg, color-mix(in srgb, var(--color-border-base) 20%, transparent) 0%, var(--color-border-base) 48.08%, color-mix(in srgb, var(--color-border-base) 20%, transparent) 100%)',
} as const;

const TRACK_PROGRESS_STYLE = {
  background:
    'linear-gradient(180deg, var(--color-surface-1) 0%, var(--color-brand-primary) 100%)',
} as const;

const TRACK_PROGRESS_DESKTOP_STYLE = {
  background:
    'linear-gradient(90deg, var(--color-surface-1) 0%, var(--color-brand-primary) 100%)',
} as const;

function ProcessStepTitle({
  title,
  titleBreakBefore,
}: Pick<ProcessStepItem, 'title' | 'titleBreakBefore'>) {
  if (!titleBreakBefore || !title.includes(titleBreakBefore)) {
    return <h3 className={PROCESS_STEP_TITLE_CLASS}>{title}</h3>;
  }

  const [before, after] = title.split(titleBreakBefore);

  return (
    <h3 className={PROCESS_STEP_TITLE_CLASS}>
      {before}
      <br className="max-lg:hidden" />
      {titleBreakBefore}
      {after}
    </h3>
  );
}

export interface ProcessStepProps extends ProcessStepItem {
  index: number;
  className?: string;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({
  number,
  title,
  titleBreakBefore,
  description,
  index,
  className,
}) => {
  const stepNumber = number ?? String(index + 1).padStart(2, '0');

  return (
    <li className={cn(PROCESS_STEP_ITEM_CLASS, className)}>
      <div className={PROCESS_STEP_MARKER_CLASS}>
        <ProcessStepDotIcon />
        <ProcessStepNumber value={stepNumber} />
      </div>

      <div className={PROCESS_STEP_CARD_CLASS}>
        <ProcessStepTitle title={title} titleBreakBefore={titleBreakBefore} />
        <p className={PROCESS_STEP_DESCRIPTION_CLASS}>{description}</p>
      </div>
    </li>
  );
};

ProcessStep.displayName = 'ProcessStep';

export function ProcessTimelineTrack() {
  return (
    <>
      <div
        className={cn(PROCESS_TIMELINE_TRACK_BASE_CLASS, 'min-[1024px]:hidden')}
        style={TRACK_BASE_STYLE}
        aria-hidden="true"
      />
      <div
        className={cn(PROCESS_TIMELINE_TRACK_PROGRESS_CLASS, 'min-[1024px]:hidden')}
        style={TRACK_PROGRESS_STYLE}
        aria-hidden="true"
      />
      <div
        className={cn(PROCESS_TIMELINE_TRACK_BASE_CLASS, 'hidden min-[1024px]:block')}
        style={{
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--color-border-base) 20%, transparent) 0%, var(--color-border-base) 48.08%, color-mix(in srgb, var(--color-border-base) 20%, transparent) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className={cn(PROCESS_TIMELINE_TRACK_PROGRESS_CLASS, 'hidden min-[1024px]:block')}
        style={TRACK_PROGRESS_DESKTOP_STYLE}
        aria-hidden="true"
      />
    </>
  );
}
