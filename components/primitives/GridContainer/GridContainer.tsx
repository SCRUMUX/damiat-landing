import React from 'react';
import type { GridContainerProps, GridItemProps, GridContainerMaxWidth } from './GridContainer.types';
import { cn, findClasses, type VR } from '../_shared';
import contract from '../../../contracts/components/GridContainer.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

/** Static maps — dynamic `col-span-${n}` breaks Tailwind JIT. */
const TABLET_COL_SPAN = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [i + 1, `tablet:col-span-${i + 1}`]),
) as Record<number, string>;
const DESKTOP_COL_SPAN = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [i + 1, `desktop:col-span-${i + 1}`]),
) as Record<number, string>;
const TABLET_COL_START = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [i + 1, `tablet:col-start-${i + 1}`]),
) as Record<number, string>;
const DESKTOP_COL_START = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [i + 1, `desktop:col-start-${i + 1}`]),
) as Record<number, string>;

/**
 * Responsive grid container that auto-switches 4→8→12 columns at breakpoints.
 * Uses the `.grid-container` Tailwind utility under the hood.
 */
export const GridContainer = React.forwardRef<HTMLDivElement, GridContainerProps>(
  (props, ref) => {
    const {
      maxWidth = 'desktop',
      centered = true,
      columns,
      as: Tag = 'div',
      className,
      style,
      children,
      ...rest
    } = props;

    const layoutClasses = findClasses(rules, { maxWidth: maxWidth as GridContainerMaxWidth });

    const customCols = columns
      ? {
          '--gc-mobile-cols': columns.mobile ?? 4,
          '--gc-tablet-cols': columns.tablet ?? 8,
          '--gc-desktop-cols': columns.desktop ?? 12,
        } as React.CSSProperties
      : undefined;

    return (
      <Tag
        ref={ref}
        className={cn(
          ...layoutClasses,
          centered && maxWidth !== 'full' && 'mx-auto',
          className,
        )}
        style={{ ...customCols, ...style }}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

GridContainer.displayName = 'GridContainer';

/**
 * Grid item that accepts responsive span/start props.
 * Generates Tailwind responsive classes for grid-column placement.
 */
export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  (props, ref) => {
    const { span, start, as: Tag = 'div', className, style, children, ...rest } = props;

    const spanStyle: React.CSSProperties = {};

    if (typeof span === 'number') {
      spanStyle.gridColumn = `span ${span}`;
    } else if (span) {
      if (span.mobile) spanStyle.gridColumn = `span ${span.mobile}`;
    }

    if (typeof start === 'number') {
      spanStyle.gridColumnStart = start;
    } else if (start) {
      if (start.mobile) spanStyle.gridColumnStart = start.mobile;
    }

    const responsiveClasses: string[] = [];
    if (typeof span === 'object') {
      if (span.tablet) responsiveClasses.push(TABLET_COL_SPAN[span.tablet] ?? '');
      if (span.desktop) responsiveClasses.push(DESKTOP_COL_SPAN[span.desktop] ?? '');
    }
    if (typeof start === 'object') {
      if (start.tablet) responsiveClasses.push(TABLET_COL_START[start.tablet] ?? '');
      if (start.desktop) responsiveClasses.push(DESKTOP_COL_START[start.desktop] ?? '');
    }

    return (
      <Tag
        ref={ref}
        className={cn(...responsiveClasses, className)}
        style={{ ...spanStyle, ...style }}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

GridItem.displayName = 'GridItem';
