import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { PARTNER_LOGO_IMAGE_CLASS, PARTNER_TILE_CLASS } from '../../_shared/blockLayout';
import type { PartnerItem } from './PartnersBlock.types';

export interface PartnerLogoTileProps extends PartnerItem {
  className?: string;
}

export const PartnerLogoTile: React.FC<PartnerLogoTileProps> = ({
  name,
  href,
  imageSrc,
  imageAlt,
  logo,
  className,
}) => {
  const media = logo ?? (
    imageSrc ? (
      <img src={imageSrc} alt={imageAlt ?? name} className={PARTNER_LOGO_IMAGE_CLASS} />
    ) : (
      <span className="truncate px-[var(--space-inset-m)] text-style-body-sm font-medium text-[var(--color-text-muted)]">
        {name}
      </span>
    )
  );

  const shell = (
    <div className={cn(PARTNER_TILE_CLASS, className)}>
      {media}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="shrink-0 no-underline" aria-label={name}>
        {shell}
      </a>
    );
  }

  return shell;
};

PartnerLogoTile.displayName = 'PartnerLogoTile';
