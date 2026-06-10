import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { ParallaxLayer } from './ParallaxLayer';
import { PhotoHeroBackdrop, type PhotoHeroBackdropProps } from './PhotoHeroBackdrop';

export interface BrandPhotoHeroSectionProps extends PhotoHeroBackdropProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  as?: 'section' | 'div';
  /** Foreground content parallax — default 0.05; set 0 to disable. */
  contentParallaxFactor?: number;
  imageLoading?: 'eager' | 'lazy';
}

/**
 * Brand-band section with photo backdrop + grain (scenarios, case stats, CTA+footer, etc.).
 */
export const BrandPhotoHeroSection: React.FC<
  BrandPhotoHeroSectionProps & React.HTMLAttributes<HTMLElement>
> = ({
  id,
  children,
  className,
  contentClassName,
  as: Tag = 'section',
  backgroundImageSrc,
  photoTone,
  grainIntensity = 'strong',
  depth = 'enhanced',
  vignette,
  imageParallaxFactor,
  contentParallaxFactor = 0.05,
  imageLoading = 'lazy',
  ...rest
}) => {
  const content = (
    <div
      className={cn(
        'photo-hero-content-stage relative z-[1]',
        'drop-shadow-[0_8px_32px_color-mix(in_srgb,var(--core-gray-95)_55%,transparent)]',
        contentClassName,
      )}
    >
      {children}
    </div>
  );

  return (
    <Tag
      id={id}
      {...rest}
      className={cn(
        'relative overflow-hidden text-[var(--color-text-on-brand)]',
        className,
      )}
    >
      <PhotoHeroBackdrop
        backgroundImageSrc={backgroundImageSrc}
        photoTone={photoTone}
        grainIntensity={grainIntensity}
        depth={depth}
        vignette={vignette}
        imageParallaxFactor={imageParallaxFactor}
        imageLoading={imageLoading}
      />
      {contentParallaxFactor > 0 ? (
        <ParallaxLayer factor={contentParallaxFactor} className="relative z-[1]">
          {content}
        </ParallaxLayer>
      ) : (
        content
      )}
    </Tag>
  );
};

BrandPhotoHeroSection.displayName = 'BrandPhotoHeroSection';
