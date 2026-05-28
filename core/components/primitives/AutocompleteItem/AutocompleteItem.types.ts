/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** AutocompleteItem: пункт выпадающего списка автокомплита. Оси: size (sm/md/lg) × itemType (default/primary/danger). Всегда 7 слотов в DOM: Checkbox, Icon Left, Label, Badge 1, Badge 2, Badge 3, Icon Right. Видимость через BOOLEAN props. Используется в @UI/Autocomplete через instance swap. */

export type AutocompleteItemSize = 'sm' | 'md' | 'lg';

export type AutocompleteItemAppearance = 'default' | 'primary' | 'danger';

/** @deprecated Use `AutocompleteItemAppearance` instead */
export type AutocompleteItemItemType = AutocompleteItemAppearance;

export interface AutocompleteItemProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AutocompleteItemSize;
  /** Visual variant of the item */
  appearance?: AutocompleteItemAppearance;
  /** @deprecated Use `appearance` instead */
  itemType?: AutocompleteItemAppearance;
  checkbox?: React.ReactNode;
  iconLeft?: React.ReactNode;
  badge1?: React.ReactNode;
  badge2?: React.ReactNode;
  badge3?: React.ReactNode;
  iconRight?: React.ReactNode;
  showCheckbox?: boolean;
  showIconLeft?: boolean;
  showBadge1?: boolean;
  showBadge2?: boolean;
  showBadge3?: boolean;
  showIconRight?: boolean;
}