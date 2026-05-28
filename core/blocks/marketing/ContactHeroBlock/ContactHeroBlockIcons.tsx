import React from 'react';
import { cn } from '../../../components/primitives/_shared';

export function ContactHeroArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('h-[var(--space-16)] w-[var(--space-16)] min-[1024px]:h-[var(--space-22)] min-[1024px]:w-[var(--space-22)]', className)}
      aria-hidden="true"
    >
      <path
        d="M7.714 5.143V12.248C7.714 13.905 9.057 15.248 10.714 15.248H16.286M16.286 15.248L12.714 11.639M16.286 15.248L12.714 18.857"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Simplified RU flag for phone prefix (Cortel reference). */
export function ContactHeroPhoneFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      width="30"
      height="22"
      viewBox="0 0 30 22"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="5" y="5" width="20" height="4" fill="var(--core-white)" />
      <rect x="5" y="9" width="20" height="4" fill="var(--core-blue-70)" />
      <rect x="5" y="13" width="20" height="4" fill="var(--core-red-50)" />
    </svg>
  );
}
