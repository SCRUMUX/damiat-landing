import React from 'react';
import { cn } from '../../components/primitives/_shared';
import {
  BLOCK_GRID_BASE_CLASS,
  BLOCK_GRID_COL_CLASS,
  BLOCK_GRID_ITEM_CLASS,
} from './blockLayout';

export interface BlockGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

/** Responsive marketing grid — equal columns, shared gutters, no orphaned cards at 1024px+. */
export const BlockGrid: React.FC<BlockGridProps> = ({
  children,
  className,
  columns = 3,
}) => (
  <div
    className={cn(BLOCK_GRID_BASE_CLASS, BLOCK_GRID_COL_CLASS[columns], className)}
  >
    {React.Children.map(children, (child) =>
      React.isValidElement(child) ? (
        <div className={BLOCK_GRID_ITEM_CLASS}>{child}</div>
      ) : (
        child
      ),
    )}
  </div>
);

BlockGrid.displayName = 'BlockGrid';
