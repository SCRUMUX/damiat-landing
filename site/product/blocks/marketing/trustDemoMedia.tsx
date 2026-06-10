import React from 'react';
import { cn } from '@ai-ds/core/shared';
import { trustDemoImage } from './demo-assets/trustDemoImages';
import type { TrustBlockProps } from '@ai-ds/core/blocks/TrustBlock/TrustBlock.types';

export function trustFeaturedCoverPlaceholder() {
  return (
    <div
      className={cn(
        'absolute inset-0 bg-gradient-to-br',
        'from-[var(--color-brand-primary)] via-[var(--color-brand-hover)] to-[var(--color-text-primary)]/90',
      )}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[60%] w-[50%] opacity-[0.15]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-25deg, transparent, transparent 12px, var(--color-text-on-brand) 12px, var(--color-text-on-brand) 13px)',
        }}
      />
    </div>
  );
}

/** Attach pillar demo images in Storybook render() — keep out of CSF args. */
export function withTrustFeaturedCover(props: TrustBlockProps): TrustBlockProps {
  return {
    ...props,
    pillars: props.pillars.map((pillar, index) => {
      const isFeatured = pillar.featured ?? index === 0;
      const imageSrc = pillar.imageSrc ?? (pillar.id ? trustDemoImage(pillar.id) : undefined);
      const imageAlt = pillar.imageAlt ?? `${pillar.title} — illustration`;

      return {
        ...pillar,
        imageSrc,
        imageAlt,
        cover:
          pillar.cover ??
          (isFeatured && !imageSrc ? trustFeaturedCoverPlaceholder() : undefined),
      };
    }),
  };
}
