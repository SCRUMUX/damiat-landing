import React, { useEffect } from 'react';
import { cn } from '../../../components/primitives/_shared';

export interface LoginStubPanelProps {
  open: boolean;
  onClose: () => void;
}

/** Заглушка входа — замените на auth provider или страницу /login. */
export function LoginStubPanel({ open, onClose }: LoginStubPanelProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[calc(var(--z-modal)+4)] flex items-center justify-center p-[var(--space-inset-l)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="damiat-login-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--effect-glass-scrim-bg)] backdrop-blur-background"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full max-w-[var(--space-480)] rounded-[var(--radius-section)]',
          'border border-[var(--color-border-base)] bg-[var(--color-surface-1)]',
          'p-[var(--space-inset-xl)] shadow-elevation-2',
        )}
      >
        <h2 id="damiat-login-title" className="m-0 text-style-h3 text-[var(--color-text-primary)]">
          Вход в личный кабинет
        </h2>
        <p className="mt-[var(--space-section-stack-m)] text-style-body text-[var(--color-text-secondary)]">
          Раздел в разработке. Подключите SSO или форму авторизации в consumer-приложении.
        </p>
        <button
          type="button"
          className="mt-[var(--space-section-content-m)] w-full rounded-[var(--radius-button)] border-0 bg-[var(--color-brand-primary)] px-[var(--space-inset-l)] py-[var(--space-12)] text-style-body font-medium text-[var(--color-text-on-brand)]"
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
