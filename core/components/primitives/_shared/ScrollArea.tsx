import React from 'react';
import { cn } from './utils';
import { radixRootRest } from './radixDomProps';
import { RadixScrollArea } from '../_internal';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
  children: React.ReactNode;
}

/**
 * ScrollArea — scrollable region with styled scrollbar, backed by `@radix-ui/react-scroll-area`.
 */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ maxHeight, className, style, children, ...rest }, ref) => (
    <RadixScrollArea.Root
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      style={{ maxHeight, ...style }}
      {...radixRootRest(rest)}
    >
      <RadixScrollArea.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        orientation="vertical"
        className="flex touch-none select-none p-0.5 transition-colors duration-150 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
      >
        <RadixScrollArea.Thumb className="relative flex-1 rounded-full bg-[var(--color-surface-3)] hover:bg-[var(--color-border-strong)]" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Scrollbar
        orientation="horizontal"
        className="flex touch-none select-none p-0.5 transition-colors duration-150 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
      >
        <RadixScrollArea.Thumb className="relative flex-1 rounded-full bg-[var(--color-surface-3)] hover:bg-[var(--color-border-strong)]" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  ),
);

ScrollArea.displayName = 'ScrollArea';
