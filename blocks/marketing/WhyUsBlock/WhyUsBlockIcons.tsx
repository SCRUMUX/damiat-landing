import React from 'react';
import { cn } from '../../../components/primitives/_shared';

const MOCK_ICON_WRAP_CLASS = cn(
  'flex shrink-0 items-center justify-center',
  'h-[var(--space-64)] w-[var(--space-64)]',
  'rounded-[var(--radius-section)] bg-[var(--color-surface-2)]',
  'ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-brand-primary)_12%,transparent)]',
);

function MockIconFrame({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn(MOCK_ICON_WRAP_CLASS, className)} aria-hidden="true" title={label}>
      {children}
    </div>
  );
}

/** Mock illustration — component grid (primitives). */
export function WhyUsPrimitivesIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: primitives illustration" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[var(--space-40)] w-[var(--space-40)]">
        <rect x="6" y="6" width="14" height="14" rx="3" fill="var(--color-brand-primary)" opacity="0.85" />
        <rect x="28" y="6" width="14" height="14" rx="3" fill="var(--color-brand-hover)" opacity="0.55" />
        <rect x="6" y="28" width="14" height="14" rx="3" fill="var(--color-brand-hover)" opacity="0.4" />
        <rect x="28" y="28" width="14" height="14" rx="3" stroke="var(--color-brand-primary)" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    </MockIconFrame>
  );
}

/** Mock illustration — modular imports. */
export function WhyUsFlexibilityIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: flexibility illustration" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[var(--space-40)] w-[var(--space-40)]">
        <path d="M10 24H22" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 24H38" stroke="var(--color-brand-hover)" strokeWidth="2" strokeLinecap="round" />
        <rect x="8" y="14" width="12" height="20" rx="3" fill="var(--color-brand-primary)" opacity="0.2" />
        <rect x="28" y="10" width="12" height="12" rx="3" fill="var(--color-brand-primary)" opacity="0.55" />
        <rect x="28" y="26" width="12" height="12" rx="3" fill="var(--color-brand-hover)" opacity="0.45" />
      </svg>
    </MockIconFrame>
  );
}

/** Mock illustration — spacing rhythm. */
export function WhyUsRhythmIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: rhythm illustration" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[var(--space-40)] w-[var(--space-40)]">
        <path d="M10 14H38" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 24H30" stroke="var(--color-brand-hover)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M10 34H38" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        <circle cx="36" cy="24" r="4" fill="var(--color-brand-primary)" opacity="0.35" />
      </svg>
    </MockIconFrame>
  );
}

/** Mock illustration — engine isolation layers. */
export function WhyUsIsolationIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: isolation illustration" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[var(--space-40)] w-[var(--space-40)]">
        <rect x="8" y="22" width="32" height="16" rx="4" fill="var(--color-brand-hover)" opacity="0.25" />
        <rect x="12" y="16" width="24" height="14" rx="3" fill="var(--color-brand-primary)" opacity="0.35" />
        <rect x="16" y="10" width="16" height="12" rx="3" fill="var(--color-brand-primary)" opacity="0.75" />
        <path d="M24 14V34" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      </svg>
    </MockIconFrame>
  );
}

/** Mock illustration — AI manifest / JSON. */
export function WhyUsManifestIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: manifest illustration" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[var(--space-40)] w-[var(--space-40)]">
        <rect x="10" y="8" width="28" height="32" rx="4" fill="var(--color-brand-primary)" opacity="0.15" />
        <path d="M16 18H32" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 24H28" stroke="var(--color-brand-hover)" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 30H24" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <circle cx="34" cy="30" r="5" fill="var(--color-brand-primary)" opacity="0.65" />
        <path d="M32.5 30L33.8 31.3L36.5 28.6" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </MockIconFrame>
  );
}

export const WHY_US_DEMO_ICONS = {
  primitives: <WhyUsPrimitivesIcon />,
  flexibility: <WhyUsFlexibilityIcon />,
  rhythm: <WhyUsRhythmIcon />,
  isolation: <WhyUsIsolationIcon />,
  manifest: <WhyUsManifestIcon />,
} as const;
