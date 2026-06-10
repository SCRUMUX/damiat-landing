/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** Tag: appearance (brand, base, ghost, outline), size (sm, md, lg), state (base, hover). Опционально: иконка слева, лейбл, иконка справа (close). */

export type TagAppearance = 'brand' | 'base' | 'ghost' | 'outline';

export type TagSize = 'sm' | 'md' | 'lg';

export type TagState = 'base' | 'hover';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  appearance?: TagAppearance;
  size?: TagSize;
  state?: TagState;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
}
