import React from 'react';
import type { FileUploadProps, FileUploadSize, FileUploadState } from './FileUpload.types';
import { cn, findClasses, getFocusRing, type VR } from '../_shared';
import contract from '../../../contracts/components/FileUpload.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<FileUploadSize, string> = {
  sm: 'min-h-[var(--space-80)] p-[var(--space-inset-m)] text-style-body-sm',
  md: 'min-h-[var(--space-120)] p-[var(--space-inset-l)] text-style-body',
  lg: 'min-h-[var(--space-160)] p-[var(--space-inset-xl)] text-style-body-lg',
};

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>((props, ref) => {
  const {
    size = 'sm',
    state = 'idle',
    children,
    className,
    ...rest
  } = props;

  const stateClasses = findClasses(rules, { state });
  const focusRing = getFocusRing(contract);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-colors duration-150 font-base box-border flex items-center justify-center',
        'border-dashed border-[var(--border-width-base)] rounded-medium',
        SIZE_CLASSES[size],
        ...stateClasses,
        focusRing,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';
