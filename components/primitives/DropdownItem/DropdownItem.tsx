import React, { useState, useCallback, useRef } from 'react';
import type { DropdownItemProps, DropdownItemSize } from './DropdownItem.types';
import { cn, findClasses, getFocusRing, IconSlot, type VR } from '../_shared';
import contract from '../../../contracts/components/DropdownItem.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<DropdownItemSize, string> = {
  sm: 'min-h-[var(--space-28)] px-[var(--space-button-x-sm)] py-[var(--space-button-y-sm)] gap-[var(--space-button-gap-sm)] text-style-body-sm [--icon-size:20px]',
  md: 'min-h-[var(--space-36)] px-[var(--space-button-x-md)] py-[var(--space-button-y-md)] gap-[var(--space-button-gap-md)] [--icon-size:20px]',
  lg: 'min-h-[var(--space-40)] px-[var(--space-button-x-lg)] py-[var(--space-button-y-lg)] gap-[var(--space-button-gap-lg)] text-style-body-lg [--icon-size:24px]',
};

const ChevronRight: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="w-full h-full">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps & { onClick?: () => void }>((props, ref) => {
  const {
    size = 'sm',
    appearance: appearanceProp,
    itemType,
    checkbox,
    iconLeft,
    badge,
    iconRight,
    showCheckbox = false,
    showIconLeft = false,
    showBadge = false,
    showIconRight = false,
    submenuItems,
    children,
    className,
    onClick,
    ...rest
  } = props;

  const appearance = appearanceProp ?? itemType ?? 'default';
  const appearanceClasses = findClasses(rules, { itemType: appearance });
  const focusRing = getFocusRing(contract);

  const hasSubmenu = submenuItems && submenuItems.length > 0;
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const itemRef = useRef<HTMLDivElement>(null);

  const openSubmenu = useCallback(() => {
    clearTimeout(timerRef.current);
    setSubmenuOpen(true);
  }, []);

  const closeSubmenu = useCallback(() => {
    timerRef.current = setTimeout(() => setSubmenuOpen(false), 150);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (hasSubmenu && e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      setSubmenuOpen(true);
    }
    if (hasSubmenu && e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      setSubmenuOpen(false);
    }
  }, [hasSubmenu]);

  return (
    <div
      ref={ref ?? itemRef}
      className={cn(
        'relative transition-colors duration-150 font-base box-border flex flex-row justify-start items-center text-[var(--item-text)]',
        SIZE_CLASSES[size],
        ...appearanceClasses,
        focusRing,
        className,
      )}
      onMouseEnter={hasSubmenu ? openSubmenu : undefined}
      onMouseLeave={hasSubmenu ? closeSubmenu : undefined}
      onKeyDown={handleKeyDown}
      onClick={!hasSubmenu ? onClick : undefined}
      {...rest}
    >
      {showCheckbox && checkbox && <div className="shrink-0 flex items-center">{checkbox}</div>}
      {showIconLeft && iconLeft && <IconSlot icon={iconLeft} className="shrink-0 text-[var(--item-icon)]" />}
      <span className="flex-1 min-w-0 truncate">{children}</span>
      {showBadge && badge && <div className="shrink-0 flex items-center">{badge}</div>}
      {hasSubmenu ? (
        <span className="shrink-0 flex items-center justify-center w-[var(--icon-size,20px)] h-[var(--icon-size,20px)] text-[var(--item-icon)]">
          <ChevronRight />
        </span>
      ) : showIconRight && iconRight ? (
        <IconSlot icon={iconRight} className="shrink-0 text-[var(--item-icon)]" />
      ) : null}

      {hasSubmenu && submenuOpen && (
        <div
          className={cn(
            'absolute left-full top-0 z-popover min-w-[var(--space-160)]',
            'bg-[var(--color-surface-1)] border border-[var(--border-width-base)] border-[var(--color-border-base)]',
            'rounded-default shadow-elevation-2 p-[var(--space-dropdown-popover-inset)]',
          )}
          style={{ marginLeft: 'var(--space-dropdown-submenu-offset, var(--space-4))' }}
          onMouseEnter={openSubmenu}
          onMouseLeave={closeSubmenu}
        >
          {submenuItems!.map(({ onClick: subClick, children: subChildren, ...subProps }, i) => (
            <DropdownItem
              key={i}
              size={size}
              {...subProps}
              className={cn('cursor-pointer hover:bg-[var(--color-surface-3)]', subProps.className)}
              onClick={() => subClick?.()}
            >
              {subChildren}
            </DropdownItem>
          ))}
        </div>
      )}
    </div>
  );
});

DropdownItem.displayName = 'DropdownItem';
