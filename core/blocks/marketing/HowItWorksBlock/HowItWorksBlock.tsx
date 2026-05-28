import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { BlockGrid } from '../../_shared/BlockGrid';
import { Paragraph } from '../../../components/primitives/Paragraph';

export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface HowItWorksBlockProps {
  title?: string;
  subtitle?: string;
  steps: HowItWorksStep[];
  className?: string;
}

export const HowItWorksBlock: React.FC<HowItWorksBlockProps> = ({
  title = 'How it works',
  subtitle,
  steps,
  className,
}) => (
  <SectionShell recipe="section.steps" className={className} aria-label="How it works">
    <BlockSectionHeader title={title} subtitle={subtitle} />
    <BlockGrid columns={Math.min(steps.length, 4) as 1 | 2 | 3 | 4}>
      {steps.map((step, index) => (
        <div
          key={step.title}
          className="flex flex-col"
          style={{ gap: 'var(--space-section-stack-m)' }}
        >
          <span
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] text-style-body-sm font-semibold"
            style={{
              width: 'var(--space-40)',
              height: 'var(--space-40)',
            }}
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <Paragraph size="md" className="m-0 font-semibold text-[var(--color-text-primary)]">
            {step.title}
          </Paragraph>
          <Paragraph size="sm" className="m-0 text-[var(--color-text-secondary)]">
            {step.description}
          </Paragraph>
        </div>
      ))}
    </BlockGrid>
  </SectionShell>
);

HowItWorksBlock.displayName = 'HowItWorksBlock';
