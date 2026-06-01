/**
 * Layout constants for harvest chart grid / SVG geometry.
 * Pixel values are intentional — tied to chart scale math, not typography tokens.
 */
export const CALC_CHART_HEIGHT = 250;
/** Label column: Y-axis ticks + metric row labels */
export const CALC_LABEL_COL_WIDTH = 104;
export const CALC_METRIC_ROW_HEIGHT = 36;
/** Две строки в ячейке (потери мес.: т + ₽) */
export const CALC_METRIC_ROW_HEIGHT_STACKED = 44;
export const CALC_MONTH_ROW_HEIGHT = 28;
export const CALC_AXIS_FONT_SIZE = 16;
/** Vertical padding inside chart area — symmetric price/loss zones */
export const CALC_CHART_PAD = 14;
/** Max bar height as fraction of each half-zone */
export const CALC_BAR_ZONE_FILL = 0.92;
/** Logical slot width in SVG viewBox (scales via CSS grid 1fr) */
export const CALC_SLOT_VIEW_WIDTH = 148;
export const CALC_PRICE_BAR_MAX_WIDTH = 26;
export const CALC_FORECAST_X_OFFSET = 2;
export const CALC_BAR_X_OFFSET = 2;
export const CALC_AXIS_LABEL_OFFSET = 6;
export const CALC_LEGEND_SWATCH_SIZE = 12;
