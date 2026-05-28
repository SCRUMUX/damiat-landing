import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockAction } from '../../_shared/BlockAction';
import { BLOCK_CONTENT_CLASS } from '../../_shared/blockLayout';
import { Link } from '../../../components/primitives/Link';
import { cn } from '../../../components/primitives/_shared';
import type { NavbarBlockProps, NavbarLink } from './NavbarBlock.types';
import { NavbarSocialRail } from './NavbarSocialRail';
import { NavbarServicesPanel, NavbarServicesScrim } from './NavbarServicesPanel';
import { NavbarMobileMenu } from './NavbarMobileMenu';
import { ChevronDownIcon, MenuIcon, SendIcon, UserIcon } from './NavbarIcons';
import {
  NAVBAR_SURFACE,
  NAVBAR_BRAND_BLEED_EXTRA,
  NAVBAR_CHROME_HEIGHT_FALLBACK,
  NAVBAR_CHROME_MIN_HEIGHT,
  bindScroll,
  getScrollTop,
  resolveNavbarSurface,
  type NavbarSurface,
} from './navbarTheme';

const SOCIAL_RAIL_FLOW_HEIGHT = 'var(--space-48)';

export type { NavbarBlockProps, NavbarLink, NavbarBlockStoryProps } from './NavbarBlock.types';
export type {
  NavbarServiceCategory,
  NavbarServiceItem,
  NavbarSocialLink,
  NavbarPhoneInfo,
  NavbarCta,
  NavbarSocialIcon,
} from './NavbarBlock.types';

function NavAnchor({
  href,
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href ?? '#'} className={cn('text-style-body-sm font-medium no-underline', className)}>
      {children}
    </a>
  );
}

function NavTextAction({
  label,
  href,
  onClick,
  icon,
  surface,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: 'user' | 'send';
  surface: NavbarSurface;
}) {
  const Icon = icon === 'send' ? SendIcon : UserIcon;
  const className = cn(
    'inline-flex h-[var(--space-36)] shrink-0 items-center gap-[var(--space-2)]',
    'whitespace-nowrap text-style-body-sm font-medium no-underline transition-opacity duration-200',
    NAVBAR_SURFACE.textAction[surface],
  );

  const content = (
    <>
      <span className="flex h-[var(--space-20)] w-[var(--space-20)] shrink-0 items-center justify-center">
        <Icon />
      </span>
      <span className="hidden min-[1024px]:inline">{label}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function DefaultNavbar({ logo, links, cta, sticky, className }: NavbarBlockProps) {
  return (
    <SectionShell
      recipe="section.navbar"
      as="header"
      appearance="base"
      className={cn(
        sticky && 'sticky top-0 z-[var(--z-header)] border-b border-[var(--color-border-base)]',
        className,
      )}
      aria-label="Site navigation"
    >
      <div
        className="flex w-full min-w-0 flex-col min-[768px]:flex-row min-[768px]:items-center"
        style={{ gap: 'var(--space-section-stack-m)' }}
      >
        <div className="flex w-full min-w-0 items-center justify-between min-[768px]:contents">
          <span className="text-style-h4 shrink-0 font-semibold text-[var(--color-text-primary)]">
            {logo}
          </span>
          {cta ? (
            <BlockAction
              label={cta.label}
              href={cta.href}
              onClick={cta.onClick}
              appearance="brand"
              size="sm"
              className="shrink-0 min-[768px]:order-3 min-[768px]:ml-auto"
            />
          ) : null}
        </div>
        <nav
          className="flex min-w-0 flex-wrap items-center justify-start min-[768px]:flex-1"
          style={{ gap: 'var(--space-section-stack-l)' }}
        >
          {links.map((link) => (
            <Link key={link.label} href={link.href ?? '#'} size="sm" showRightIcon={false}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </SectionShell>
  );
}

function EnterpriseNavbar(props: NavbarBlockProps) {
  const {
    logo,
    links,
    cta,
    accountCta,
    sticky = true,
    overlay = true,
    staticGlass = false,
    servicesMenu = [],
    servicesTriggerLabel,
    socialLinks = [],
    showSocialRail = true,
    phone,
    className,
    defaultServicesOpen = false,
    defaultMobileOpen = false,
  } = props;

  const chromeRef = useRef<HTMLDivElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const [pastBrandFold, setPastBrandFold] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(defaultServicesOpen);
  const [mobileOpen, setMobileOpen] = useState(defaultMobileOpen);
  const [chromeHeight, setChromeHeight] = useState(0);

  const triggerLabel =
    servicesTriggerLabel ?? links.find((l) => l.megaMenu)?.label ?? 'Компоненты';
  const resolvedSurface = resolveNavbarSurface(overlay, pastBrandFold, servicesOpen);
  const useStaticGlass = staticGlass && overlay && !servicesOpen;
  const headerSurface = useStaticGlass ? 'staticGlass' : resolvedSurface;
  /** Text actions and chrome divider — overlay tokens on photo hero (incl. static glass). */
  const surface: NavbarSurface = useStaticGlass ? 'overlay' : resolvedSurface;
  const textClass = NAVBAR_SURFACE.text[surface];
  /** Above-fold only — below navbar bar, hidden once user leaves brand first screen. */
  const showAboveFoldSocial =
    overlay &&
    !pastBrandFold &&
    !servicesOpen &&
    showSocialRail &&
    socialLinks.length > 0;

  const effectiveChromeHeight = Math.max(chromeHeight, NAVBAR_CHROME_MIN_HEIGHT);

  /** Stable band height — rail may hide visually; reserved space avoids hero jump. */
  const aboveFoldBandHeight =
    overlay && showSocialRail && socialLinks.length > 0
      ? `calc(${effectiveChromeHeight}px + ${SOCIAL_RAIL_FLOW_HEIGHT})`
      : `${effectiveChromeHeight}px`;

  useLayoutEffect(() => {
    const syncScroll = () => {
      const scrollTop = getScrollTop();
      const viewport = window.innerHeight || document.documentElement.clientHeight || 800;
      const foldEnd = Math.max(viewport - effectiveChromeHeight, viewport * 0.72);
      setPastBrandFold(scrollTop > foldEnd);
    };
    syncScroll();
    return bindScroll(syncScroll);
  }, [effectiveChromeHeight]);

  useLayoutEffect(() => {
    const node = chromeRef.current;
    if (!node) return;

    const syncHeight = () => {
      const next = Math.ceil(node.getBoundingClientRect().height);
      setChromeHeight((prev) => (Math.abs(prev - next) > 0.5 ? next : prev));
    };

    syncHeight();
    const ro = new ResizeObserver(() => syncHeight());
    ro.observe(node);
    window.addEventListener('resize', syncHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [servicesOpen, pastBrandFold, headerSurface]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [servicesOpen]);

  useEffect(() => {
    if (!sticky) return undefined;
    document.documentElement.style.setProperty('--navbar-chrome-height', `${effectiveChromeHeight}px`);
    document.documentElement.style.setProperty(
      '--navbar-above-fold-band-height',
      aboveFoldBandHeight,
    );
    return () => {
      document.documentElement.style.removeProperty('--navbar-chrome-height');
      document.documentElement.style.removeProperty('--navbar-above-fold-band-height');
    };
  }, [effectiveChromeHeight, aboveFoldBandHeight, sticky]);

  const closeServices = useCallback(() => setServicesOpen(false), []);
  const toggleServices = useCallback(() => setServicesOpen((v) => !v), []);

  const chromeShellClass = cn(
    sticky && 'fixed inset-x-0 top-0',
    servicesOpen ? 'z-[calc(var(--z-modal)+2)]' : 'z-[var(--z-header)]',
    'w-full overflow-visible transition-[background-color,box-shadow,border-color,backdrop-filter] duration-200',
    NAVBAR_SURFACE.header[headerSurface],
    className,
  );

  const renderNavLink = (link: NavbarLink) => {
    const isServices =
      link.megaMenu || (servicesMenu.length > 0 && link.label === triggerLabel);

    if (isServices && servicesMenu.length > 0) {
      return (
        <button
          key={link.label}
          ref={servicesTriggerRef}
          type="button"
          className={cn(
            'inline-flex items-center gap-[var(--space-1)] text-style-body-sm font-medium transition-opacity duration-200 hover:opacity-80',
            textClass,
          )}
          aria-expanded={servicesOpen}
          aria-haspopup="true"
          aria-controls="navbar-services-panel"
          onClick={toggleServices}
        >
          {link.label}
          <ChevronDownIcon
            className={cn('transition-transform duration-200', servicesOpen && 'rotate-180')}
          />
        </button>
      );
    }

    return (
      <NavAnchor key={link.label} href={link.href} className={textClass}>
        {link.label}
      </NavAnchor>
    );
  };

  return (
    <>
      <div className="relative isolate z-[var(--z-header)] w-full">
        {overlay && !pastBrandFold && !staticGlass ? (
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-[-1px] z-[calc(var(--z-header)-1)] bg-[var(--color-brand-primary)]"
            style={{ height: `calc(${aboveFoldBandHeight} + ${NAVBAR_BRAND_BLEED_EXTRA})` }}
          />
        ) : null}

        <div ref={chromeRef} className={chromeShellClass}>
          <header aria-label="Site navigation">
            <div className={cn(BLOCK_CONTENT_CLASS, 'py-[var(--space-4)]')}>
              <div className="flex w-full min-w-0 items-center justify-between gap-[var(--space-section-stack-l)]">
                <div className="flex min-h-[var(--space-56)] min-w-0 flex-1 items-center gap-[var(--space-section-content-l)]">
                  <a href="/" className={cn('shrink-0 no-underline', textClass)} aria-label="Home">
                    {typeof logo === 'string' ? (
                      <span className="text-style-h4 font-semibold">{logo}</span>
                    ) : (
                      logo
                    )}
                  </a>

                  <nav
                    className="hidden min-w-0 flex-1 items-center gap-[var(--space-section-stack-l)] min-[768px]:flex"
                    aria-label="Primary"
                  >
                    {links.map(renderNavLink)}
                  </nav>
                </div>

                <div className="hidden shrink-0 items-center gap-[var(--space-section-stack-l)] min-[768px]:flex">
                  {phone ? (
                    <>
                      <div className="flex flex-col items-end justify-center gap-[var(--space-1)]">
                        <a
                          href={phone.href ?? `tel:${phone.number.replace(/\s/g, '')}`}
                          className={cn(
                            'text-style-body-sm font-medium leading-none no-underline min-[1024px]:text-style-caption',
                            textClass,
                          )}
                        >
                          {phone.number}
                        </a>
                        {phone.status ? (
                          <a
                            href={phone.status.href}
                            className={cn(
                              'inline-flex items-center gap-[var(--space-2)] text-style-caption leading-none opacity-80 no-underline transition-opacity hover:opacity-100',
                              textClass,
                            )}
                          >
                            <span
                              className="h-[var(--space-4)] w-[var(--space-4)] rounded-full bg-[var(--color-success-primary)]"
                              aria-hidden="true"
                            />
                            {phone.status.label}
                          </a>
                        ) : null}
                      </div>
                      <div
                        className={cn(
                          'h-[var(--space-36)] w-px shrink-0',
                          surface === 'overlay'
                            ? 'bg-[var(--color-text-on-brand)]/30'
                            : 'bg-[var(--color-border-base)]',
                        )}
                        aria-hidden="true"
                      />
                    </>
                  ) : null}

                  {accountCta ? (
                    <NavTextAction
                      label={accountCta.label}
                      href={accountCta.href}
                      onClick={accountCta.onClick}
                      icon={accountCta.icon ?? 'user'}
                      surface={surface}
                    />
                  ) : null}

                  {cta ? (
                    <NavTextAction
                      label={cta.label}
                      href={cta.href}
                      onClick={cta.onClick}
                      icon={cta.icon ?? 'send'}
                      surface={surface}
                    />
                  ) : null}
                </div>

                <button
                  ref={mobileMenuButtonRef}
                  type="button"
                  className={cn(
                    'inline-flex h-[var(--space-44)] w-[var(--space-44)] shrink-0 items-center justify-center rounded-[var(--radius-medium)] min-[768px]:hidden',
                    'transition-opacity duration-200 hover:opacity-80',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]',
                    textClass,
                  )}
                  aria-label="Открыть меню"
                  aria-expanded={mobileOpen}
                  aria-haspopup="dialog"
                  onClick={() => setMobileOpen(true)}
                >
                  <MenuIcon />
                </button>
              </div>
            </div>
          </header>

          {servicesOpen && servicesMenu.length > 0 ? (
            <NavbarServicesPanel
              open={servicesOpen}
              categories={servicesMenu}
              onClose={closeServices}
              layout="inline"
              returnFocusRef={servicesTriggerRef}
            />
          ) : null}
        </div>

        {sticky ? (
          <div className="relative z-[calc(var(--z-header)-1)] w-full">
            <div
              aria-hidden="true"
              className="pointer-events-none w-full shrink-0"
              style={{
                height: `${effectiveChromeHeight}px`,
                minHeight: NAVBAR_CHROME_HEIGHT_FALLBACK,
              }}
            />
            {showAboveFoldSocial ? (
              <NavbarSocialRail links={socialLinks} surface="overlay" />
            ) : null}
          </div>
        ) : null}
      </div>

      {servicesOpen ? (
        <NavbarServicesScrim chromeHeight={effectiveChromeHeight} onClose={closeServices} />
      ) : null}

      <NavbarMobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        returnFocusRef={mobileMenuButtonRef}
        logo={logo}
        links={links}
        servicesMenu={servicesMenu}
        servicesTriggerLabel={servicesTriggerLabel}
        socialLinks={socialLinks}
        phone={phone}
        cta={cta}
        accountCta={accountCta}
      />
    </>
  );
}

export const NavbarBlock: React.FC<NavbarBlockProps> = (props) => {
  const variant =
    props.variant ??
    (props.servicesMenu?.length || props.socialLinks?.length || props.phone ? 'enterprise' : 'default');

  if (variant === 'enterprise') {
    return <EnterpriseNavbar {...props} />;
  }

  return <DefaultNavbar {...props} />;
};

NavbarBlock.displayName = 'NavbarBlock';
