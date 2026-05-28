import React from 'react';
import {
  BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS,
} from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { ArrowUpRightIcon } from './TrustBlockIcons';
import type { TrustStandardItem } from './TrustBlock.types';

export interface TrustStandardLinkProps extends TrustStandardItem {
  className?: string;
}

const LINK_ARROW_CLASS = cn(
  BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS,
  'h-[var(--space-24)] w-[var(--space-24)] min-[1024px]:h-[var(--space-32)] min-[1024px]:w-[var(--space-32)]',
);

export const TrustStandardLink: React.FC<TrustStandardLinkProps> = ({
  title,
  description,
  href,
  className,
}) => {
  const label = (
    <>
      <span
        className={cn(
          'font-medium text-style-body transition-colors duration-200 min-[1024px]:text-style-h4',
          href && 'group-hover:text-[var(--color-brand-primary)]',
        )}
      >
        {title}
      </span>
      {href ? (
        <span className={LINK_ARROW_CLASS} aria-hidden="true">
          <ArrowUpRightIcon className="h-[var(--space-14)] w-[var(--space-14)] min-[1024px]:h-[var(--space-16)] min-[1024px]:w-[var(--space-16)]" />
        </span>
      ) : null}
    </>
  );

  return (
    <div className={cn('flex w-full min-w-0 max-w-[var(--space-320)] flex-col', className)}>
      {href ? (
        <a
          href={href}
          className="group inline-flex w-fit max-w-full items-center gap-[var(--space-section-stack-s)] no-underline text-inherit min-[1024px]:gap-[var(--space-section-stack-m)]"
        >
          {label}
        </a>
      ) : (
        <div className="inline-flex w-fit max-w-full items-center gap-[var(--space-section-stack-s)] min-[1024px]:gap-[var(--space-section-stack-m)]">
          {label}
        </div>
      )}
      <p
        className={cn(
          'm-0 mt-[var(--space-section-stack-s)] max-w-[var(--space-200)]',
          'text-style-caption text-[var(--color-text-secondary)] min-[1024px]:mt-[var(--space-section-stack-m)]',
        )}
      >
        {description}
      </p>
    </div>
  );
};

TrustStandardLink.displayName = 'TrustStandardLink';
