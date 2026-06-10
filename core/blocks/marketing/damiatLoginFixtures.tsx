import type { LoginBlockProps } from './LoginBlock';

export const damiatLoginContent: LoginBlockProps = {
  logo: 'DAMIAT',
  title: 'Вход в личный кабинет',
  submitLabel: 'Войти',
  forgotPasswordLabel: 'Забыли пароль?',
  forgotPasswordHref: '#forgot-password',
  rememberMeLabel: 'Запомнить меня',
  labels: {
    username: 'Логин',
    password: 'Пароль',
  },
  registrationHint: (
    <>
      Нет аккаунта? Позвоните{' '}
      <a href="tel:+79184321199" className="text-[var(--color-brand-primary)] underline underline-offset-2">
        +7 (918) 432-11-99
      </a>{' '}
      или напишите{' '}
      <a href="mailto:info@damiat.ru" className="text-[var(--color-brand-primary)] underline underline-offset-2">
        info@damiat.ru
      </a>
    </>
  ),
  legalLinks: [
    { label: 'Политика конфиденциальности', href: '#' },
    { label: 'Статус сервиса', href: '#' },
  ],
};

export const damiatLoginWithErrorContent: LoginBlockProps = {
  ...damiatLoginContent,
  errorMessage: 'Неверный логин или пароль',
};

export const damiatLoginArgs = {
  login: damiatLoginContent,
};

export type DamiatLoginArgs = typeof damiatLoginArgs;
