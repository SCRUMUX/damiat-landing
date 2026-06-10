/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** Star rating component. 3 sizes (sm/md/lg), readonly or interactive, values 0-5. */

export type RatingSize = 'sm' | 'md' | 'lg';

/** Numeric rating value (0–max), supports fractional values such as 3.7. */
export type RatingValue = number;

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  size?: RatingSize;
  /** Current rating (0–max). Supports decimals, e.g. 3.7. */
  value?: number;
  /** Uncontrolled initial rating. */
  defaultValue?: number;
  /** Maximum number of stars. Defaults to 5. */
  max?: number;
  /** Read-only display; no hover or click interaction. */
  readOnly?: boolean;
  /** Show numeric label next to stars (uses `precision`). */
  showValue?: boolean;
  /** Decimal places for the numeric label. Defaults to 1. */
  precision?: number;
  /** When interactive, allow half-star selection on click/hover. Defaults to true. */
  allowHalf?: boolean;
  onChange?: (value: number) => void;
}
