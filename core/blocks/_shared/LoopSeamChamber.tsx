import React from 'react';
import { FilmGrainOverlay } from './FilmGrainOverlay';

export interface LoopSeamChamberProps {
  imageSrc: string;
  imageAlt?: string;
  phrases: readonly string[];
  activeIndex: number;
}

/**
 * Full-viewport fixed background — image (bottom), grain on image, phrases on top.
 */
export const LoopSeamChamber: React.FC<LoopSeamChamberProps> = ({
  imageSrc,
  imageAlt = 'DAMIAT',
  phrases,
  activeIndex,
}) => (
  <div
    data-loop-seam-chamber
    className="loop-seam__chamber"
    aria-hidden={false}
    aria-label="DAMIAT"
  >
    <div className="loop-seam__chamber-bg" aria-hidden="true">
      <img
        src={imageSrc}
        alt=""
        className="loop-seam__bg-image"
        decoding="async"
        draggable={false}
        aria-hidden="true"
      />
      <FilmGrainOverlay intensity="medium" className="loop-seam__bg-grain opacity-[0.2]" />
    </div>

    <div className="loop-seam__phrases" aria-live="polite" aria-atomic="true">
      {phrases.map((phrase, index) => (
        <p
          key={phrase}
          className={
            index === activeIndex
              ? 'loop-seam__phrase loop-seam__phrase--active m-0 text-style-h3 font-semibold text-[var(--color-text-primary)]'
              : 'loop-seam__phrase loop-seam__phrase--idle m-0 text-style-h3 font-semibold text-[var(--color-text-primary)]'
          }
        >
          {phrase}
        </p>
      ))}
    </div>
  </div>
);

LoopSeamChamber.displayName = 'LoopSeamChamber';
