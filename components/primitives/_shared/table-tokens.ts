export type TableSize = 'sm' | 'md' | 'lg';

/** Checkbox column width (px) — layout data without matching spacing token. */
export const TABLE_CHECKBOX_WIDTH: Record<TableSize, number> = {
  sm: 40,
  md: 48,
  lg: 56,
};

/** Icon slot size (px) per table size. */
export const TABLE_ICON_SIZE: Record<TableSize, number> = {
  sm: 16,
  md: 16,
  lg: 20,
};

/** @deprecated Use TABLE_CHECKBOX_WIDTH */
export const TABLE_SIZE_MAP = {
  sm: { checkboxColWidth: TABLE_CHECKBOX_WIDTH.sm, iconSize: TABLE_ICON_SIZE.sm },
  md: { checkboxColWidth: TABLE_CHECKBOX_WIDTH.md, iconSize: TABLE_ICON_SIZE.md },
  lg: { checkboxColWidth: TABLE_CHECKBOX_WIDTH.lg, iconSize: TABLE_ICON_SIZE.lg },
} as const;

export type TableSizeSpec = (typeof TABLE_SIZE_MAP)[TableSize];
