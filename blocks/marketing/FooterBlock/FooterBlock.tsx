import React from 'react';
import { SectionShell } from '../../_shared/SectionShell';
import { BlockGrid } from '../../_shared/BlockGrid';
import {
  FOOTER_ENTERPRISE_CONTACTS_STACK_CLASS,
  FOOTER_ENTERPRISE_DESKTOP_ROW_CLASS,
  FOOTER_ENTERPRISE_GRID_CLASS,
  FOOTER_ENTERPRISE_LEGAL_STACK_CLASS,
  FOOTER_ENTERPRISE_LOGO_COLUMN_CLASS,
  FOOTER_ENTERPRISE_MOBILE_STACK_CLASS,
  FOOTER_ENTERPRISE_NAV_STACK_CLASS,
  FOOTER_TOP_DIVIDER_CLASS,
  FOOTER_TOP_DIVIDER_STYLE,
} from '../../_shared/blockLayout';
import { Paragraph } from '../../../components/primitives/Paragraph';
import { Link } from '../../../components/primitives/Link';
import { Divider } from '../../../components/primitives/Divider';
import { cn } from '../../../components/primitives/_shared';
import type { FooterBlockProps, FooterContactItem, FooterLegalLink, FooterLink } from './FooterBlock.types';

export type {
  FooterBlockProps,
  FooterColumn,
  FooterContactItem,
  FooterLegalLink,
  FooterLink,
  FooterSocialLink,
} from './FooterBlock.types';

const FOOTER_LINK_CLASS = cn(
  'text-style-body text-[var(--color-text-on-brand)] no-underline transition-opacity duration-200',
  'hover:opacity-80',
);

const FOOTER_CONTACT_LABEL_CLASS = cn(
  'text-style-body text-[var(--color-text-on-brand)] opacity-60',
);

const FOOTER_CONTACT_VALUE_CLASS = cn(
  'font-medium text-style-h4 text-[var(--color-text-on-brand)] no-underline transition-opacity duration-200',
  'min-[1024px]:text-style-body-lg hover:opacity-80',
);

const FOOTER_LEGAL_LINK_CLASS = cn(
  FOOTER_LINK_CLASS,
  'min-[1024px]:text-style-body-sm min-[1024px]:opacity-80',
);

const FOOTER_COPYRIGHT_CLASS = cn(
  'text-style-body text-[var(--color-text-on-brand)] opacity-70',
  'min-[1024px]:text-style-body-sm',
);

function FooterLogo({
  logo,
  logoHref = '/',
  className,
}: {
  logo: React.ReactNode;
  logoHref?: string;
  className?: string;
}) {
  return (
    <a href={logoHref} className={cn('inline-flex no-underline', className)}>
      {typeof logo === 'string' ? (
        <span className="text-style-h3 font-semibold text-[var(--color-text-on-brand)] min-[1024px]:text-style-h2">
          {logo}
        </span>
      ) : (
        logo
      )}
    </a>
  );
}

function FooterNavLinks({ links }: { links: FooterLink[] }) {
  return (
    <nav className={FOOTER_ENTERPRISE_NAV_STACK_CLASS} aria-label="Footer navigation">
      {links.map((link) => (
        <a key={link.label} href={link.href} className={FOOTER_LINK_CLASS}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}

function FooterContacts({ contacts }: { contacts: FooterContactItem[] }) {
  return (
    <div className={FOOTER_ENTERPRISE_CONTACTS_STACK_CLASS}>
      {contacts.map((contact) => (
        <div key={contact.label} className="flex flex-col gap-[var(--space-4)] min-[1024px]:gap-[var(--space-8)]">
          <div className={FOOTER_CONTACT_LABEL_CLASS}>{contact.label}</div>
          <a href={contact.href} className={FOOTER_CONTACT_VALUE_CLASS}>
            {contact.value}
          </a>
        </div>
      ))}
    </div>
  );
}

function FooterLegalLinks({
  links,
  showBackToTop,
}: {
  links: FooterLegalLink[];
  showBackToTop?: boolean;
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={FOOTER_ENTERPRISE_LEGAL_STACK_CLASS}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={cn(
            FOOTER_LEGAL_LINK_CLASS,
            link.multiline && 'mt-[var(--space-32)] min-[1024px]:mt-[var(--space-16)] min-[1024px]:text-style-caption',
          )}
        >
          {link.label}
        </a>
      ))}
      {showBackToTop ? (
        <button
          type="button"
          aria-label="Наверх"
          onClick={scrollToTop}
          className={cn(
            'mt-[var(--space-32)] w-fit border-none bg-transparent p-0 underline',
            'text-style-body-sm text-[var(--color-text-on-brand)] opacity-80',
            'min-[1024px]:mt-auto cursor-pointer transition-opacity duration-200 hover:opacity-100',
          )}
        >
          Наверх ↑
        </button>
      ) : null}
    </div>
  );
}

function EnterpriseFooter({
  logo = 'AICADS PRO',
  logoHref,
  navLinks = [],
  contacts = [],
  legalLinks = [],
  copyright,
  showBackToTop = true,
}: FooterBlockProps) {
  return (
    <>
      <div className={FOOTER_ENTERPRISE_MOBILE_STACK_CLASS}>
        {navLinks.length > 0 ? <FooterNavLinks links={navLinks} /> : null}
        {contacts.length > 0 ? <FooterContacts contacts={contacts} /> : null}
        {legalLinks.length > 0 ? (
          <FooterLegalLinks links={legalLinks} showBackToTop={showBackToTop} />
        ) : null}
        <FooterLogo logo={logo} logoHref={logoHref} />
        {copyright ? <div className={FOOTER_COPYRIGHT_CLASS}>{copyright}</div> : null}
      </div>

      <div className={FOOTER_ENTERPRISE_DESKTOP_ROW_CLASS}>
        <div className={FOOTER_ENTERPRISE_LOGO_COLUMN_CLASS}>
          <FooterLogo logo={logo} logoHref={logoHref} />
          {copyright ? <div className={FOOTER_COPYRIGHT_CLASS}>{copyright}</div> : null}
        </div>

        <div className={FOOTER_ENTERPRISE_GRID_CLASS}>
          {navLinks.length > 0 ? (
            <div className="flex min-h-full flex-col justify-between">
              <FooterNavLinks links={navLinks} />
            </div>
          ) : null}
          {contacts.length > 0 ? <FooterContacts contacts={contacts} /> : null}
          {legalLinks.length > 0 ? (
            <FooterLegalLinks links={legalLinks} showBackToTop={showBackToTop} />
          ) : null}
        </div>
      </div>
    </>
  );
}

function MinimalFooter({ columns, copyright, socialLinks }: FooterBlockProps) {
  if (!columns?.length) return null;

  return (
    <>
      <BlockGrid columns={Math.min(columns.length, 4) as 1 | 2 | 3 | 4}>
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col" style={{ gap: 'var(--space-section-stack-m)' }}>
            <Paragraph size="sm" className="font-semibold text-[var(--color-text-primary)] m-0">
              {column.title}
            </Paragraph>
            <nav className="flex flex-col" style={{ gap: 'var(--space-section-stack-s)' }}>
              {column.links.map((link) => (
                <Link key={link.label} href={link.href} size="sm" showRightIcon={false}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </BlockGrid>
      {(socialLinks?.length || copyright) && (
        <div className="flex flex-col w-full" style={{ gap: 'var(--space-section-content-m)' }}>
          <Divider appearance="base" size="sm" className="w-full" />
          {socialLinks && socialLinks.length > 0 && (
            <nav className="flex flex-wrap items-center justify-start" style={{ gap: 'var(--space-section-stack-m)' }}>
              {socialLinks.map((link) => (
                <Link key={link.label} href={link.href} size="sm" showRightIcon={false}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          {copyright && (
            <Paragraph size="sm" className="text-[var(--color-text-muted)] m-0 w-full">
              {copyright}
            </Paragraph>
          )}
        </div>
      )}
    </>
  );
}

export const FooterBlock: React.FC<FooterBlockProps> = ({
  variant = 'minimal',
  className,
  showTopDivider = true,
  ...props
}) => {
  const isEnterprise = variant === 'enterprise';

  return (
    <SectionShell
      recipe="section.footer"
      as="footer"
      appearance={isEnterprise ? 'brand' : 'surface'}
      className={cn(isEnterprise && 'text-[var(--color-text-on-brand)]', className)}
      style={isEnterprise ? { paddingTop: 0, paddingBottom: 0 } : undefined}
      aria-label="Footer"
    >
      {isEnterprise ? (
        <>
          {showTopDivider ? (
            <div className={FOOTER_TOP_DIVIDER_CLASS} style={FOOTER_TOP_DIVIDER_STYLE} aria-hidden="true" />
          ) : null}
          <EnterpriseFooter variant={variant} {...props} />
        </>
      ) : (
        <MinimalFooter variant={variant} {...props} />
      )}
    </SectionShell>
  );
};

FooterBlock.displayName = 'FooterBlock';
