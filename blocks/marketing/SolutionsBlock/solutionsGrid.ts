import React from 'react';
import { cn } from '../../../components/primitives/_shared';

/** Desktop grid span — row 1: 3× equal; row 2: 6+3+3 (Cortel reference). */
export function getSolutionGridSpanClass(index: number): string {
  if (index < 3) {
    return cn(
      'col-span-12 min-[1024px]:col-span-4',
      'min-[1024px]:min-h-[var(--space-360)]',
    );
  }
  if (index === 3) {
    return cn(
      'col-span-12 min-[1024px]:col-span-6',
      'min-[1024px]:min-h-[var(--space-360)]',
    );
  }
  return cn(
    'col-span-12 min-[1024px]:col-span-3',
    'min-[1024px]:min-h-[var(--space-360)]',
  );
}
