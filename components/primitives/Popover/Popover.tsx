import React from 'react';
import { RadixPopover } from '../_internal';
import { cn, findClasses, type VR } from '../_shared';
import type { PopoverProps } from './Popover.types';
import contract from '../../../contracts/components/Popover.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

/**
 * Popover — positioned floating panel anchored to its containing element.
 *
 * Used by Dropdown, Autocomplete and any other component that needs a
 * panel anchored to a control. Positioning, viewport flip and a11y are
 * delegated to `@radix-ui/react-popover` (encapsulated in
 * `_internal/Popover/RadixPopover`).
 *
 * The Anchor is rendered as an invisible `<span>` that spans
 * `absolute inset-0` of its parent, which means the parent element of
 * `<Popover>` becomes the positioning anchor — this preserves the legacy
 * AICADS invocation pattern:
 *
 *     <div className="relative" ref={triggerRef}>
 *       <Input />
 *       <Popover open={isOpen}>...content...</Popover>
 *     </div>
 *
 * By default, dismissal (Escape, click-outside) and focus management are
 * intentionally suppressed so existing AICADS `behaviors/` keep ownership
 * over those gestures. Pass `inheritDismissBehavior` to opt in.
 */
export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      open,
      onOpenChange,
      inheritDismissBehavior = false,
      children,
      className = '',
      maxHeight = 'var(--popover-max-h, 320px)',
      contentPadding = 'var(--space-inset-s)',
      autoFlip = true,
      style,
      'aria-multiselectable': ariaMultiselectable,
      'aria-label': ariaLabel,
      id,
    },
    ref,
  ) => {
    const handleOpenChange = onOpenChange ?? (() => {});

    const preventIfNotInherited = (event: { preventDefault: () => void }) => {
      if (!inheritDismissBehavior) event.preventDefault();
    };

    const surfaceClasses = findClasses(rules, {});

    return (
      <RadixPopover.Root open={open} onOpenChange={handleOpenChange}>
        <RadixPopover.Anchor className="absolute inset-0 pointer-events-none" />
        <RadixPopover.Portal>
          <RadixPopover.Content
            ref={ref}
            id={id}
            role="listbox"
            aria-multiselectable={ariaMultiselectable || undefined}
            aria-label={ariaLabel}
            align="start"
            side="bottom"
            sideOffset={2}
            avoidCollisions={autoFlip}
            collisionPadding={8}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onEscapeKeyDown={preventIfNotInherited}
            onPointerDownOutside={preventIfNotInherited}
            onInteractOutside={preventIfNotInherited}
            className={cn(...surfaceClasses, className)}
            style={{
              width: 'var(--radix-popover-anchor-width)',
              padding: contentPadding,
              maxHeight,
              ...style,
            }}
          >
            {children}
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    );
  },
);

Popover.displayName = 'Popover';
