import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { BlockGrid } from '../../_shared/BlockGrid';
import { FeatureCard } from '../../_shared/FeatureCard';

export interface FeatureItem {
  title: string;
  description: string;
  /** Optional leading glyph (emoji, icon component, or short label). */
  icon?: React.ReactNode;
}

export interface FeaturesBlockProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  features: FeatureItem[];
  columns?: 2 | 3;
  className?: string;
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  title = 'Features',
  subtitle,
  eyebrow,
  features,
  columns = 3,
  className,
}) => (
  <SectionShell recipe="section.features" appearance="surface" className={className} aria-label="Features">
    <BlockSectionHeader
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
    />
    <BlockGrid columns={columns === 3 ? 3 : 2}>
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
        />
      ))}
    </BlockGrid>
  </SectionShell>
);

FeaturesBlock.displayName = 'FeaturesBlock';
