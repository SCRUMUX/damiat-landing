import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { useParallaxOffset } from '../../hooks/useParallaxOffset';
import { FilmGrainOverlay, type FilmGrainIntensity } from './FilmGrainOverlay';

/** `deep` — photo visible, neutral dark scrim. `brand` — denser neutral (no photo fallback). */
export type PhotoHeroTone = 'brand' | 'deep';

export type PhotoHeroDepth = 'standard' | 'enhanced';

const NEUTRAL_SHELL = 'var(--core-gray-95)';
const NEUTRAL_MID = 'var(--core-data-900)';
const NEUTRAL_EDGE = 'var(--core-gray-90)';

const PHOTO_HERO_SCRIM: Record<
  PhotoHeroTone,
  { shellBg: string; mainGradient: string; bottomGradient: string; tintVeil?: string }
> = {
  brand: {
    shellBg: 'bg-[var(--core-gray-95)]',
    mainGradient: `linear-gradient(105deg, color-mix(in srgb, ${NEUTRAL_SHELL} 88%, transparent) 0%, color-mix(in srgb, ${NEUTRAL_MID} 72%, transparent) 42%, color-mix(in srgb, ${NEUTRAL_EDGE} 78%, transparent) 100%)`,
    bottomGradient: `linear-gradient(180deg, transparent 0%, color-mix(in srgb, ${NEUTRAL_SHELL} 85%, transparent) 100%)`,
  },
  deep: {
    shellBg: 'bg-[var(--core-gray-95)]',
    mainGradient: `linear-gradient(105deg, color-mix(in srgb, ${NEUTRAL_SHELL} 52%, transparent) 0%, color-mix(in srgb, ${NEUTRAL_MID} 38%, transparent) 40%, color-mix(in srgb, ${NEUTRAL_EDGE} 44%, transparent) 100%)`,
    bottomGradient: `linear-gradient(180deg, transparent 0%, color-mix(in srgb, ${NEUTRAL_SHELL} 58%, transparent) 100%)`,
    tintVeil: `color-mix(in srgb, ${NEUTRAL_SHELL} 16%, transparent)`,
  },
};

export interface PhotoHeroBackdropProps {
  backgroundImageSrc: string;
  photoTone?: PhotoHeroTone;
  grainIntensity?: FilmGrainIntensity;
  depth?: PhotoHeroDepth;
  vignette?: boolean;
  /** Background image parallax factor — default 0.12. */
  imageParallaxFactor?: number;
  className?: string;
}

/**
 * Full-bleed photo + neutral dark scrim + depth layers + film grain.
 */
export const PhotoHeroBackdrop: React.FC<PhotoHeroBackdropProps> = ({
  backgroundImageSrc,
  photoTone = 'deep',
  grainIntensity = 'strong',
  depth = 'enhanced',
  vignette = true,
  imageParallaxFactor = 0.12,
  className,
}) => {
  const scrim = PHOTO_HERO_SCRIM[photoTone];
  const imageParallaxRef = useParallaxOffset(imageParallaxFactor, true);
  const enhanced = depth === 'enhanced';

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', scrim.shellBg, className)}
      aria-hidden="true"
    >
      <div
        ref={imageParallaxRef as React.RefObject<HTMLDivElement>}
        className="absolute inset-0 overflow-hidden will-change-transform motion-reduce:transform-none"
        style={{ transform: 'translate3d(0, var(--parallax-offset, 0), 0)' }}
      >
        <img
          src={backgroundImageSrc}
          alt=""
          className="absolute inset-0 h-[108%] w-full object-cover object-center saturate-[0.92] contrast-[1.05]"
          decoding="async"
        />
      </div>

      {scrim.tintVeil ? (
        <div className="absolute inset-0" style={{ background: scrim.tintVeil }} />
      ) : null}
      <div className="absolute inset-0" style={{ background: scrim.mainGradient }} />
      <div
        className="absolute inset-x-0 bottom-0 h-[50%]"
        style={{ background: scrim.bottomGradient }}
      />

      {enhanced ? (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 55% 45% at 50% 38%, color-mix(in srgb, white 10%, transparent) 0%, transparent 72%)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 95% 85% at 50% 50%, transparent 42%, color-mix(in srgb, ${NEUTRAL_SHELL} 70%, transparent) 100%)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, color-mix(in srgb, ${NEUTRAL_SHELL} 32%, transparent) 0%, transparent 28%, transparent 72%, color-mix(in srgb, ${NEUTRAL_SHELL} 38%, transparent) 100%)`,
            }}
          />
        </>
      ) : null}

      {vignette ? (
        <div
          className="absolute inset-0"
          style={{
            background: enhanced
              ? `radial-gradient(ellipse 88% 78% at 50% 42%, transparent 28%, color-mix(in srgb, ${NEUTRAL_SHELL} 58%, transparent) 100%)`
              : `radial-gradient(ellipse 85% 75% at 50% 45%, transparent 35%, color-mix(in srgb, ${NEUTRAL_SHELL} 50%, transparent) 100%)`,
          }}
        />
      ) : null}

      <FilmGrainOverlay intensity={grainIntensity} />
    </div>
  );
};

PhotoHeroBackdrop.displayName = 'PhotoHeroBackdrop';
