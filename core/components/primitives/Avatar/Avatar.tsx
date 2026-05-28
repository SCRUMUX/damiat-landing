import React from 'react';
import type { AvatarProps, AvatarSize, AvatarVariant } from './Avatar.types';
import { Badge } from '../Badge/Badge';
import { PersonCircleIcon } from '../../icons';
import contract from '../../../contracts/components/Avatar.contract.json';
import { cn, findClasses, type VR } from '../_shared';

const rules = (contract.variantRules || []) as unknown as VR[];

/** Layout + typography from contract size rules (box, badge slot, icon, initials scale). */
const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'w-[var(--space-avatar-xs)] h-[var(--space-avatar-xs)] [--badge-size:var(--space-8)] [--icon-size:var(--space-16)] text-[var(--font-size-10)] leading-[var(--line-height-12)]',
  sm: 'w-[var(--space-avatar-sm)] h-[var(--space-avatar-sm)] [--badge-size:var(--space-8)] [--icon-size:var(--space-20)] text-[var(--font-size-10)] leading-[var(--line-height-12)]',
  md: 'w-[var(--space-avatar-md)] h-[var(--space-avatar-md)] [--badge-size:var(--space-10)] [--icon-size:var(--space-20)] text-[var(--font-size-14)] leading-[var(--line-height-16)]',
  lg: 'w-[var(--space-avatar-lg)] h-[var(--space-avatar-lg)] [--badge-size:var(--space-12)] [--icon-size:var(--space-24)] text-[var(--font-size-16)] leading-[var(--line-height-20)]',
  xl: 'w-[var(--space-avatar-xl)] h-[var(--space-avatar-xl)] [--badge-size:var(--space-14)] [--icon-size:var(--space-24)] text-[var(--font-size-18)] leading-[var(--line-height-24)]',
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const {
    variant = 'guest',
    size = 'xs',
    showBadge = false,
    badge,
    initials = 'VK',
    src,
    badgeContent,
    className,
    style,
    ...rest
  } = props;

  const appearanceClasses = findClasses(rules, { variant: variant as AvatarVariant });

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex shrink-0', SIZE_CLASSES[size], className)}
      style={style}
      {...rest}
    >
      <span
        className={cn(
          'absolute inset-0 overflow-hidden rounded-[var(--radius-full)]',
          ...appearanceClasses,
        )}
      >
        {variant === 'guest' && (
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: 'var(--icon-color, var(--color-text-muted))' }}
          >
            <PersonCircleIcon
              style={{
                width: 'var(--icon-size)',
                height: 'var(--icon-size)',
                display: 'block',
              }}
            />
          </span>
        )}

        {variant === 'registered-no-photo' && (
          <span
            className="absolute inset-0 flex items-center justify-center font-semibold select-none"
            style={{ color: 'var(--initials-color, var(--color-text-on-brand))' }}
          >
            {initials}
          </span>
        )}

        {variant === 'registered-with-photo' && src && (
          <img
            src={src}
            alt={initials}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {variant === 'registered-with-photo' && !src && (
          <span
            className="absolute inset-0 flex items-center justify-center font-semibold select-none"
            style={{ color: 'var(--initials-color, var(--color-text-on-brand))' }}
          >
            {initials}
          </span>
        )}
      </span>

      {showBadge && (
        <span className="absolute z-10 flex items-center justify-center -bottom-[var(--space-3)] -right-[var(--space-3)]">
          {badge ?? (
            <Badge
              appearance="brand"
              size="sm"
              className="px-[var(--space-1)] py-0 min-w-[var(--space-16)] min-h-[var(--space-16)] leading-none"
            >
              {badgeContent}
            </Badge>
          )}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';
