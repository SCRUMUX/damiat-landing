/**
 * AUTO-GENERATED – do not edit by hand.
 * Regenerate: npm run components:generate
 */

/** DropdownItem: пункт меню для Popover/Submenu. Оси: size (sm/md/lg) × itemType (default/primary/danger). Каждый вариант всегда содержит все 4 слота: Icon (left), Label, Badge, Icon (right). Видимость слотов управляется BOOLEAN props. Icon (right) — chevron или check через INSTANCE_SWAP. Используется в @UI/Dropdown через instance swap. */

export type DropdownItemSize = 'sm' | 'md' | 'lg';

export type DropdownItemAppearance = 'default' | 'primary' | 'danger';

/** @deprecated Use `DropdownItemAppearance` instead */
export type DropdownItemItemType = DropdownItemAppearance;

export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: DropdownItemSize;
  /** Visual variant of the item */
  appearance?: DropdownItemAppearance;
  /** @deprecated Use `appearance` instead */
  itemType?: DropdownItemAppearance;
  checkbox?: React.ReactNode;
  iconLeft?: React.ReactNode;
  badge?: React.ReactNode;
  iconRight?: React.ReactNode;
  showCheckbox?: boolean;
  showIconLeft?: boolean;
  showBadge?: boolean;
  showIconRight?: boolean;
  /** Nested submenu items — when provided, a chevron-right is shown and hover opens a submenu */
  submenuItems?: Array<DropdownItemProps & { onClick?: () => void }>;
}