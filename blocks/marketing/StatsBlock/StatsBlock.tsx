import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { BlockGrid } from '../../_shared/BlockGrid';

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsBlockProps {
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  className?: string;
}

export const StatsBlock: React.FC<StatsBlockProps> = ({
  title,
  subtitle,
  stats,
  className,
}) => (
  <SectionShell recipe="section.stats" appearance="brand" className={className} aria-label="Statistics">
    {(title || subtitle) && (
      <BlockSectionHeader title={title ?? ''} subtitle={subtitle} onBrand />
    )}
    <BlockGrid columns={Math.min(stats.length, 4) as 1 | 2 | 3 | 4}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-start text-left"
          style={{ gap: 'var(--space-section-stack-s)' }}
        >
          <span className="text-style-display font-semibold">{stat.value}</span>
          <span className="text-style-body-sm opacity-90">{stat.label}</span>
        </div>
      ))}
    </BlockGrid>
  </SectionShell>
);

StatsBlock.displayName = 'StatsBlock';
