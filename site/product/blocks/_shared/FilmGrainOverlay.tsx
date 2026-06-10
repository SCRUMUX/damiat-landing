import React from 'react';
import { cn } from '@ai-ds/core/shared';
import './filmGrainOverlay.css';

export type FilmGrainIntensity = 'none' | 'subtle' | 'medium' | 'strong' | 'heavy';

const INTENSITY_OPACITY: Record<FilmGrainIntensity, string> = {
  subtle: 'opacity-[0.12]',
  medium: 'opacity-[0.20]',
  strong: 'opacity-[0.28]',
  heavy: 'opacity-[0.34]',
};

export interface FilmGrainOverlayProps {
  className?: string;
  intensity?: FilmGrainIntensity;
}

/**
 * Procedural film grain — dual layer on heavy (overlay + soft-light), Corn-style depth without WebGL.
 */
export const FilmGrainOverlay: React.FC<FilmGrainOverlayProps> = ({
  className,
  intensity = 'strong',
}) => {
  if (intensity === 'none') return null;

  const useDual = intensity === 'heavy' || intensity === 'strong';

  return (
    <>
      <div
        className={cn(
          'film-grain-overlay pointer-events-none absolute inset-0 mix-blend-overlay',
          INTENSITY_OPACITY[intensity],
          className,
        )}
        aria-hidden="true"
      />
      {useDual ? (
        <div
          className={cn(
            'film-grain-overlay film-grain-overlay--soft pointer-events-none absolute inset-0',
            intensity === 'heavy' ? 'opacity-[0.18]' : 'opacity-[0.12]',
          )}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
};

FilmGrainOverlay.displayName = 'FilmGrainOverlay';
