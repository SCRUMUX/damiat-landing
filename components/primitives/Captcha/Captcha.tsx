import React from 'react';
import type { CaptchaProps } from './Captcha.types';
import contract from '../../../contracts/components/Captcha.contract.json';
import { cn, findClasses, type VR } from '../_shared';
import { Spinner } from '../Spinner/Spinner';

const rules = (contract.variantRules || []) as unknown as VR[];

const BASE_CLASSES =
  'flex flex-row items-center justify-center gap-[var(--space-8)] border-solid border-[var(--border-width-base)] w-[var(--space-160)] h-[var(--space-72)]';

const CheckIcon: React.FC = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AlertIcon: React.FC = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
  </svg>
);

const CaptchaCheckbox: React.FC = () => (
  <span
    className="shrink-0 flex items-center justify-center w-[var(--space-24)] h-[var(--space-24)] rounded-[var(--radius-default)] border border-solid border-[var(--color-border-strong)] bg-[var(--color-surface-1)]"
    aria-hidden="true"
  />
);

export const Captcha = React.forwardRef<HTMLDivElement, CaptchaProps>((props, ref) => {
  const {
    state = 'idle',
    placeholder = 'Captcha',
    className,
    style,
    ...rest
  } = props;

  const stateClasses = findClasses(rules, { state });

  const iconNode = (() => {
    switch (state) {
      case 'loading': return <Spinner size="xs" appearance="inherit" />;
      case 'success': return <CheckIcon />;
      case 'error':   return <AlertIcon />;
      default:        return <CaptchaCheckbox />;
    }
  })();

  const statusLabel = (() => {
    switch (state) {
      case 'loading': return 'Verifying…';
      case 'success': return 'Verified';
      case 'error':   return 'Verification failed';
      default:        return placeholder;
    }
  })();

  return (
    <div
      ref={ref}
      role="group"
      aria-label="CAPTCHA verification"
      className={cn(
        BASE_CLASSES,
        'transition-colors duration-200',
        ...stateClasses,
        className,
      )}
      style={style}
      {...rest}
    >
      <span className="flex items-center justify-center">{iconNode}</span>
      <span className="text-style-caption select-none">{statusLabel}</span>
    </div>
  );
});

Captcha.displayName = 'Captcha';
