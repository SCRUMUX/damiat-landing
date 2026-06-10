import React from 'react';
import { Link } from '../../../components/primitives/Link';
import { cn } from '../../../components/primitives/_shared';
import { LOGIN_LEGAL_FOOTER_CLASS } from '../../_shared/blockLayout';
import type { LoginLegalLink } from './LoginBlock.types';

export interface LoginLegalFooterProps {
  links?: LoginLegalLink[];
  className?: string;
}

export const LoginLegalFooter: React.FC<LoginLegalFooterProps> = ({
  links = [],
  className,
}) => {
  if (links.length === 0) return null;

  return (
    <footer className={cn(LOGIN_LEGAL_FOOTER_CLASS, className)} aria-label="Legal links">
      {links.map((link) => (
        <Link key={link.href + link.label} href={link.href} size="sm" className="text-[var(--color-text-muted)]">
          {link.label}
        </Link>
      ))}
    </footer>
  );
};

LoginLegalFooter.displayName = 'LoginLegalFooter';
