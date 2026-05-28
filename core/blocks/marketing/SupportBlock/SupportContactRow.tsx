import React from 'react';
import { BLOCK_SUPPORT_CONTACT_ROW_CLASS } from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import type { SupportContactItem } from './SupportBlock.types';

export interface SupportContactRowProps extends SupportContactItem {
  className?: string;
}

export const SupportContactRow: React.FC<SupportContactRowProps> = ({
  label,
  value,
  href,
  icon,
  className,
}) => (
  <div
    className={cn(
      'flex items-center justify-between gap-[var(--space-section-stack-s)]',
      BLOCK_SUPPORT_CONTACT_ROW_CLASS,
      className,
    )}
  >
    <div className="flex min-w-0 items-center gap-[var(--space-section-stack-s)] min-[1024px]:gap-[var(--space-section-content-m)]">
      {icon}
      <span className="font-medium text-style-h4">{label}</span>
    </div>
    <a
      href={href}
      className={cn(
        'shrink-0 text-style-body-sm text-[var(--color-text-secondary)] no-underline',
        'transition-colors duration-200 hover:text-[var(--color-brand-primary)]',
        'min-[1024px]:text-style-body',
      )}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
    >
      {value}
    </a>
  </div>
);

SupportContactRow.displayName = 'SupportContactRow';
