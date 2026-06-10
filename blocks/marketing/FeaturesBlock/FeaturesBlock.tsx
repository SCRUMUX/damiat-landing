import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { BlockGrid } from '../../_shared/BlockGrid';
import { FeatureCard } from '../../_shared/FeatureCard';
import { cn } from '../../../components/primitives/_shared';
import { SolutionCatalogCard } from '../SolutionsBlock/SolutionCatalogCard';

export interface FeatureItem {
  title: string;
  description: string;
  /** Optional leading glyph (emoji, icon component, or short label). */
  icon?: React.ReactNode;
  href?: string;
  id?: string;
}

export interface FeaturesBlockProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  features: FeatureItem[];
  /** Substring of `subtitle` rendered in brand primary. */
  subtitleAccent?: string;
  columns?: 2 | 3;
  /** `catalog` — equal grid bordered cards (SolutionsBlock catalog). */
  variant?: 'default' | 'catalog';
  className?: string;
}

function FeaturesCatalogGrid({
  features,
  columns,
}: {
  features: FeatureItem[];
  columns: 2 | 3;
}) {
  return (
    <ul
      className={cn(
        'm-0 grid w-full min-w-0 list-none gap-[var(--space-16)] p-0',
        columns === 2 ? 'min-[768px]:grid-cols-2' : 'min-[1024px]:grid-cols-3',
      )}
    >
      {features.map((feature) => (
        <SolutionCatalogCard
          key={feature.id ?? feature.title}
          id={feature.id}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          href={feature.href}
        />
      ))}
    </ul>
  );
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  title = 'Features',
  subtitle,
  subtitleAccent,
  eyebrow,
  features,
  columns = 3,
  variant = 'default',
  className,
}) => (
  <SectionShell
    recipe="section.features"
    appearance="surface"
    className={className}
    aria-label="Features"
  >
    <BlockSectionHeader
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      subtitleAccent={subtitleAccent}
    />

    {variant === 'catalog' ? (
      <FeaturesCatalogGrid features={features} columns={columns === 3 ? 3 : 2} />
    ) : (
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
    )}
  </SectionShell>
);

FeaturesBlock.displayName = 'FeaturesBlock';
