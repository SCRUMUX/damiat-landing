import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { ParallaxBrandScene } from './ParallaxBrandScene';
import { PhotoHeroBackdrop, type PhotoHeroTone, type PhotoHeroBackdropProps } from './PhotoHeroBackdrop';

export type MarketingAboveFoldPhotoTone = PhotoHeroTone;

export interface MarketingAboveFoldProps {
  children: React.ReactNode;
  className?: string;
  /** Pull brand background under fixed overlay navbar (uses --navbar-above-fold-band-height). */
  underFixedNavbar?: boolean;
  /** Full-bleed cover photo behind hero (e.g. storage facility). */
  backgroundImageSrc?: string;
  /** Scrim over `backgroundImageSrc` — default `brand`. */
  photoTone?: MarketingAboveFoldPhotoTone;
  /** Main hero photo parallax — default 0.14 when photo present. */
  imageParallaxFactor?: number;
  /** Film grain on photo backdrop — default `strong`. */
  grainIntensity?: PhotoHeroBackdropProps['grainIntensity'];
}

/**
 * Brand above-the-fold shell — unified parallax background for overlay enterprise navbar + hero.
 * Navbar band MUST stack above this shell (`--z-header`); do not raise MAF z-index above header.
 * First screen (hero + optional events band) should use min-h-[100svh] on this wrapper.
 */
export const MarketingAboveFold: React.FC<MarketingAboveFoldProps> = ({
  children,
  className,
  underFixedNavbar = false,
  backgroundImageSrc,
  photoTone = 'brand',
  imageParallaxFactor = 0.14,
  grainIntensity = 'strong',
}) => (
  <div
    data-marketing-above-fold
    className={cn(
      'relative z-0 flex w-full flex-col overflow-hidden text-[var(--color-text-on-brand)]',
      backgroundImageSrc ? 'bg-[var(--core-gray-95)]' : 'bg-[var(--color-brand-primary)]',
      underFixedNavbar &&
        '-mt-[var(--navbar-above-fold-band-height,var(--navbar-chrome-height,calc(var(--space-56)+var(--space-4)*2)))]',
      className,
    )}
  >
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {backgroundImageSrc ? (
        <PhotoHeroBackdrop
          backgroundImageSrc={backgroundImageSrc}
          photoTone={photoTone}
          grainIntensity={grainIntensity}
          depth="enhanced"
          imageParallaxFactor={imageParallaxFactor}
        />
      ) : (
        <ParallaxBrandScene variant="hero" />
      )}
    </div>
    <div className="relative z-[1] flex min-h-0 flex-1 flex-col">{children}</div>
  </div>
);

MarketingAboveFold.displayName = 'MarketingAboveFold';
