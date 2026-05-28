import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { solutionsPageHeroDemoImage } from './demo-assets/solutionsPageHeroImage';

/** Decorative hero media — transparent asset, taller than panel, Cortel /solutions bleed. */
export const solutionsPageHeroMedia = (
  <img
    src={solutionsPageHeroDemoImage}
    alt=""
    decoding="async"
    className={cn(
      'mx-auto block h-auto w-full select-none bg-transparent',
      'object-contain object-center',
      'max-lg:max-h-[var(--space-300)]',
      'min-[1024px]:min-h-[var(--space-608)] min-[1024px]:max-h-none',
    )}
    aria-hidden="true"
  />
);
