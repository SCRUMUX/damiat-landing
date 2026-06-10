import type { ContactHeroFormValues } from './ContactHeroBlock';
import type { DamiatLandingPageProps } from './DamiatLandingPage/DamiatLandingPage';
import { damiatLandingArgs } from './damiatLandingFixtures';
import {
  damiatScenarioWithMedia,
  damiatDeviceIntroWithMedia,
  withDamiatHeroMedia,
} from './damiatDemoMedia';
import { damiatLandingHeroBackgrounds } from './demo-assets/damiatLandingHeroBackgrounds';
import { withTrustFeaturedCover } from './trustDemoMedia';

export interface DamiatContactSubmitResult {
  ok: boolean;
  message?: string;
}

export interface DamiatLandingIntegrationOptions {
  /** GET endpoint прогноза цен калькулятора (12 × ₽/т). */
  priceApiUrl?: string;
  /** POST endpoint для заявки. По умолчанию — console stub. */
  contactApiUrl?: string;
  /** Вызывается после успешной отправки формы. */
  onContactSuccess?: (values: ContactHeroFormValues) => void;
  /** Кастомный обработчик входа (иначе — alert-заглушка). */
  onLoginClick?: () => void;
}

export function createDamiatContactSubmitHandler(
  options: DamiatLandingIntegrationOptions = {},
): (values: ContactHeroFormValues) => void {
  const { contactApiUrl, onContactSuccess } = options;

  return (values) => {
    if (!values.consent) {
      window.alert('Подтвердите согласие на обработку персональных данных.');
      return;
    }

    if (!values.name.trim() || !values.phone.trim()) {
      window.alert('Заполните имя и телефон.');
      return;
    }

    if (contactApiUrl) {
      fetch(contactApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          onContactSuccess?.(values);
          window.alert('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
        })
        .catch(() => {
          window.alert('Не удалось отправить заявку. Попробуйте позже или напишите на hello@damiat.io');
        });
      return;
    }

    console.info('[DAMIAT] Contact form submit (stub):', values);
    onContactSuccess?.(values);
    window.alert('Заявка принята (демо-режим). Подключите contactApiUrl для отправки на сервер.');
  };
}

export function createDamiatLoginHandler(
  onLoginClick?: () => void,
): () => void {
  return () => {
    if (onLoginClick) {
      onLoginClick();
      return;
    }
    console.info('[DAMIAT] Login click (stub) — подключите auth provider или onLoginClick');
    window.alert('Вход в личный кабинет — в разработке. Используйте форму внизу страницы для демо.');
  };
}

/** Полный набор props как в Storybook (медиа, фоны, trust cover). */
export function buildDamiatLandingDisplayProps(
  options: DamiatLandingIntegrationOptions = {},
): DamiatLandingPageProps {
  const onContactSubmit = createDamiatContactSubmitHandler(options);
  const onLogin = createDamiatLoginHandler(options.onLoginClick);

  return {
    ...damiatLandingArgs,
    hero: withDamiatHeroMedia(damiatLandingArgs.hero),
    heroBackgroundImage: damiatLandingHeroBackgrounds.main,
    sectionBackgrounds: damiatLandingHeroBackgrounds,
    scenario: damiatScenarioWithMedia,
    deviceIntro: damiatDeviceIntroWithMedia,
    trust: withTrustFeaturedCover(damiatLandingArgs.trust),
    calculator: {
      ...damiatLandingArgs.calculator,
      priceApiUrl: options.priceApiUrl,
    },
    contactHero: {
      ...damiatLandingArgs.contactHero,
      onSubmit: onContactSubmit,
    },
    navbar: {
      ...damiatLandingArgs.navbar,
      accountCta: {
        ...damiatLandingArgs.navbar.accountCta!,
        href: undefined,
        onClick: onLogin,
      },
    },
    motionProfile: 'lean',
  };
}

/** @deprecated Use buildDamiatLandingDisplayProps */
export function buildDamiatLandingProps(
  options: DamiatLandingIntegrationOptions = {},
): DamiatLandingPageProps {
  return buildDamiatLandingDisplayProps(options);
}
