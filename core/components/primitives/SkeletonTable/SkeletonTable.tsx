import React from 'react';
import type { SkeletonTableProps, SkeletonTableSize } from './SkeletonTable.types';
import { SkeletonBlock } from '../_shared/SkeletonBlock';
import { cn, getSkeletonContainerClasses } from '../_shared';

/**
 * SkeletonTable — token-driven outer container, table grid silhouette stays
 * here. Cell paddings (cellPadX, cellPadY) are kept as numbers per-size
 * because they have no clean tokens that hit the Figma values (12/14/16 by
 * 3/4/5) — they live as component-internal layout data.
 */
const SIZE: Record<SkeletonTableSize, {
  rowH: number; cellPadX: number; cellPadY: number;
  colWidths: number[]; headerCellH: number;
}> = {
  sm: { rowH: 28, cellPadX: 12, cellPadY: 3, colWidths: [48, 112, 80, 80],   headerCellH: 8 },
  md: { rowH: 32, cellPadX: 14, cellPadY: 4, colWidths: [64, 160, 112, 120], headerCellH: 8 },
  lg: { rowH: 36, cellPadX: 16, cellPadY: 5, colWidths: [80, 200, 150, 170], headerCellH: 8 },
};

const CELL_LINE_WIDTHS = [
  [17, 53, 45, 28],
  [22, 70, 38, 40],
  [17, 53, 45, 28],
  [22, 70, 38, 40],
];

const SkeletonTableInner = React.forwardRef<HTMLDivElement, SkeletonTableProps>(({
  size = 'sm',
  shimmer = true,
  rows = 4,
  cols = 4,
  className,
  style,
}, ref) => {
  const s = SIZE[size];
  const colWidths = s.colWidths.slice(0, cols);
  const totalW = colWidths.reduce((a, b) => a + b, 0) + (colWidths.length - 1);
  const containerClasses = getSkeletonContainerClasses('table', size);

  const renderRow = (rowIdx: number, isHeader: boolean) => {
    const lineWidths = CELL_LINE_WIDTHS[rowIdx % CELL_LINE_WIDTHS.length];
    return (
      <div
        key={rowIdx}
        className={cn(
          'flex flex-row',
          isHeader && 'bg-[var(--color-surface-2)]',
        )}
        style={{ height: s.rowH }}
      >
        {colWidths.map((colW, colIdx) => (
          <React.Fragment key={colIdx}>
            {/* Cell */}
            <div
              className="flex items-center shrink-0"
              style={{
                width: colW,
                height: s.rowH,
                paddingLeft: s.cellPadX,
                paddingRight: s.cellPadX,
                paddingTop: s.cellPadY,
                paddingBottom: s.cellPadY,
              }}
            >
              <SkeletonBlock
                shimmer={shimmer}
                width={isHeader
                  ? Math.round(colW * 0.55)
                  : (lineWidths[colIdx] ?? Math.round(colW * 0.4))}
                height={s.headerCellH}
                radius="var(--radius-default)"
              />
            </div>
            {/* Vertical column divider */}
            {colIdx < colWidths.length - 1 && (
              <div
                className="w-px shrink-0 bg-[var(--color-border-base)]"
                style={{ height: s.rowH }}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden border border-solid border-[var(--color-border-base)]',
        ...containerClasses,
        className,
      )}
      style={style}
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      {/* Header row */}
      {renderRow(-1, true)}

      {/* Data rows with dividers */}
      {Array.from({ length: rows }).map((_, i) => (
        <React.Fragment key={i}>
          <div className="h-px w-full bg-[var(--color-border-base)]" aria-hidden="true" />
          {renderRow(i, false)}
        </React.Fragment>
      ))}
    </div>
  );
});

SkeletonTableInner.displayName = 'SkeletonTable';
export const SkeletonTable = React.memo(SkeletonTableInner);
