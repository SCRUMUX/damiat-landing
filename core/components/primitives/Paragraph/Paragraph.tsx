import React from 'react';
import type { ParagraphProps, ParagraphSize, ParagraphBreakpoint } from './Paragraph.types';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/Paragraph.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<ParagraphSize, string> = {
  sm: 'text-style-body-sm',
  md: 'text-style-body',
  lg: 'text-style-body-lg',
};

const ALIGN_CLASSES: Record<string, string> = {
  left:    'text-left',
  center:  'text-center',
  right:   'text-right',
  justify: 'text-justify',
};

const ParagraphInner = React.forwardRef<HTMLParagraphElement, ParagraphProps>((props, ref) => {
  const {
    size = 'md',
    breakpoint,
    align = 'left',
    color,
    children,
    className,
    style,
    ...rest
  } = props;

  const baseClasses = findClasses(rules, {});
  const breakpointClasses = breakpoint
    ? findClasses(rules, { breakpoint: breakpoint as ParagraphBreakpoint })
    : [];

  return (
    <p
      ref={ref}
      className={cn(
        'font-normal box-border text-[var(--color-text-primary)]',
        SIZE_CLASSES[size],
        ...baseClasses,
        ...breakpointClasses,
        !breakpoint && 'w-full',
        ALIGN_CLASSES[align] ?? 'text-left',
        className,
      )}
      style={{
        color: color ?? undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </p>
  );
});

ParagraphInner.displayName = 'Paragraph';
export const Paragraph = React.memo(ParagraphInner);
