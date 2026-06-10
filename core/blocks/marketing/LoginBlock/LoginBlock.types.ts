import type React from 'react';

export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormLabels {
  username?: string;
  password?: string;
}

export interface LoginLegalLink {
  label: string;
  href: string;
}

export interface LoginBlockProps {
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  forgotPasswordLabel?: string;
  forgotPasswordHref?: string;
  rememberMeLabel?: string;
  registrationHint?: React.ReactNode;
  legalLinks?: LoginLegalLink[];
  labels?: LoginFormLabels;
  errorMessage?: string;
  values?: Partial<LoginFormValues>;
  defaultValues?: Partial<LoginFormValues>;
  onChange?: (values: LoginFormValues) => void;
  onSubmit?: (values: LoginFormValues) => void;
  className?: string;
}
