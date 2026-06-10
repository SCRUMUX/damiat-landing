import React from 'react';
import { Button } from '../../components/primitives/Button';
import { cn } from '../../components/primitives/_shared';

export interface BlockActionProps {
  label: string;
  onClick?: () => void;
  href?: string;
  appearance?: 'brand' | 'outline' | 'base';
  size?: 'sm' | 'md' | 'lg';
  /** Use on brand section backgrounds (hero band, CTA band). */
  onBrand?: boolean;
  className?: string;
}

const LINK_APPEARANCE: Record<NonNullable<BlockActionProps['appearance']>, string> = {
  brand:
    'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] border border-transparent hover:bg-[var(--color-brand-hover)]',
  outline:
    'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-base)] hover:bg-[var(--color-surface-2)]',
  base:
    'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border-base)] hover:bg-[var(--color-surface-3)]',
};

const ON_BRAND_LINK_APPEARANCE: Record<NonNullable<BlockActionProps['appearance']>, string> = {
  brand:
    'bg-[var(--color-surface-1)] text-[var(--color-text-primary)] border border-transparent hover:bg-[var(--color-surface-2)]',
  outline:
    'bg-transparent text-[var(--color-text-on-brand)] border border-[var(--color-text-on-brand)]/40 hover:bg-[var(--color-text-on-brand)]/10',
  base:
    'bg-[var(--color-text-on-brand)]/15 text-[var(--color-text-on-brand)] border border-[var(--color-text-on-brand)]/25 hover:bg-[var(--color-text-on-brand)]/25',
};

const LINK_SIZE: Record<NonNullable<BlockActionProps['size']>, string> = {
  sm: 'px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)] min-h-[var(--space-button-h-sm)] text-style-caption rounded-[var(--radius-button)]',
  md: 'px-[var(--space-button-x-md)] py-[var(--space-button-y-md)] min-h-[var(--space-button-h-md)] text-style-body rounded-[var(--radius-button)]',
  lg: 'px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)] min-h-[var(--space-button-h-lg)] text-style-body-lg rounded-[var(--radius-button)]',
};

/** Button-styled action for pattern blocks — supports href without invalid nested buttons. */
export const BlockAction: React.FC<BlockActionProps> = ({
  label,
  onClick,
  href,
  appearance = 'brand',
  size = 'lg',
  onBrand = false,
  className,
}) => {
  const appearanceClasses = onBrand ? ON_BRAND_LINK_APPEARANCE[appearance] : LINK_APPEARANCE[appearance];

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={cn(
          'inline-flex items-center justify-center font-medium no-underline transition-colors duration-150',
          appearanceClasses,
          LINK_SIZE[size],
          className,
        )}
      >
        {label}
      </a>
    );
  }

  return (
    <Button appearance={appearance} size={size} onClick={onClick} className={className}>
      {label}
    </Button>
  );
};
