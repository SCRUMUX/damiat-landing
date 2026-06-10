import type React from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
}

export interface FooterContactItem {
  label: string;
  value: string;
  href: string;
}

export interface FooterLegalLink {
  label: string;
  href: string;
  /** Multi-line legal notice (Cortel accreditation block). */
  multiline?: boolean;
}

export interface FooterBlockProps {
  /**
   * `minimal` — multi-column SaaS footer (default).
   * `enterprise` — Cortel-style brand footer after contact hero.
   */
  variant?: 'minimal' | 'enterprise';
  logo?: React.ReactNode;
  logoHref?: string;
  /** Flat primary nav — enterprise variant. */
  navLinks?: FooterLink[];
  /** Multi-column layout — minimal variant. */
  columns?: FooterColumn[];
  contacts?: FooterContactItem[];
  legalLinks?: FooterLegalLink[];
  copyright?: string;
  socialLinks?: FooterSocialLink[];
  showBackToTop?: boolean;
  /** Cortel top rule above footer content — hide when stacked under CTA on photo hero. */
  showTopDivider?: boolean;
  className?: string;
}
