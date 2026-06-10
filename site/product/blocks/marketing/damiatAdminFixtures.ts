/**
 * DAMIAT admin panel — Storybook fixtures (front-only, no API).
 */
import type { AppShellNavItem } from '@ai-ds/core/blocks/AppShellBlock';
import type {
  AdminCaseDraft,
  AdminEventDraft,
  AdminPartnerRecord,
  AdminUserRecord,
} from './AdminContentEditorBlock/AdminContentEditor.types';
import type { DamiatAdminPageProps } from './DamiatAdminPage/DamiatAdminPage';
import {
  damiatCaseDetailAnchorNav,
  damiatCaseDetailBusinessResults,
  damiatCaseDetailHero,
  damiatCaseDetailImplemented,
  damiatCaseDetailIntro,
  damiatCaseDetailNarrative,
} from './damiatCaseDetailFixtures';
import { damiatEventsContent, damiatPartnersContent } from './damiatLandingFixtures';

export const damiatAdminNav: AppShellNavItem[] = [
  { id: 'cases', label: 'Кейсы' },
  { id: 'events', label: 'Мероприятия' },
  { id: 'users', label: 'Пользователи' },
  { id: 'partners', label: 'Партнёры' },
];

export const damiatAdminCasePublished: AdminCaseDraft = {
  id: 'agro-holding',
  kind: 'case',
  title: 'ООО «Агро холдинг»',
  status: 'published',
  updatedAt: '2026-06-01',
  slug: 'agro-holding',
  seoTitle: 'Кейс: ООО «Агро холдинг» — DAMIAT',
  anchorNav: damiatCaseDetailAnchorNav.items.map((item) => ({
    id: item.id,
    label: item.label,
  })),
  heroBreadcrumbs: damiatCaseDetailHero.breadcrumbs?.map((crumb) => crumb.label) ?? [],
  heroTitle: damiatCaseDetailHero.title ?? '',
  heroSubtitle: damiatCaseDetailHero.subtitle,
  leadParagraphs: [...(damiatCaseDetailIntro.leadParagraphs ?? [])],
  highlights: [...(damiatCaseDetailIntro.highlights ?? [])],
  trailParagraphs: [...(damiatCaseDetailIntro.trailParagraphs ?? [])],
  businessStats: damiatCaseDetailBusinessResults.stats.map((stat) => ({
    value: stat.value,
    label: stat.label,
  })),
  implementedIntro: damiatCaseDetailImplemented.intro,
  implementedItems: [...damiatCaseDetailImplemented.items],
  narrativeSections: damiatCaseDetailNarrative.sections.map((section) => ({
    id: section.id,
    title: section.title,
    paragraphs: section.paragraphs ? [...section.paragraphs] : undefined,
    bullets: section.bullets ? [...section.bullets] : undefined,
    quoteText: section.quote?.text,
    quoteAttribution: section.quote?.attribution,
  })),
};

export const damiatAdminCaseDraft: AdminCaseDraft = {
  id: 'potato-storage-draft',
  kind: 'case',
  title: 'Хранение картофеля — черновик',
  status: 'draft',
  updatedAt: '2026-06-08',
  slug: 'potato-storage-draft',
  seoTitle: 'Кейс: хранение картофеля',
  anchorNav: [
    { id: 'case-business-results', label: 'Бизнес-результаты' },
    { id: 'case-implemented', label: 'Что было реализовано?' },
  ],
  heroBreadcrumbs: ['Главная', 'Кейсы', 'Черновик'],
  heroTitle: 'Пилот КГС на площадке 8 000 т',
  leadParagraphs: ['Черновик описания кейса для новой площадки.'],
  highlights: [{ label: 'Объём', value: '8 000 т' }],
  trailParagraphs: [],
  businessStats: [{ value: '—', label: 'эффект уточняется' }],
  implementedIntro: 'Планируемые работы:',
  implementedItems: ['Мониторинг CO₂', 'Генератор этилена'],
  narrativeSections: [
    {
      id: 'case-why',
      title: 'Зачем это заказчику?',
      paragraphs: ['Текст раздела в черновике.'],
    },
  ],
};

export const damiatAdminEventsSeed: AdminEventDraft[] = damiatEventsContent.events.map(
  (event) => ({
    id: event.id ?? event.title,
    kind: 'event' as const,
    title: event.title,
    status: 'published' as const,
    updatedAt: '2026-06-01',
    slug: event.id ?? event.title,
    seoTitle: event.title,
    anchorNav: [{ id: 'event-body', label: 'Описание' }],
    format: event.format,
    date: event.date,
    eventTitle: event.title,
    location: event.location,
    href: event.href,
    paragraphs: [`Описание мероприятия «${event.title}».`],
  }),
);

export const damiatAdminEventDraft: AdminEventDraft = {
  id: 'event-draft-summer',
  kind: 'event',
  title: 'Летняя демо-сессия DAMIAT',
  status: 'draft',
  updatedAt: '2026-06-09',
  slug: 'summer-demo',
  seoTitle: 'Летняя демо-сессия DAMIAT',
  anchorNav: [{ id: 'event-body', label: 'Описание' }],
  format: 'online',
  date: '2026-07-15',
  eventTitle: 'Летняя демо-сессия DAMIAT',
  location: 'Онлайн',
  href: '#events-summer-demo',
  paragraphs: ['Черновик описания мероприятия.'],
};

export const damiatAdminUsersSeed: AdminUserRecord[] = [
  {
    id: 'user-agro',
    organization: 'ООО «Агро холдинг»',
    email: 'ops@agro-holding.example',
    role: 'Оператор',
    passwordStatus: 'active',
    lastLogin: '2026-06-09',
  },
  {
    id: 'user-rusagro',
    organization: 'Rusagro',
    email: 'storage@rusagro.example',
    role: 'Менеджер',
    passwordStatus: 'pending',
    lastLogin: '2026-05-28',
  },
  {
    id: 'user-demo',
    organization: 'DAMIAT Demo Farm',
    email: 'demo@damiat.example',
    role: 'Администратор',
    passwordStatus: 'expired',
    lastLogin: '2026-04-12',
  },
];

export const damiatAdminPartnersSeed: AdminPartnerRecord[] = damiatPartnersContent.partners.map(
  (partner, index) => ({
    id: partner.id ?? `partner-${index}`,
    name: partner.name,
    imageSrc: partner.imageSrc,
    href: partner.href,
  }),
);

export const damiatAdminArgs: DamiatAdminPageProps = {
  storageLabel: 'Админ-панель',
  userLabel: 'Администратор',
  nav: damiatAdminNav,
  defaultSection: 'cases',
  initialCases: [damiatAdminCasePublished, damiatAdminCaseDraft],
  initialEvents: [...damiatAdminEventsSeed, damiatAdminEventDraft],
  initialUsers: damiatAdminUsersSeed,
  initialPartners: damiatAdminPartnersSeed,
};
