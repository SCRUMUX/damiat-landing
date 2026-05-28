import React from 'react';
import { cn } from '../../../components/primitives/_shared';

export function ProcessStepDotIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="15" height="15" rx="7.5" fill="var(--color-brand-primary)" />
      <circle cx="7.5" cy="7.5" r="3" fill="var(--color-text-on-brand)" />
    </svg>
  );
}

export function ProcessStepNumber({ value, className }: { value: string; className?: string }) {
  return <span className={cn('tabular-nums', className)}>{value}</span>;
}
