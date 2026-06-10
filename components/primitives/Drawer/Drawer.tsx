import React, { useCallback } from 'react';
import type { DrawerProps, DrawerSize } from './Drawer.types';
import { cn, findClasses, getFocusRing, ScrollArea, type VR } from '../_shared';
import { VaulDrawer } from '../_internal';
import contract from '../../../contracts/components/Drawer.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<DrawerSize, string> = {
  sm: 'w-[var(--space-320)]',
  md: 'w-[var(--space-480)]',
  lg: 'w-[var(--space-640)]',
};

const CloseIcon: React.FC = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true" className="w-[var(--space-20)] h-[var(--space-20)]">
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * Drawer — side panel overlay that slides in from the left or right edge.
 *
 * Backed by `vaul` (encapsulated in `_internal/Drawer/VaulDrawer`).
 * Handles overlay, focus trap, escape dismissal and slide animations.
 */
export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>((props, ref) => {
  const {
    open = false,
    onClose,
    onOpenChange,
    size = 'sm',
    side = 'left',
    title,
    content,
    showClose = true,
    children,
    className,
    style,
  } = props;

  const panelClasses = findClasses(rules, {});
  const closeFocusRing = getFocusRing(contract);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) onClose?.();
  }, [onOpenChange, onClose]);

  const panelBody = content ?? children;

  return (
    <VaulDrawer.Root open={open} onOpenChange={handleOpenChange} direction={side}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 z-modal bg-[var(--effect-scrim-light)]" />
        <VaulDrawer.Content
          ref={ref}
          className={cn(
            'fixed z-modal flex flex-col outline-none max-w-[90vw] shadow-elevation-2',
            'border-solid border-[var(--border-width-base)]',
            side === 'left' ? 'left-0 top-0 h-full border-r' : 'right-0 top-0 h-full border-l',
            SIZE_CLASSES[size],
            ...panelClasses,
            className,
          )}
          style={style}
        >
          {(title || showClose) && (
            <div className="flex items-center justify-between gap-[var(--space-8)] p-[var(--space-inset-l)] border-b border-[var(--color-border-base)] shrink-0">
              {title ? (
                <VaulDrawer.Title className="text-style-h4 text-[var(--color-text-primary)]">
                  {title}
                </VaulDrawer.Title>
              ) : (
                <span />
              )}
              {showClose && (
                <VaulDrawer.Close asChild>
                  <button
                    type="button"
                    className={cn(
                      'shrink-0 flex items-center justify-center w-[var(--space-20)] h-[var(--space-20)]',
                      'text-[var(--color-icon-on-base)]',
                      'hover:text-[var(--color-text-primary)] transition-colors duration-150',
                      'rounded-default',
                      closeFocusRing,
                    )}
                    aria-label="Close drawer"
                  >
                    <CloseIcon />
                  </button>
                </VaulDrawer.Close>
              )}
            </div>
          )}

          <ScrollArea className="flex-1 p-[var(--space-inset-l)] text-style-body text-[var(--color-text-primary)]">
            {panelBody}
          </ScrollArea>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
});

Drawer.displayName = 'Drawer';
