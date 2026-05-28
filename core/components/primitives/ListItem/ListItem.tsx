import React, { useState, useCallback } from 'react';
import type { ListItemProps, ListItemSize, ListItemState, ListItemVariant } from './ListItem.types';
import { cn, findClasses, IconSlot, type VR } from '../_shared';
import contract from '../../../contracts/components/ListItem.contract.json';

const rules = (contract.variantRules || []) as unknown as VR[];

const SIZE_CLASSES: Record<ListItemSize, string> = {
  sm: 'px-[var(--space-list-item-x-sm)] py-[var(--space-list-item-y-sm)] gap-[var(--space-list-item-gap-sm)] min-h-[var(--space-list-item-h-sm)]',
  md: 'px-[var(--space-list-item-x-md)] py-[var(--space-list-item-y-md)] gap-[var(--space-list-item-gap-md)] min-h-[var(--space-list-item-h-md)]',
  lg: 'px-[var(--space-list-item-x-lg)] py-[var(--space-list-item-y-lg)] gap-[var(--space-list-item-gap-lg)] min-h-[var(--space-list-item-h-lg)]',
};

const LABEL_CLASSES: Record<ListItemSize, string> = {
  sm: 'text-style-body-sm',
  md: 'text-style-body',
  lg: 'text-style-body-lg',
};

const SELECTED_LABEL: Record<ListItemSize, string> = {
  sm: 'text-style-body-sm font-semibold',
  md: 'text-style-body-strong',
  lg: 'text-style-body-lg font-semibold',
};

const SUBTITLE_CLASSES: Record<ListItemSize, string> = {
  sm: 'text-style-caption-xs',
  md: 'text-style-body-sm',
  lg: 'text-style-body',
};

const ICON_SIZE: Record<ListItemSize, string> = {
  sm: '20px',
  md: '20px',
  lg: '24px',
};

const TRAILING_ICON_SIZE = '20px';

function withoutTextStyle(classes: string[]): string[] {
  return classes.filter((c) => !c.startsWith('text-style-'));
}

export const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>((props, ref) => {
  const {
    size = 'md',
    variant = 'iconNav',
    state: stateProp,
    interaction: interactionProp,
    label = 'List item label',
    subtitle = 'Secondary description text',
    trailingMeta = '12:00',
    leadingIcon,
    leadingAvatar,
    leadingCheckbox,
    trailingChevron,
    trailingBadge,
    trailingAction,
    showSubtitle = false,
    showDivider = true,
    className,
    onMouseEnter,
    onMouseLeave,
    ...rest
  } = props;

  const controlledState = stateProp ?? interactionProp;

  const [hovered, setHovered] = useState(false);

  const isDisabled = controlledState === 'disabled';

  const effectiveState: ListItemState = (() => {
    if (controlledState) return controlledState;
    if (hovered) return 'hover';
    return 'base';
  })();

  const he = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDisabled) setHovered(true);
    onMouseEnter?.(e);
  }, [isDisabled, onMouseEnter]);

  const hl = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setHovered(false);
    onMouseLeave?.(e);
  }, [onMouseLeave]);

  const interactionClasses = withoutTextStyle(
    findClasses(rules, { interaction: effectiveState, variant }),
  );

  const showLeadingIcon   = variant === 'iconNav' || variant === 'iconMeta';
  const showLeadingAvatar = variant === 'avatarContact';
  const showLeadingCb     = variant === 'checkboxSelect';
  const showChevron       = variant === 'iconNav';
  const showBadge         = variant === 'iconMeta';
  const showMeta          = variant === 'avatarContact';
  const showAction        = variant === 'checkboxSelect';

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-row items-center w-full transition-colors duration-150',
        SIZE_CLASSES[size],
        ...interactionClasses,
        showDivider && 'border-b border-[var(--divider-color,var(--color-divider))]',
        isDisabled && 'pointer-events-none',
        !isDisabled && 'cursor-pointer',
        className,
      )}
      aria-disabled={isDisabled || undefined}
      onMouseEnter={he}
      onMouseLeave={hl}
      {...rest}
    >
      {showLeadingIcon && leadingIcon && (
        <IconSlot icon={leadingIcon} size={ICON_SIZE[size]} />
      )}
      {showLeadingAvatar && leadingAvatar && (
        <span
          className="shrink-0 flex items-center justify-center w-[var(--space-avatar-sm)] h-[var(--space-avatar-sm)]"
        >
          {leadingAvatar}
        </span>
      )}
      {showLeadingCb && leadingCheckbox && (
        <span className="shrink-0 flex items-center justify-center">
          {leadingCheckbox}
        </span>
      )}

      <div className="flex flex-col flex-1 min-w-0 gap-[var(--space-2)]">
        <span
          className={cn(
            effectiveState === 'selected' ? SELECTED_LABEL[size] : LABEL_CLASSES[size],
            'truncate',
          )}
        >
          {label}
        </span>
        {showSubtitle && (
          <span
            className={cn(
              SUBTITLE_CLASSES[size],
              'text-[var(--subtitle-color,var(--color-text-muted))] truncate',
            )}
          >
            {subtitle}
          </span>
        )}
      </div>

      {showBadge && trailingBadge && (
        <span className="shrink-0 flex items-center">
          {trailingBadge}
        </span>
      )}

      {showMeta && (
        <span
          className={cn(
            LABEL_CLASSES[size],
            'shrink-0 tabular-nums text-[var(--meta-color,var(--color-text-muted))]',
          )}
        >
          {trailingMeta}
        </span>
      )}

      {showChevron && trailingChevron && (
        <IconSlot icon={trailingChevron} size={TRAILING_ICON_SIZE} />
      )}

      {showAction && trailingAction && (
        <span className="shrink-0 flex items-center">
          {trailingAction}
        </span>
      )}
    </div>
  );
});

ListItem.displayName = 'ListItem';
