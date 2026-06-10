import React from 'react';
import type { SectionHeaderProps, SectionHeaderSize } from './SectionHeader.types';
import { cn, findClasses, IconSlot, type VR } from '../_shared';
import contract from '../../../contracts/components/SectionHeader.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<SectionHeaderSize, string> = {
  sm: 'px-[var(--space-4)] py-[var(--space-2)] gap-[var(--space-4)] text-style-h4 [--icon-size:16px]',
  md: 'px-[var(--space-6)] py-[var(--space-3)] gap-[var(--space-6)] text-style-h2 [--icon-size:20px]',
  lg: 'px-[var(--space-8)] py-[var(--space-4)] gap-[var(--space-6)] text-style-h1 [--icon-size:24px]',
};

const SectionHeaderInner = React.forwardRef<HTMLDivElement, SectionHeaderProps>((props, ref) => {
  const {
    size = 'sm',
    appearance = 'base',
    iconLeft,
    badge,
    iconRight,
    showLeftIcon = false,
    showBadge = false,
    showRightIcon = false,
    children,
    className,
    ...rest
  } = props;

  const appearanceClasses = findClasses(rules, { appearance });

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex flex-row items-center',
        SIZE_CLASSES[size],
        ...appearanceClasses,
        className,
      )}
      {...rest}
    >
      {showLeftIcon && iconLeft && (
        <IconSlot icon={iconLeft} className="shrink-0" />
      )}

      <span className="font-semibold leading-none">{children}</span>

      {showBadge && badge && (
        <span className="shrink-0">{badge}</span>
      )}

      {showRightIcon && iconRight && (
        <IconSlot icon={iconRight} className="shrink-0" />
      )}
    </div>
  );
});

SectionHeaderInner.displayName = 'SectionHeader';
export const SectionHeader = React.memo(SectionHeaderInner);
