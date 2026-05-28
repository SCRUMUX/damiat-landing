import React from 'react';
import { cn } from '../../../components/primitives/_shared';

const ICON_CLASS = cn(
  'h-[var(--space-28)] w-[var(--space-28)] shrink-0 text-[var(--color-brand-primary)]',
  'min-[1024px]:h-[var(--space-40)] min-[1024px]:w-[var(--space-40)]',
);

export function SupportGithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn(ICON_CLASS, className)} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function SupportDocsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn(ICON_CLASS, className)} aria-hidden="true">
      <path d="M20 23.3272L7.03705 16.1103V30H32.963V16.1103L20 23.3272Z" fill="currentColor" />
      <path d="M20 19.7188L7.03705 12.5019V10H32.963V12.5019L20 19.7188Z" fill="currentColor" />
    </svg>
  );
}

export function SupportStorybookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn(ICON_CLASS, className)} aria-hidden="true">
      <path
        d="M10.649 7C9.574 7.00495 8.55436 7.47723 7.85536 8.29392C7.27764 8.96893 6.95068 9.83007 7.00607 10.7168C7.35524 16.3057 9.6649 21.7944 13.9352 26.0648C18.2056 30.3352 23.6943 32.6448 29.2832 32.9939C30.1699 33.0493 31.031 32.7224 31.7061 32.1446C32.5228 31.4456 32.9951 30.426 33 29.3511V24.7033L25.9387 22.9352L21.2809 25.7906C20.1574 25.0037 18.4925 23.5143 17.489 22.511C16.4857 21.5075 14.9963 19.8426 14.2094 18.7191L17.0649 14.0613L15.2967 7H10.649Z"
        fill="currentColor"
      />
    </svg>
  );
}
