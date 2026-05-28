import React, { useCallback } from 'react';
import type { ModalProps, ModalVariant, ModalSize } from './Modal.types';
import { Button } from '../Button/Button';
import { cn, findClasses, getFocusRing, ScrollArea, type VR } from '../_shared';
import { RadixDialog } from '../_internal';
import contract from '../../../contracts/components/Modal.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'w-[var(--space-400)]',
  md: 'w-[var(--space-480)]',
  lg: 'w-[var(--space-600)]',
};

const EMBEDDED_SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'w-full max-w-[var(--space-400)]',
  md: 'w-full max-w-[var(--space-480)]',
  lg: 'w-full max-w-[var(--space-600)]',
};

const SCRIM: Record<ModalVariant, string> = {
  base: 'var(--effect-scrim-light)',
  danger: 'var(--effect-scrim-strong)',
  warning: 'var(--effect-scrim-strong)',
  success: 'var(--effect-scrim-light)',
};

const CONFIRM_APPEARANCE: Record<ModalVariant, 'brand' | 'danger' | 'warning' | 'success'> = {
  base: 'brand',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
};

const CloseIcon: React.FC = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

type PanelBodyProps = Pick<
  ModalProps,
  | 'showClose'
  | 'showFooter'
  | 'title'
  | 'content'
  | 'cancelLabel'
  | 'confirmLabel'
  | 'cancelButton'
  | 'confirmButton'
  | 'confirmLoading'
  | 'onClose'
  | 'onConfirm'
  | 'onCancel'
> & {
  closeFocusRing: string;
  confirmAppearance: 'brand' | 'danger' | 'warning' | 'success';
  scrollMaxHeight?: string;
};

const ModalPanelBody: React.FC<PanelBodyProps> = ({
  showClose = true,
  showFooter = true,
  title,
  content,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  cancelButton,
  confirmButton,
  confirmLoading = false,
  onClose,
  onConfirm,
  onCancel,
  closeFocusRing,
  confirmAppearance,
  scrollMaxHeight = '60vh',
}) => {
  const handleCancel = useCallback(() => {
    onCancel?.();
    onClose?.();
  }, [onCancel, onClose]);

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-[var(--space-8)]">
        <div className="flex-1 min-w-0 text-style-h4 font-semibold text-[var(--title-color,var(--color-text-primary))]">
          {title}
        </div>
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'shrink-0 flex items-center justify-center w-[var(--space-20)] h-[var(--space-20)]',
              'text-[var(--close-icon,var(--color-icon-on-base))]',
              'hover:text-[var(--color-text-primary)] transition-colors duration-150',
              'rounded',
              closeFocusRing,
            )}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <ScrollArea
        maxHeight={scrollMaxHeight}
        className="text-style-body-sm text-[var(--color-text-primary)]"
      >
        {content}
      </ScrollArea>

      {showFooter && (
        <div className="flex flex-row items-center gap-[var(--space-4)]">
          {cancelButton ?? (
            <Button appearance="ghost" size="sm" onClick={handleCancel}>
              {cancelLabel}
            </Button>
          )}
          {confirmButton ?? (
            <Button
              appearance={confirmAppearance}
              size="sm"
              onClick={onConfirm}
              loading={confirmLoading}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const {
    variant = 'base',
    size = 'md',
    showClose = true,
    showFooter = true,
    title = 'Modal title',
    content = 'Modal content.',
    cancelLabel = 'Cancel',
    confirmLabel = 'Confirm',
    onClose,
    onConfirm,
    onCancel,
    cancelButton,
    confirmButton,
    open = true,
    portal = true,
    embedded = false,
    confirmLoading = false,
    className,
    style,
  } = props;

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) onClose?.();
  }, [onClose]);

  const panelClasses = findClasses(rules, { variant });
  const closeFocusRing = getFocusRing(contract, variant);
  const confirmAppearance = CONFIRM_APPEARANCE[variant];
  const panelBodyProps = {
    showClose,
    showFooter,
    title,
    content,
    cancelLabel,
    confirmLabel,
    cancelButton,
    confirmButton,
    confirmLoading,
    onClose,
    onConfirm,
    onCancel,
    closeFocusRing,
    confirmAppearance,
  };

  if (embedded) {
    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal={false}
        className={cn(
          'relative flex flex-col',
          'border-solid border-[var(--border-width-base)]',
          EMBEDDED_SIZE_CLASSES[size],
          ...panelClasses,
          className,
        )}
        style={style}
      >
        <ModalPanelBody {...panelBodyProps} scrollMaxHeight={undefined} />
      </div>
    );
  }

  const positioning = portal ? 'fixed' : 'absolute';

  const dialogBody = (
    <>
      <RadixDialog.Overlay
        className={cn(`${positioning} inset-0 z-modal animate-fade-in`)}
        style={{ backgroundColor: SCRIM[variant] }}
      />
      <RadixDialog.Content
        ref={ref}
        className={cn(
          `${positioning} z-modal left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`,
          'flex flex-col animate-modal-in',
          'border-solid border-[var(--border-width-base)]',
          'max-w-[calc(100vw-var(--space-32))]',
          SIZE_CLASSES[size],
          ...panelClasses,
          'focus:outline-none',
          className,
        )}
        style={style}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex flex-row items-center justify-between gap-[var(--space-8)]">
          <RadixDialog.Title className="flex-1 min-w-0 text-style-h4 font-semibold text-[var(--title-color,var(--color-text-primary))]">
            {title}
          </RadixDialog.Title>
          {showClose && (
            <RadixDialog.Close asChild>
              <button
                type="button"
                className={cn(
                  'shrink-0 flex items-center justify-center w-[var(--space-20)] h-[var(--space-20)]',
                  'text-[var(--close-icon,var(--color-icon-on-base))]',
                  'hover:text-[var(--color-text-primary)] transition-colors duration-150',
                  'rounded',
                  closeFocusRing,
                )}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </button>
            </RadixDialog.Close>
          )}
        </div>

        <RadixDialog.Description asChild>
          <ScrollArea
            maxHeight="60vh"
            className="text-style-body-sm text-[var(--color-text-primary)]"
          >
            {content}
          </ScrollArea>
        </RadixDialog.Description>

        {showFooter && (
          <div className="flex flex-row items-center gap-[var(--space-4)]">
            {cancelButton ?? (
              <Button appearance="ghost" size="sm" onClick={() => { onCancel?.(); onClose?.(); }}>
                {cancelLabel}
              </Button>
            )}
            {confirmButton ?? (
              <Button
                appearance={confirmAppearance}
                size="sm"
                onClick={onConfirm}
                loading={confirmLoading}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </RadixDialog.Content>
    </>
  );

  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpenChange}>
      {portal ? (
        <RadixDialog.Portal>{dialogBody}</RadixDialog.Portal>
      ) : (
        dialogBody
      )}
    </RadixDialog.Root>
  );
});

Modal.displayName = 'Modal';
