import type React from 'react';

export interface NavbarLink {
  label: string;
  href?: string;
  /** Opens services mega menu instead of navigating (enterprise). */
  megaMenu?: boolean;
}

export interface NavbarServiceItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavbarServiceCategory {
  id: string;
  label: string;
  items: NavbarServiceItem[];
}

export type NavbarSocialIcon = 'telegram' | 'phone' | 'vk' | 'youtube';

export interface NavbarSocialLink {
  label: string;
  href: string;
  icon: NavbarSocialIcon;
}

export interface NavbarPhoneInfo {
  number: string;
  href?: string;
  status?: {
    label: string;
    href: string;
  };
}

export interface NavbarCta {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: 'user' | 'send';
}

export interface NavbarBlockProps {
  /** Logo text or custom node (SVG mark). */
  logo: React.ReactNode;
  links: NavbarLink[];
  /** Primary CTA — e.g. «Отправить заявку». */
  cta?: NavbarCta;
  /** Secondary account CTA — e.g. «GitHub» or «Документация». */
  accountCta?: NavbarCta;
  sticky?: boolean;
  /**
   * `enterprise` — AICADS PRO overlay bar, mega menu, social rail, phone block.
   * `default` — compact SaaS navbar (backward compatible).
   *
   * When omitted, switches to `enterprise` if `servicesMenu`, `socialLinks`, or `phone` is set.
   * Consumers should pass `variant` explicitly.
   */
  variant?: 'default' | 'enterprise';
  /** Transparent over hero; solid surface after scroll (enterprise). Requires brand above-fold shell on landing pages. */
  overlay?: boolean;
  /** Always glass overlay (no scroll → solid transition). For photo/video hero backgrounds. */
  staticGlass?: boolean;
  /** Tabbed mega menu panels for services trigger link. */
  servicesMenu?: NavbarServiceCategory[];
  /**
   * @internal Storybook/demo only — opens services panel on mount.
   */
  defaultServicesOpen?: boolean;
  /**
   * @internal Storybook/demo only — opens mobile drawer on mount.
   */
  defaultMobileOpen?: boolean;
  /** Label of nav item that opens mega menu. Default: first link with `megaMenu: true`. */
  servicesTriggerLabel?: string;
  /** Social icons — above-fold strip below navbar (hidden on scroll); mobile drawer only otherwise. */
  socialLinks?: NavbarSocialLink[];
  /** Show above-fold social strip before scroll (default true when socialLinks set). */
  showSocialRail?: boolean;
  phone?: NavbarPhoneInfo;
  className?: string;
}

/** @internal Storybook-only props extension. */
export interface NavbarBlockStoryProps extends NavbarBlockProps {
  defaultServicesOpen?: boolean;
  defaultMobileOpen?: boolean;
}
