import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { MarqueeRow } from '../../_shared/MarqueeRow';
import {
  PARTNERS_HEADER_CLASS,
  PARTNERS_MARQUEE_FADE_LEFT_CLASS,
  PARTNERS_MARQUEE_FADE_RIGHT_CLASS,
  PARTNERS_MARQUEE_ROW_GAP_CLASS,
  PARTNERS_MARQUEE_VIEWPORT_CLASS,
} from '../../_shared/blockLayout';
import { PartnerLogoTile } from './PartnerLogoTile';
import type { PartnersBlockProps } from './PartnersBlock.types';

export type { PartnersBlockProps, PartnerItem } from './PartnersBlock.types';

const FADE_STYLE = {
  background:
    'linear-gradient(90deg, var(--color-surface-2) 0%, color-mix(in srgb, var(--color-surface-2) 0%, transparent) 100%)',
} as const;

export const PartnersBlock: React.FC<PartnersBlockProps> = ({
  title = 'Стратегические партнеры',
  partners,
  speed = 80,
  className,
}) => {
  if (partners.length === 0) return null;

  const tiles = partners.map((partner) => (
    <PartnerLogoTile key={partner.id ?? partner.name} {...partner} />
  ));

  return (
    <SectionShell recipe="section.partners" appearance="muted" className={className} aria-label="Partners">
      <div className={PARTNERS_HEADER_CLASS}>
        <h2 className="m-0 font-medium text-style-h1 text-[var(--color-text-primary)]">{title}</h2>
      </div>

      <div className={PARTNERS_MARQUEE_VIEWPORT_CLASS}>
        <MarqueeRow direction="to-right" speed={speed}>
          {tiles}
        </MarqueeRow>

        <div className={PARTNERS_MARQUEE_ROW_GAP_CLASS}>
          <MarqueeRow direction="to-left" speed={speed}>
            {tiles}
          </MarqueeRow>
        </div>

        <div className={PARTNERS_MARQUEE_FADE_LEFT_CLASS} style={FADE_STYLE} aria-hidden="true" />
        <div
          className={PARTNERS_MARQUEE_FADE_RIGHT_CLASS}
          style={{ ...FADE_STYLE, transform: 'rotate(180deg)' }}
          aria-hidden="true"
        />
      </div>
    </SectionShell>
  );
};

PartnersBlock.displayName = 'PartnersBlock';
