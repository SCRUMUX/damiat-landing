import React, { useState, useCallback } from 'react';
import type { LinkProps, LinkSize, LinkState } from './Link.types';
import { cn, findClasses, getFocusRing, IconSlot, type VR } from '../_shared';
import contract from '../../../contracts/components/Link.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<LinkSize, string> = {
  sm: 'gap-[var(--space-2)] text-style-caption [--icon-size:20px]',
  md: 'gap-[var(--space-4)] text-style-body [--icon-size:20px]',
  lg: 'gap-[var(--space-6)] text-style-body-lg [--icon-size:24px]',
};

const DefaultLinkIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M8.5 5H6.5C5.39543 5 4.5 5.89543 4.5 7V13.5C4.5 14.6046 5.39543 15.5 6.5 15.5H13C14.1046 15.5 15 14.6046 15 13.5V11.5M11.5 4.5H15.5M15.5 4.5V8.5M15.5 4.5L9 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const {
    size = 'sm',
    state: controlledState,
    iconRight,
    showLabel = true,
    showRightIcon = true,
    children,
    className,
    onMouseEnter, onMouseLeave, onFocus, onBlur,
    ...rest
  } = props;

  const [internalState, setInternalState] = useState<LinkState>('base');
  const effectiveState: LinkState = controlledState === 'disabled' ? 'disabled' : controlledState ?? internalState;

  const stateClasses = findClasses(rules, { state: effectiveState });
  const focusRing = getFocusRing(contract);

  const isDisabled = effectiveState === 'disabled';

  const he = useCallback((e: React.MouseEvent) => { setInternalState('hover'); onMouseEnter?.(e as any); }, [onMouseEnter]);
  const hl = useCallback((e: React.MouseEvent) => { setInternalState('base'); onMouseLeave?.(e as any); }, [onMouseLeave]);
  const hf = useCallback((e: React.FocusEvent) => { setInternalState('hover'); onFocus?.(e as any); }, [onFocus]);
  const hb = useCallback((e: React.FocusEvent) => { setInternalState('base'); onBlur?.(e as any); }, [onBlur]);
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) { e.preventDefault(); return; }
    (rest as any).onClick?.(e);
  }, [isDisabled, (rest as any).onClick]);

  const resolvedIcon = iconRight ?? (showRightIcon ? <DefaultLinkIcon /> : null);

  return (
    <a
      ref={ref as any}
      className={cn(
        'transition-colors duration-150 font-base box-border inline-flex flex-row items-center',
        SIZE_CLASSES[size],
        ...stateClasses,
        focusRing,
        isDisabled && 'cursor-not-allowed',
        className,
      )}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : undefined}
      onMouseEnter={he}
      onMouseLeave={hl}
      onFocus={hf}
      onBlur={hb}
      onClick={handleClick}
      {...rest}
    >
      {showLabel && <span>{children}</span>}
      {showRightIcon && resolvedIcon && (
        <IconSlot icon={resolvedIcon} className="shrink-0" />
      )}
    </a>
  );
});

Link.displayName = 'Link';
