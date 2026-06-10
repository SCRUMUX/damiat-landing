/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */
import React from 'react';
import type { TagRowProps } from './TagRow.types';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/TagRow.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

export const TagRow = React.forwardRef<HTMLDivElement, TagRowProps>((props, ref) => {
  const {
    children,
    className,
    ...rest
  } = props;

  const layoutClasses = findClasses(rules, {});

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        'inline-flex flex-row items-center',
        ...layoutClasses,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

TagRow.displayName = 'TagRow';
