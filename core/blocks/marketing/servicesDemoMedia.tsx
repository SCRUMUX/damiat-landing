import React from 'react';
import type { ServicesBlockProps } from './ServicesBlock/ServicesBlock.types';

const SERVICE_MEDIA_TONES = [
  'from-[var(--color-brand-primary)]/20 to-[var(--color-surface-3)]',
  'from-[var(--color-surface-3)] to-[var(--color-brand-primary)]/10',
  'from-[var(--color-surface-2)] to-[var(--color-surface-3)]',
  'from-[var(--color-brand-primary)]/15 to-[var(--color-surface-2)]',
  'from-[var(--color-surface-3)] to-[var(--color-brand-primary)]/20',
  'from-[var(--color-surface-2)] to-[var(--color-brand-primary)]/15',
] as const;

export function serviceCardMediaPlaceholder(index: number) {
  const tone = SERVICE_MEDIA_TONES[index % SERVICE_MEDIA_TONES.length];

  return (
    <div
      className={`flex aspect-[4/3] w-full items-end bg-gradient-to-br ${tone} p-[var(--space-inset-m)]`}
      aria-hidden="true"
    >
      <span className="text-style-caption text-[var(--color-text-muted)]">Service preview</span>
    </div>
  );
}

export function withServiceCardMedia(props: ServicesBlockProps): ServicesBlockProps {
  let mediaIndex = 0;

  return {
    ...props,
    categories: props.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        image: item.image ?? serviceCardMediaPlaceholder(mediaIndex++),
      })),
    })),
  };
}
