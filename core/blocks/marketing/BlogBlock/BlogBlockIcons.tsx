import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { BlockArrowUpRightIcon } from '../../_shared/BlockArrowIcons';

export function BlogChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('h-[var(--space-24)] w-[var(--space-24)]', className)} aria-hidden="true">
      <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function BlogChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('h-[var(--space-24)] w-[var(--space-24)]', className)} aria-hidden="true">
      <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function BlogArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <BlockArrowUpRightIcon
      className={cn('h-[var(--space-16)] w-[var(--space-16)] min-[1024px]:h-[var(--space-18)] min-[1024px]:w-[var(--space-18)]', className)}
    />
  );
}

export function BlogViewAllIcon({ className }: { className?: string }) {
  return (
    <BlockArrowUpRightIcon
      className={cn('h-[var(--space-16)] w-[var(--space-16)] min-[1024px]:h-[var(--space-22)] min-[1024px]:w-[var(--space-22)]', className)}
    />
  );
}
