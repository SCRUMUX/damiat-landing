import React from 'react';
import { cn } from '../../../components/primitives/_shared';

const MOCK_ICON_WRAP_CLASS = cn(
  'flex h-full w-full shrink-0 items-center justify-center',
  'rounded-[var(--radius-medium)] bg-[var(--color-surface-2)]',
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

export function ChooseUsResponsiveIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: responsive support" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[55%] w-[55%]">
        <path d="M12 28C12 20 18 14 26 14C34 14 40 20 40 28" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 28H14L16 34H22L24 28H28" stroke="var(--color-brand-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="26" cy="22" r="3" fill="var(--color-brand-primary)" opacity="0.65" />
      </svg>
    </MockIconFrame>
  );
}

export function ChooseUsReliabilityIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: reliability" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[55%] w-[55%]">
        <path d="M24 8L38 14V24C38 32 32 38 24 40C16 38 10 32 10 24V14L24 8Z" fill="var(--color-brand-primary)" opacity="0.18" />
        <path d="M18 24L22 28L30 20" stroke="var(--color-brand-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </MockIconFrame>
  );
}

export function ChooseUsExpertiseIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: expertise" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[55%] w-[55%]">
        <circle cx="24" cy="18" r="8" fill="var(--color-brand-primary)" opacity="0.25" />
        <path d="M12 38C12 31 17 26 24 26C31 26 36 31 36 38" stroke="var(--color-brand-hover)" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 14L34 10" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </MockIconFrame>
  );
}

export function ChooseUsFlexibilityIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: flexibility" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[55%] w-[55%]">
        <rect x="8" y="14" width="12" height="20" rx="3" fill="var(--color-brand-primary)" opacity="0.2" />
        <rect x="28" y="10" width="12" height="12" rx="3" fill="var(--color-brand-primary)" opacity="0.55" />
        <rect x="28" y="26" width="12" height="12" rx="3" fill="var(--color-brand-hover)" opacity="0.45" />
        <path d="M20 24H28" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </MockIconFrame>
  );
}

export function ChooseUsSpeedIcon({ className }: { className?: string }) {
  return (
    <MockIconFrame label="Mock: speed" className={className}>
      <svg viewBox="0 0 48 48" fill="none" className="h-[55%] w-[55%]">
        <path d="M10 28H30" stroke="var(--color-brand-hover)" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 28L24 22" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 28L24 34" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="34" cy="28" r="4" fill="var(--color-brand-primary)" opacity="0.55" />
      </svg>
    </MockIconFrame>
  );
}

export const CHOOSE_US_DEMO_ICONS = {
  responsive: <ChooseUsResponsiveIcon />,
  reliability: <ChooseUsReliabilityIcon />,
  expertise: <ChooseUsExpertiseIcon />,
  flexibility: <ChooseUsFlexibilityIcon />,
  speed: <ChooseUsSpeedIcon />,
} as const;
