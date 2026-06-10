import React from 'react';
import { cn } from '../../../components/primitives/_shared';

export function FAQPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('h-[var(--space-16)] w-[var(--space-16)] min-[1024px]:h-[var(--space-20)] min-[1024px]:w-[var(--space-20)]', className)}
      aria-hidden="true"
    >
      <path d="M4.5 12H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M12 19.5V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
