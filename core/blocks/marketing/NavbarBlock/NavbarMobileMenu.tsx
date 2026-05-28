import React, { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../../components/primitives/_shared';
import { Drawer } from '../../../components/primitives/Drawer';
import { Link } from '../../../components/primitives/Link';
import { BlockAction } from '../../_shared/BlockAction';
import type {
  NavbarBlockProps,
  NavbarLink,
  NavbarServiceCategory,
  NavbarSocialLink,
} from './NavbarBlock.types';
import { lockScrollRoot } from './navbarTheme';
import { ChevronDownIcon, SOCIAL_ICON_MAP } from './NavbarIcons';

export interface NavbarMobileMenuProps {
  open: boolean;
  onClose: () => void;
  logo: React.ReactNode;
  links: NavbarLink[];
  servicesMenu?: NavbarServiceCategory[];
  servicesTriggerLabel?: string;
  socialLinks?: NavbarSocialLink[];
  phone?: NavbarBlockProps['phone'];
  cta?: NavbarBlockProps['cta'];
  accountCta?: NavbarBlockProps['accountCta'];
  /** Menu trigger — receives focus when the drawer closes. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

const DRAWER_SHELL_CLASS = cn(
  '!w-full !max-w-none bg-[var(--color-surface-1)]',
  '[&>div:first-child]:min-h-[var(--space-56)]',
  '[&>div:first-child]:items-center',
  '[&>div:first-child]:border-[var(--color-border-base)]',
  '[&>div:first-child]:!p-0',
  '[&>div:first-child]:pl-[var(--grid-mobile-offset)]',
  '[&>div:first-child]:pr-[var(--grid-mobile-offset)]',
  'tablet:[&>div:first-child]:pl-[var(--grid-tablet-offset)]',
  'tablet:[&>div:first-child]:pr-[var(--grid-tablet-offset)]',
  '[&>div:first-child]:py-[var(--space-4)]',
  '[&>div:first-child_button]:flex',
  '[&>div:first-child_button]:h-[var(--space-44)]',
  '[&>div:first-child_button]:w-[var(--space-44)]',
  '[&>div:first-child_button]:items-center',
  '[&>div:first-child_button]:justify-center',
  '[&>div:first-child_button]:rounded-[var(--radius-medium)]',
  '[&>div:last-child]:!p-0',
  '[&>div:last-child]:pl-[var(--grid-mobile-offset)]',
  '[&>div:last-child]:pr-[var(--grid-mobile-offset)]',
  'tablet:[&>div:last-child]:pl-[var(--grid-tablet-offset)]',
  'tablet:[&>div:last-child]:pr-[var(--grid-tablet-offset)]',
  '[&>div:last-child]:pb-[var(--space-section-y-s)]',
);

const NAV_LINK_CLASS = cn(
  'flex w-full min-h-[var(--space-48)] items-center py-[var(--space-2)] no-underline',
);

function renderLogoTitle(logo: React.ReactNode): React.ReactNode {
  if (typeof logo === 'string') {
    return <span className="text-style-h4 font-semibold">{logo}</span>;
  }
  return logo;
}

export const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  open,
  onClose,
  logo,
  links,
  servicesMenu = [],
  servicesTriggerLabel,
  socialLinks = [],
  phone,
  cta,
  accountCta,
  returnFocusRef,
}) => {
  const servicesPanelId = useId();
  const wasOpenRef = useRef(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(servicesMenu[0]?.id ?? '');

  const triggerLabel =
    servicesTriggerLabel ?? links.find((l) => l.megaMenu)?.label ?? 'Компоненты';

  const plainLinks = links.filter((l) => !l.megaMenu && l.label !== triggerLabel);
  const activeServices = servicesMenu.find((c) => c.id === activeCategory);

  useEffect(() => {
    if (open && servicesMenu.length > 0) {
      setServicesExpanded(true);
      setActiveCategory(servicesMenu[0]?.id ?? '');
      return;
    }
    if (!open) {
      setServicesExpanded(false);
      setActiveCategory(servicesMenu[0]?.id ?? '');
    }
  }, [open, servicesMenu]);

  useEffect(() => {
    if (!open) return undefined;
    return lockScrollRoot(true);
  }, [open]);

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      returnFocusRef?.current?.focus({ preventScroll: true });
    }
    wasOpenRef.current = open;
  }, [open, returnFocusRef]);

  const handleNavClick = () => {
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      size="lg"
      title={renderLogoTitle(logo)}
      className={DRAWER_SHELL_CLASS}
    >
      <div className="flex min-h-full flex-col gap-[var(--space-section-content-xl)] pt-[var(--space-section-content-m)]">
        {servicesMenu.length > 0 ? (
          <section className="border-b border-[var(--color-border-base)] pb-[var(--space-section-content-l)]">
            <button
              type="button"
              className={cn(
                'flex w-full min-h-[var(--space-48)] items-center justify-between gap-[var(--space-section-stack-m)]',
                'py-[var(--space-section-content-s)] text-left',
                'text-style-h4 font-semibold text-[var(--color-text-primary)]',
                'rounded-[var(--radius-medium)] transition-colors duration-200',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]',
              )}
              aria-expanded={servicesExpanded}
              aria-controls={servicesPanelId}
              onClick={() => setServicesExpanded((v) => !v)}
            >
              {triggerLabel}
              <span
                className="flex h-[var(--space-24)] w-[var(--space-24)] shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                <ChevronDownIcon
                  className={cn(
                    'transition-transform duration-200 ease-out',
                    servicesExpanded && 'rotate-180',
                  )}
                />
              </span>
            </button>

            <div
              id={servicesPanelId}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                servicesExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
              aria-hidden={!servicesExpanded}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-[var(--space-section-content-l)] pt-[var(--space-section-content-s)]">
                  <ul
                    className="flex flex-col gap-[var(--space-section-stack-s)]"
                    role="tablist"
                    aria-label="Категории компонентов"
                  >
                    {servicesMenu.map((cat) => (
                      <li key={cat.id}>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={activeCategory === cat.id}
                          className={cn(
                            'flex w-full min-h-[var(--space-48)] items-center rounded-[var(--radius-medium)]',
                            'px-[var(--space-section-content-s)] py-[var(--space-section-content-s)]',
                            'text-left text-style-body font-medium transition-colors duration-200',
                            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]',
                            activeCategory === cat.id
                              ? 'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]'
                              : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)]',
                          )}
                          onClick={() => setActiveCategory(cat.id)}
                        >
                          {cat.label}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {activeServices ? (
                    <ul className="flex flex-col gap-[var(--space-section-stack-l)]">
                      {activeServices.items.map((item) => (
                        <li key={item.href} className="min-w-0">
                          <Link
                            href={item.href}
                            size="lg"
                            showRightIcon={false}
                            className={NAV_LINK_CLASS}
                            onClick={handleNavClick}
                          >
                            {item.label}
                          </Link>
                          {item.description ? (
                            <p className="mt-[var(--space-2)] text-style-body-sm text-[var(--color-text-secondary)]">
                              {item.description}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {plainLinks.length > 0 ? (
          <nav
            className="flex flex-col gap-[var(--space-section-stack-s)]"
            aria-label="Основная навигация"
          >
            {plainLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href ?? '#'}
                size="lg"
                showRightIcon={false}
                className={NAV_LINK_CLASS}
                onClick={handleNavClick}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}

        {phone ? (
          <div className="flex flex-col gap-[var(--space-section-stack-s)] border-t border-[var(--color-border-base)] pt-[var(--space-section-content-l)]">
            <a
              href={phone.href ?? `tel:${phone.number.replace(/\s/g, '')}`}
              className="text-style-h4 font-semibold text-[var(--color-text-primary)] no-underline"
              onClick={handleNavClick}
            >
              {phone.number}
            </a>
            {phone.status ? (
              <a
                href={phone.status.href}
                className="inline-flex min-h-[var(--space-36)] items-center gap-[var(--space-section-stack-s)] text-style-body text-[var(--color-text-secondary)] no-underline"
                onClick={handleNavClick}
              >
                <span
                  className="h-[var(--space-8)] w-[var(--space-8)] shrink-0 rounded-full bg-[var(--color-success-primary)]"
                  aria-hidden="true"
                />
                {phone.status.label}
              </a>
            ) : null}
          </div>
        ) : null}

        {socialLinks.length > 0 ? (
          <ul className="flex flex-wrap gap-[var(--space-section-stack-m)]">
            {socialLinks.map((item) => {
              const Icon = SOCIAL_ICON_MAP[item.icon];
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-label={item.label}
                    target={item.icon === 'phone' ? undefined : '_blank'}
                    rel={item.icon === 'phone' ? undefined : 'noreferrer noopener'}
                    className="flex h-[var(--space-48)] w-[var(--space-48)] items-center justify-center rounded-[var(--radius-medium)] text-[var(--color-text-primary)] transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]"
                  >
                    <span className="flex h-[var(--space-28)] w-[var(--space-28)] items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                      {Icon ? <Icon /> : null}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : null}

        {accountCta || cta ? (
          <div className="mt-auto flex flex-col gap-[var(--space-section-stack-m)] border-t border-[var(--color-border-base)] pt-[var(--space-section-content-l)]">
            {accountCta ? (
              <BlockAction
                label={accountCta.label}
                href={accountCta.href}
                onClick={() => {
                  accountCta.onClick?.();
                  onClose();
                }}
                appearance="outline"
                size="lg"
                className="w-full justify-center"
              />
            ) : null}
            {cta ? (
              <BlockAction
                label={cta.label}
                href={cta.href}
                onClick={() => {
                  cta.onClick?.();
                  onClose();
                }}
                appearance="brand"
                size="lg"
                className="w-full justify-center"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </Drawer>
  );
};

NavbarMobileMenu.displayName = 'NavbarMobileMenu';
