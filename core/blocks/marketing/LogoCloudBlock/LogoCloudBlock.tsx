import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockSectionHeader } from '../../_shared/BlockSectionHeader';
import { LogoMark } from '../../_shared/LogoMark';
import { BLOCK_LOGO_GRID_CLASS } from '../../_shared/blockLayout';

export interface LogoCloudItem {
  name: string;
  logo?: React.ReactNode;
}

export interface LogoCloudBlockProps {
  title?: string;
  /** Text names or items with optional logo nodes. */
  logos: string[] | LogoCloudItem[];
  className?: string;
}

function normalizeLogos(logos: string[] | LogoCloudItem[]): LogoCloudItem[] {
  return logos.map((entry) => (typeof entry === 'string' ? { name: entry } : entry));
}

export const LogoCloudBlock: React.FC<LogoCloudBlockProps> = ({
  title = 'Trusted by teams worldwide',
  logos,
  className,
}) => {
  const items = normalizeLogos(logos);

  return (
    <SectionShell recipe="section.logos" appearance="muted" className={className} aria-label="Logo cloud">
      <BlockSectionHeader title={title} titleScale="section" />
      <div className={BLOCK_LOGO_GRID_CLASS}>
        {items.map((item) => (
          <LogoMark key={item.name} name={item.name} logo={item.logo} />
        ))}
      </div>
    </SectionShell>
  );
};

LogoCloudBlock.displayName = 'LogoCloudBlock';
