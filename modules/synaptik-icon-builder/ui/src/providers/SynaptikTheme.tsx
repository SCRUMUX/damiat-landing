import { useLayoutEffect, type ReactNode } from 'react';

export function SynaptikTheme({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'light');
    document.body.style.background = 'var(--color-bg-base)';
    document.body.style.color = 'var(--color-text-primary)';
    document.body.style.fontFamily = 'var(--font-family-base, system-ui, sans-serif)';
  }, []);

  return <>{children}</>;
}
