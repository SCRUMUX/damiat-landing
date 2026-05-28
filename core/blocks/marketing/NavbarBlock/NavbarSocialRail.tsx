import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import { BLOCK_CONTENT_CLASS } from '../../_shared/blockLayout';
import type { NavbarSocialLink } from './NavbarBlock.types';
import { SOCIAL_ICON_MAP } from './NavbarIcons';
import { NAVBAR_SURFACE, type NavbarSurface } from './navbarTheme';

export interface NavbarSocialRailProps {
  links: NavbarSocialLink[];
  surface: NavbarSurface;
  className?: string;
}

/**
 * Above-fold social strip — below navbar bar, in document flow (not sticky).
 * Hidden on scroll; tablet/desktop only (mobile uses drawer).
 */
export const NavbarSocialRail: React.FC<NavbarSocialRailProps> = ({
  links,
  surface,
  className,
}) => {
  if (links.length === 0) return null;

  return (
    <div className={cn('hidden w-full min-[768px]:block', className)}>
      <div className={BLOCK_CONTENT_CLASS}>
        <nav
          aria-label="Social and contact links"
          className={cn(
            'flex justify-end py-[var(--space-2)]',
            NAVBAR_SURFACE.socialRail[surface],
          )}
        >
          <ul className="flex flex-row items-center justify-end gap-[var(--space-section-stack-m)]">
            {links.map((item) => {
              const Icon = SOCIAL_ICON_MAP[item.icon];
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-label={item.label}
                    target={item.icon === 'phone' ? undefined : '_blank'}
                    rel={item.icon === 'phone' ? undefined : 'noreferrer noopener'}
                    className={cn(
                      'flex h-[var(--space-40)] w-[var(--space-40)] items-center justify-center',
                      'transition-opacity duration-200',
                      NAVBAR_SURFACE.socialIcon[surface],
                    )}
                  >
                    <span className="flex h-[var(--space-28)] w-[var(--space-28)] items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                      {Icon ? <Icon /> : null}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

NavbarSocialRail.displayName = 'NavbarSocialRail';
