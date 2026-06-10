import React from 'react';
import { cn } from '../../../components/primitives/_shared';

export function ShowcasePanelPlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('h-[var(--space-20)] w-[var(--space-20)]', className)} aria-hidden="true">
      <path d="M4.5 12H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M12 19.5V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function ShowcasePanelCloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('h-[var(--space-20)] w-[var(--space-20)]', className)} aria-hidden="true">
      <path d="M6.697 6.697L17.303 17.303" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M6.697 17.303L17.303 6.697" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function ShowcasePanelBulletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn('h-[var(--space-24)] w-[var(--space-24)] shrink-0 min-[1024px]:h-[var(--space-32)] min-[1024px]:w-[var(--space-32)]', className)} aria-hidden="true">
      <rect x="12" y="12" width="8" height="8" rx="3" fill="currentColor" />
    </svg>
  );
}

export function ShowcasePanelActionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('h-[var(--space-16)] w-[var(--space-16)] min-[1024px]:h-[var(--space-22)] min-[1024px]:w-[var(--space-22)]', className)} aria-hidden="true">
      <path
        d="M7.714 5.143V12.248C7.714 13.905 9.057 15.248 10.714 15.248H16.286M16.286 15.248L12.714 11.639M16.286 15.248L12.714 18.857"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
