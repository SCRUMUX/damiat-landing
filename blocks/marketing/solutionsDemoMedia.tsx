import React from 'react';
import { cn } from '../../components/primitives/_shared';
import { solutionDemoImage } from './demo-assets/solutionDemoImages';
import type { SolutionsBlockProps } from './SolutionsBlock/SolutionsBlock.types';

const SOLUTION_COVER_TONES = [
  'from-[var(--color-brand-primary)]/90 to-[var(--color-brand-hover)]',
  'from-[var(--color-brand-hover)] to-[var(--color-brand-primary)]',
  'from-[var(--color-brand-primary)] to-[var(--color-text-primary)]/80',
  'from-[var(--color-text-primary)]/70 to-[var(--color-brand-primary)]',
  'from-[var(--color-brand-primary)]/80 to-[var(--color-brand-hover)]',
  'from-[var(--color-brand-hover)]/90 to-[var(--color-brand-primary)]',
] as const;

function SolutionCoverPattern() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 h-[55%] w-[45%] opacity-[0.18]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(-35deg, transparent, transparent var(--space-10), var(--color-text-on-brand) var(--space-10), var(--color-text-on-brand) calc(var(--space-10) + var(--space-1)))',
      }}
      aria-hidden="true"
    />
  );
}

export function solutionCoverPlaceholder(index: number) {
  const tone = SOLUTION_COVER_TONES[index % SOLUTION_COVER_TONES.length];

  return (
    <div className={cn('absolute inset-0 bg-gradient-to-br', tone)} aria-hidden="true">
      <SolutionCoverPattern />
    </div>
  );
}

/** Attach demo cover + imageSrc for Storybook render() — keep out of CSF args. */
export function withSolutionCardCovers(
  props: Extract<SolutionsBlockProps, { variant?: 'showcase' }>,
): Extract<SolutionsBlockProps, { variant?: 'showcase' }> {
  let coverIndex = 0;

  return {
    ...props,
    solutions: props.solutions.map((item, index) => {
      const imageSrc = item.imageSrc ?? solutionDemoImage(item.id ?? '', index);
      const imageAlt = item.imageAlt ?? `${item.title} — preview`;

      return {
        ...item,
        imageSrc,
        imageAlt,
        cover: item.cover ?? (imageSrc ? undefined : solutionCoverPlaceholder(coverIndex++)),
      };
    }),
  };
}
