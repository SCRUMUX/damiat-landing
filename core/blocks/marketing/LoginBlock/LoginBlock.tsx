import React from 'react';
import { cn } from '../../../components/primitives/_shared';
import {
  LOGIN_FORM_COLUMN_CLASS,
  LOGIN_FORM_HEADER_CLASS,
} from '../../_shared/blockLayout';
import { LoginForm } from './LoginForm';
import type { LoginBlockProps } from './LoginBlock.types';

export type {
  LoginBlockProps,
  LoginFormLabels,
  LoginFormValues,
  LoginLegalLink,
} from './LoginBlock.types';

export const LoginBlock: React.FC<LoginBlockProps> = ({
  logo = 'DAMIAT',
  title = 'Вход в личный кабинет',
  subtitle,
  className,
  legalLinks: _legalLinks,
  ...formProps
}) => (
  <article className={cn(LOGIN_FORM_COLUMN_CLASS, className)} aria-label="Login">
    <header className={LOGIN_FORM_HEADER_CLASS}>
      {typeof logo === 'string' ? (
        <span className="font-semibold text-style-h3 text-[var(--color-brand-primary)]">{logo}</span>
      ) : (
        logo
      )}
      <h1 className="m-0 font-medium text-style-h2 text-[var(--color-text-primary)]">{title}</h1>
      {subtitle ? (
        <p className="m-0 text-style-body-sm text-[var(--color-text-secondary)]">{subtitle}</p>
      ) : null}
    </header>

    <LoginForm {...formProps} />
  </article>
);

LoginBlock.displayName = 'LoginBlock';
