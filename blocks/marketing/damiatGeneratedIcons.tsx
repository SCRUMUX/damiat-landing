import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { GeneratedIcon } from '../../components/primitives/GeneratedIcon';
import {
  DAMIAT_PRIMARY_FEATURED_ICON_IMAGE_CLASS,
  DAMIAT_PRIMARY_FEATURED_ICON_IMAGE_WRAP_CLASS,
  DAMIAT_PRIMARY_FEATURED_ICON_PLATE_BORDER_CLASS,
  DAMIAT_PRIMARY_FEATURED_ICON_PLATE_CLASS,
  DAMIAT_PRIMARY_FEATURED_ICON_PLATE_EDGE_CLASS,
  DAMIAT_PRIMARY_FEATURED_ICON_PLATE_SHEEN_CLASS,
  DAMIAT_PRIMARY_FEATURED_ICON_SLOT_CLASS,
} from '../_shared/blockLayout';
import {
  getGeneratedIcon,
  type GeneratedIconSlug,
} from '../../generated-icons/agritech/icons.manifest';

export type { GeneratedIconSlug };

/** White / standard cards — raster only, no plate chrome. */
const DAMIAT_STANDARD_CARD_ICON_CLASS = 'max-h-full max-w-full object-contain';

export function damiatGeneratedIcon(
  slug: GeneratedIconSlug,
  options: { size?: number; alt?: string; className?: string } = {},
): React.ReactNode {
  const entry = getGeneratedIcon(slug);
  const alt = options.alt ?? entry.meta.sourceCard ?? slug;
  return (
    <GeneratedIcon
      src={entry.png}
      webpSrc={entry.webp}
      alt={alt}
      size={options.size ?? 56}
      className={options.className}
    />
  );
}

/** Catalog / problem grid — standard (white) card. */
export function damiatCatalogIcon(slug: GeneratedIconSlug): React.ReactNode {
  return damiatGeneratedIcon(slug, { size: 56, className: DAMIAT_STANDARD_CARD_ICON_CLASS });
}

/** Choose us / process — standard (white) card. */
export function damiatCardIcon(slug: GeneratedIconSlug): React.ReactNode {
  return damiatGeneratedIcon(slug, {
    size: 72,
    className: DAMIAT_STANDARD_CARD_ICON_CLASS,
  });
}

/** Why us device intro — standard (white) card. */
export function damiatWhyUsCardIcon(slug: GeneratedIconSlug): React.ReactNode {
  const entry = getGeneratedIcon(slug);
  const alt = entry.meta.sourceCard ?? slug;
  return (
    <GeneratedIcon
      src={entry.png}
      webpSrc={entry.webp}
      alt={alt}
      size={88}
      className={DAMIAT_STANDARD_CARD_ICON_CLASS}
      style={{ width: 'auto', height: 'auto', maxHeight: '100%', maxWidth: '100%' }}
    />
  );
}

function DamiatPrimaryFeaturedIconPlate({
  slug,
  renderSize = 120,
}: {
  slug: GeneratedIconSlug;
  renderSize?: number;
}) {
  const entry = getGeneratedIcon(slug);
  const alt = entry.meta.sourceCard ?? slug;

  return (
    <div className={DAMIAT_PRIMARY_FEATURED_ICON_PLATE_BORDER_CLASS}>
      <div className={DAMIAT_PRIMARY_FEATURED_ICON_PLATE_CLASS}>
        <div className={DAMIAT_PRIMARY_FEATURED_ICON_PLATE_SHEEN_CLASS} aria-hidden />
        <div className={DAMIAT_PRIMARY_FEATURED_ICON_PLATE_EDGE_CLASS} aria-hidden />
        <div className={DAMIAT_PRIMARY_FEATURED_ICON_IMAGE_WRAP_CLASS}>
          <GeneratedIcon
            src={entry.png}
            webpSrc={entry.webp}
            alt={alt}
            size={renderSize}
            className={DAMIAT_PRIMARY_FEATURED_ICON_IMAGE_CLASS}
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}

/** Brand primary featured — frosted glass frame + sharp raster (eco, device, Skolkovo, …). */
export function damiatBrandFeaturedCornerMedia(slug: GeneratedIconSlug): React.ReactNode {
  return (
    <div className={DAMIAT_PRIMARY_FEATURED_ICON_SLOT_CLASS}>
      <DamiatPrimaryFeaturedIconPlate slug={slug} />
    </div>
  );
}

/** Primary Why us featured. */
export function damiatWhyUsFeaturedMedia(slug: GeneratedIconSlug): React.ReactNode {
  return damiatBrandFeaturedCornerMedia(slug);
}

/** Choose us / trust featured primary pillar. */
export function damiatFeaturedCover(slug: GeneratedIconSlug): React.ReactNode {
  return damiatBrandFeaturedCornerMedia(slug);
}

/** Trust secondary pillar — large raster, no slot background (e.g. «Участие в выставках»). */
export function damiatTrustCover(slug: GeneratedIconSlug): React.ReactNode {
  const entry = getGeneratedIcon(slug);
  return (
    <GeneratedIcon
      src={entry.png}
      webpSrc={entry.webp}
      alt={entry.meta.sourceCard ?? slug}
      size={128}
      className={cn(
        DAMIAT_STANDARD_CARD_ICON_CLASS,
        'max-h-[var(--space-128)] min-[1024px]:max-h-[var(--space-152)]',
      )}
      style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
    />
  );
}
