import React from 'react';
import type { HeroBlockProps } from './HeroBlock';
import type { FeaturesBlockProps } from './FeaturesBlock';
import type { PricingBlockProps } from './PricingBlock';
import type { CTABlockProps } from './CTABlock';
import type { FooterBlockProps } from './FooterBlock';
import type { EventsBlockProps } from './EventsBlock';
import type { ServicesBlockProps, ServiceItem } from './ServicesBlock';
import type { SolutionsBlockProps, SolutionItem } from './SolutionsBlock';
import type { TrustBlockProps, TrustPillarItem, TrustStandardItem } from './TrustBlock';
import type { SupportBlockProps, SupportContactItem, SupportStatItem } from './SupportBlock';
import type { ShowcasePanelBlockProps, ShowcasePanelItem } from './ShowcasePanelBlock';
import type { BlogBlockProps, BlogPostItem } from './BlogBlock';
import type { PartnersBlockProps, PartnerItem } from './PartnersBlock';
import type { ContactHeroBlockProps } from './ContactHeroBlock';
import type { WhyUsBlockProps } from './WhyUsBlock';
import type { ChooseUsBlockProps } from './ChooseUsBlock';
import type { ProcessBlockProps } from './ProcessBlock';
import type { FAQBlockProps } from './FAQBlock';

/** Abstract illustration — thin isometric UI layers (depth via faces, one contact shadow). */
export const aicadsEnterpriseHeroMedia = (
  <div
    className="relative flex h-[var(--space-360)] w-full max-w-[var(--space-480)] items-center justify-end"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 480 400"
      fill="none"
      className="h-full w-full max-w-[var(--space-480)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="aicadsHeroPlateTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.88" />
          <stop offset="100%" stopColor="white" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id="aicadsHeroPlateEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="aicadsHeroContactShadow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="55%" stopColor="black" stopOpacity="0.08" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Single ground contact — whole stack sits on one plane */}
      <ellipse cx="252" cy="334" rx="152" ry="14" fill="black" fillOpacity="0.1" />

      {/* Back plate — tokens grid */}
      <g opacity="0.92">
        <path d="M108 248 L228 188 L348 248 L228 308 Z" fill="url(#aicadsHeroPlateTop)" />
        <path d="M228 188 L348 248 L348 256 L228 196 Z" fill="url(#aicadsHeroPlateEdge)" />
        <path d="M108 248 L228 188 L348 248 L228 308 Z" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" />
        <path d="M138 258 L258 198" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
        <path d="M168 268 L288 208" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
        <path d="M198 278 L318 218" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
        <path d="M148 244 L268 184" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
        <path d="M178 274 L298 214" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
      </g>

      {/* Mid plate — component shell */}
      <g transform="translate(0 -36)">
        <path
          d="M228 248 L228 256 L108 316 L108 308 Z"
          fill="url(#aicadsHeroContactShadow)"
        />
        <path d="M148 208 L268 148 L388 208 L268 268 Z" fill="url(#aicadsHeroPlateTop)" />
        <path d="M268 148 L388 208 L388 216 L268 156 Z" fill="url(#aicadsHeroPlateEdge)" />
        <path d="M148 208 L268 148 L388 208 L268 268 Z" fill="none" stroke="white" strokeOpacity="0.68" strokeWidth="1.5" />
        <rect x="188" y="188" width="96" height="56" rx="10" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.32" strokeWidth="1.25" />
        <rect x="204" y="204" width="44" height="44" rx="8" stroke="white" strokeOpacity="0.38" strokeWidth="1.25" />
        <rect x="256" y="210" width="52" height="7" rx="3.5" fill="white" fillOpacity="0.48" />
        <rect x="256" y="224" width="36" height="5" rx="2.5" fill="white" fillOpacity="0.26" />
        <path d="M214 228 L234 218 L254 228 L234 238 Z" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
      </g>

      {/* Front plate — pattern graph */}
      <g transform="translate(24 -72)">
        <path
          d="M268 248 L268 256 L148 316 L148 308 Z"
          fill="url(#aicadsHeroContactShadow)"
        />
        <path d="M188 168 L308 108 L428 168 L308 228 Z" fill="url(#aicadsHeroPlateTop)" />
        <path d="M308 108 L428 168 L428 176 L308 116 Z" fill="url(#aicadsHeroPlateEdge)" />
        <path d="M188 168 L308 108 L428 168 L308 228 Z" fill="none" stroke="white" strokeOpacity="0.82" strokeWidth="1.75" />
        <path
          d="M216 188 L248 172 L280 184 L312 168 L344 176"
          stroke="white"
          strokeOpacity="0.72"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="248" cy="172" r="3.5" fill="white" fillOpacity="0.9" />
        <circle cx="312" cy="168" r="3.5" fill="white" fillOpacity="0.9" />
        <path d="M216 200 H344" stroke="white" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4 5" />
      </g>

      {/* Accent — flat token ring, no shadow */}
      <g opacity="0.7">
        <circle cx="96" cy="132" r="40" stroke="white" strokeOpacity="0.28" strokeWidth="1.25" strokeDasharray="4 6" />
        <circle cx="96" cy="132" r="22" stroke="white" strokeOpacity="0.45" strokeWidth="1.25" />
        <path d="M84 132 H108 M96 120 V144" stroke="white" strokeOpacity="0.55" strokeWidth="1.25" strokeLinecap="round" />
      </g>

      <g opacity="0.55">
        <path d="M388 92 L420 76 L452 92 L420 108 Z" fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.24" strokeWidth="1" />
      </g>
    </svg>
  </div>
);

export const aicadsEnterpriseHeroDemoContent: HeroBlockProps = {
  variant: 'enterprise',
  align: 'left',
  appearance: 'brand',
  title: 'AICADS — semantic платформа интерфейсов без layout drift',
  subtitle:
    'Токены, контракты, 57 примитивов и marketing-блоки — один semantic surface для продуктов и AI-сборщиков.',
  primaryAction: { label: 'Начать интеграцию', href: '#' },
  stats: [
    { value: '57+', label: 'UI-примитивов' },
    { value: '14', label: 'Pattern blocks' },
    { value: '24/7', label: 'Storybook parity' },
    { value: 'v0.7', label: 'Stable release' },
  ],
};

/** Full hero fixture — use in render(), not Storybook args. */
export const aicadsEnterpriseHeroDemo: HeroBlockProps = {
  ...aicadsEnterpriseHeroDemoContent,
  media: aicadsEnterpriseHeroMedia,
};

export function withEnterpriseHeroMedia(hero: HeroBlockProps): HeroBlockProps {
  return hero.media ? hero : { ...hero, media: aicadsEnterpriseHeroMedia };
}

/** Inner-page hero — breadcrumbs, category badge, title (Cortel case study). */
export const aicadsPageHeroDemoContent: HeroBlockProps = {
  variant: 'page',
  appearance: 'brand',
  breadcrumbs: [
    { label: 'Главная', href: '#' },
    { label: 'Паттерны', href: '#patterns' },
    { label: 'Enterprise landing template' },
  ],
  badge: 'Pattern blocks',
  title: 'Сборка landing из @ai-ds/core без layout drift',
};

export const aicadsEnterpriseFeaturesDemo: Pick<
  FeaturesBlockProps,
  'title' | 'subtitle' | 'columns' | 'features'
> = {
  title: 'Почему AICADS',
  subtitle: 'Архитектура дизайн-системы, которую можно собирать, проверять и масштабировать.',
  columns: 3,
  features: [
    {
      title: 'Token-driven UI',
      description: 'Стили только через tokens.css → contract → findClasses — без magic numbers.',
      icon: '🎨',
    },
    {
      title: 'Pattern manifest',
      description: 'ai-patterns.json и Storybook — единый каталог для AI и команд.',
      icon: '📋',
    },
    {
      title: 'Isolation contract',
      description: 'Radix, cmdk, vaul — только в _internal/; consumer видит semantic API.',
      icon: '🛡️',
    },
  ],
};

export const aicadsEnterprisePricingDemo: Pick<
  PricingBlockProps,
  'title' | 'subtitle' | 'highlightedIndex' | 'tiers'
> = {
  title: 'Distribution',
  subtitle: 'Git install — без npm registry.',
  highlightedIndex: 1,
  tiers: [
    {
      name: 'Core',
      price: 'Free',
      period: 'OSS',
      features: ['57 primitives', 'Tokens + contracts', 'ESLint config'],
      actionLabel: 'GitHub',
    },
    {
      name: 'PRO',
      price: 'v0.7',
      period: 'tag',
      features: ['Marketing blocks', 'Storybook kit', 'Pattern manifest'],
      actionLabel: 'Install',
    },
    {
      name: 'Team',
      price: 'Custom',
      features: ['Private patterns', 'Figma plugin', 'Migration support'],
      actionLabel: 'Contact',
    },
  ],
};

export const aicadsEnterpriseCtaDemo: Pick<CTABlockProps, 'variant' | 'title' | 'description' | 'action'> = {
  variant: 'band',
  title: 'Готовы подключить AICADS?',
  description: 'Установите @ai-ds/core, импортируйте tokens и соберите landing из pattern blocks.',
  action: { label: 'Открыть документацию', href: '#' },
};

export const aicadsEnterpriseEventsDemo: Pick<EventsBlockProps, 'title' | 'events'> = {
  title: 'Ближайшие события',
  events: [
    {
      id: 'webinar-patterns',
      format: 'online',
      formatLabel: 'онлайн',
      date: '28 мая 2026',
      title:
        'Вебинар: pattern blocks и ai-patterns.json — как AI-сборщики перестают «придумывать» layout',
      href: '#events/webinar-patterns',
    },
  ],
};

export const aicadsEnterpriseEventsCarouselDemo: Pick<EventsBlockProps, 'title' | 'events'> = {
  title: 'Ближайшие события',
  events: [
    {
      id: 'webinar-patterns',
      format: 'online',
      formatLabel: 'онлайн',
      date: '28 мая 2026',
      title:
        'Вебинар: pattern blocks и ai-patterns.json — стабильный rhythm для AI-generated landing',
      href: '#events/webinar-patterns',
    },
    {
      id: 'workshop-tokens',
      format: 'offline',
      formatLabel: 'офлайн',
      date: '12 июня 2026',
      title: 'Workshop: design tokens — от Figma variables до tokens.css и Tailwind preset',
      href: '#events/workshop-tokens',
      location: 'Москва',
    },
    {
      id: 'meetup-eslint',
      format: 'hybrid',
      formatLabel: 'гибрид',
      date: '3 июля 2026',
      title: 'Meetup: isolation contract — ESLint guardrails для consumer-проектов на @ai-ds/core',
      href: '#events/meetup-eslint',
    },
  ],
};

export const aicadsEnterpriseEventsListDemo: Pick<EventsBlockProps, 'title' | 'events' | 'variant'> = {
  title: 'Ближайшие события',
  variant: 'list',
  events: [
    {
      id: 'webinar-patterns',
      format: 'online',
      formatLabel: 'онлайн',
      date: '28 мая 2026',
      title: 'Pattern blocks и Storybook parity в @ai-ds/core',
      href: '#events/webinar-patterns',
    },
    {
      id: 'workshop-tokens',
      format: 'offline',
      formatLabel: 'офлайн',
      date: '12 июня 2026',
      title: 'Workshop: design tokens — от Figma variables до tokens.css и Tailwind preset',
      href: '#events/workshop-tokens',
      location: 'Москва',
    },
    {
      id: 'meetup-eslint',
      format: 'hybrid',
      formatLabel: 'гибрид',
      date: '3 июля 2026',
      title: 'Meetup: isolation contract — ESLint guardrails для consumer-проектов на @ai-ds/core',
      href: '#events/meetup-eslint',
    },
  ],
};

function buildServiceItems(prefix: string, titles: string[], descriptions?: string[]): ServiceItem[] {
  return titles.map((title, index) => ({
    id: `${prefix}-${index + 1}`,
    title,
    description:
      descriptions?.[index] ??
      'Semantic API, spacing recipes и Storybook parity — без layout drift в consumer-проектах.',
    action: { label: 'Подробнее', href: '#' },
  }));
}

export const aicadsServicesDemoContent: Pick<ServicesBlockProps, 'title' | 'subtitle' | 'categories'> = {
  title: 'Pattern blocks для продуктовых и marketing-страниц',
  subtitle:
    'Готовые секции с фиксированным rhythm — hero, events, solutions, services, CTA и footer из одного manifest.',
  categories: [
    {
      id: 'patterns',
      label: 'Marketing blocks',
      items: buildServiceItems(
        'patterns',
        [
          'Hero enterprise + metrics band',
          'Events band с carousel',
          'Solutions mosaic + inverse hover',
          'Services catalog с tabs',
          'Navbar overlay + mega menu',
          'LandingPageTemplate composition',
        ],
        [
          'Above-the-fold для enterprise landing с overlay navbar и brand band.',
          'Brand band после hero — carousel, format/date tags, event title.',
          'Кейсы внедрения: 2-row mosaic, inverse hover reveal на desktop.',
          'Sticky title + category tabs, 3-card grid и «Показать ещё».',
          'Enterprise navigation: phone block, social rail, services mega menu.',
          'Полная landing-страница из ai-patterns.json pageTemplates.',
        ],
      ),
    },
    {
      id: 'primitives',
      label: 'UI-примитивы',
      items: buildServiceItems(
        'primitives',
        [
          'Tabs через Radix adapter',
          'Modal / Drawer / Popover',
          'Form controls bundle',
          'Table + data cells',
          'Toast + CommandPalette',
          'Skeleton loading states',
        ],
        [
          'Semantic Tab API — consumer не импортирует @radix-ui/react-tabs.',
          'Dialog, Vaul drawer и Floating UI только в _internal/.',
          'Input, Select, Checkbox, Switch, PinInput с contract-driven стилями.',
          'Token-driven table cells, header rows и responsive layout.',
          'Sonner toast и cmdk palette за isolation boundary.',
          'SkeletonCard, SkeletonTable, SkeletonPage для loading UX.',
        ],
      ),
    },
    {
      id: 'integration',
      label: 'Интеграция',
      items: buildServiceItems(
        'integration',
        [
          'ESLint isolation contract',
          'tokens.css + Tailwind preset',
          'Storybook kit + viewports',
          'ai-patterns.json manifest',
          'Chromatic visual regression',
          'Figma plugin + contracts',
        ],
        [
          'Запрет прямых импортов Radix, cmdk, vaul в consumer-коде.',
          'Единый token surface: CSS variables → Tailwind → components.',
          'Playground Storybook с marketing viewports и engine-styles.',
          'Machine-readable каталог blocks, recipes и page templates.',
          'VRT pipeline для primitives и marketing blocks.',
          'Sync component contracts и spacing recipes с design tooling.',
        ],
      ),
    },
  ],
};

export const aicadsSolutionsDemoContent: Pick<
  Extract<SolutionsBlockProps, { variant?: 'showcase' }>,
  'title' | 'solutions' | 'viewAll'
> = {
  title: 'Реализованные решения',
  viewAll: { label: 'Смотреть все паттерны', href: '#patterns' },
  solutions: [
    {
      id: 'enterprise-landing',
      category: 'Design systems',
      title: 'Enterprise landing из pattern blocks без layout drift',
      description:
        'Overlay navbar, brand hero, events band, solutions mosaic и services catalog — один rhythm на всех breakpoints.',
      client: 'Pattern Labs',
      date: '12.03.2026',
      href: '#cases/enterprise-landing',
    },
    {
      id: 'ai-assembler',
      category: 'AI-сборка',
      title: 'Replit-assembler на ai-patterns.json — предсказуемый section order',
      description:
        'AI выбирает blocks из manifest вместо импровизации spacing; Storybook — source of truth для preview.',
      client: 'AI Platform Team',
      date: '08.04.2026',
      href: '#cases/ai-assembler',
    },
    {
      id: 'eslint-isolation',
      category: 'Consumer apps',
      title: 'Isolation contract в monorepo из 12 пакетов',
      description:
        'ESLint config @ai-ds/core блокирует прямые импорты Radix и cmdk — semantic surface только через primitives.',
      client: 'SaaS Frontend',
      date: '21.01.2026',
      href: '#cases/eslint-isolation',
    },
    {
      id: 'git-distribution',
      category: 'Open source',
      title: 'Git-distributed @ai-ds/core — tokens, blocks и Storybook kit без npm registry',
      description:
        'Consumer ставит core через git tag, импортирует @ai-ds/core/blocks/* и @ai-ds/core/recipes; migration guides в CHANGELOG.',
      client: 'OSS Maintainers',
      date: '15.11.2025',
      href: '#cases/git-distribution',
    },
    {
      id: 'chromatic-vrt',
      category: 'Storybook',
      title: 'Chromatic VRT для 57 primitives и marketing blocks',
      description: 'Visual regression на contract variants и marketing sections из pattern manifest.',
      client: 'Design Ops',
      date: '02.02.2026',
      href: '#cases/chromatic-vrt',
    },
    {
      id: 'platform-rollout',
      category: 'Platform teams',
      title: 'Единый semantic surface для 4 product squads',
      highlights: [
        '57+ UI-примитивов в одном import surface',
        '19 pattern blocks в ai-patterns.json',
        'Storybook parity на desktop / tablet / mobile',
      ],
      client: 'UI Platform',
      date: '19.05.2026',
      href: '#cases/platform-rollout',
    },
  ] satisfies SolutionItem[],
};

export const aicadsSolutionsPageHeroDemoContent: HeroBlockProps = {
  variant: 'solutions',
  appearance: 'base',
  breadcrumbs: [
    { label: 'Главная', href: '#' },
    { label: 'Решения' },
  ],
  title: 'Решения',
  subtitle:
    'Решения для построения, развития и защиты интерфейсов. Готовые pattern blocks и semantic primitives, которые адаптируются под задачи продукта и масштаб команды.',
};

export const aicadsSolutionsCatalogDemoContent: Extract<SolutionsBlockProps, { variant: 'catalog' }> = {
  variant: 'catalog',
  items: [
    {
      id: 'patterns',
      title: 'Marketing pattern blocks',
      description: 'Готовые секции landing из ai-patterns.json без layout drift',
      href: '#solutions/patterns',
    },
    {
      id: 'primitives',
      title: 'Semantic UI primitives',
      description: '57 components с contract-driven appearance и engine isolation',
      href: '#solutions/primitives',
    },
    {
      id: 'isolation',
      title: 'Consumer isolation contract',
      description: 'ESLint config блокирует прямой импорт Radix, cmdk и sonner',
      href: '#solutions/isolation',
    },
    {
      id: 'tokens',
      title: 'Design tokens & Tailwind',
      description: 'Единый rhythm через CSS variables и section recipes',
      href: '#solutions/tokens',
    },
    {
      id: 'storybook',
      title: 'Storybook & VRT',
      description: 'Visual regression для primitives и marketing blocks',
      href: '#solutions/storybook',
    },
    {
      id: 'manifest',
      title: 'AI-native assembly',
      description: 'ai-patterns.json и manifest для предсказуемой сборки страниц',
      href: '#solutions/manifest',
    },
  ],
};

export const aicadsTrustDemoContent: Pick<
  TrustBlockProps,
  'title' | 'pillars' | 'standardsTitle' | 'standards'
> = {
  title: 'Надёжность и предсказуемость',
  standardsTitle: 'Стандарты и контракты для consumer-проектов',
  pillars: [
    {
      id: 'primitives',
      featured: true,
      title: '57+ primitives',
      description:
        'Contract-driven UI — tokens.css, JSON contracts и findClasses вместо magic numbers и layout drift.',
    },
    {
      id: 'isolation',
      title: 'Isolation contract',
      description:
        'ESLint config блокирует прямые импорты Radix, cmdk, vaul и других engines в consumer-коде.',
    },
    {
      id: 'storybook',
      title: 'Storybook parity',
      description:
        'Desktop, tablet и mobile viewports для каждого primitive и marketing block — единый source of truth.',
    },
    {
      id: 'api-freeze',
      title: 'API surface freeze',
      description:
        'api-extractor фиксирует public exports @ai-ds/core — изменения проходят review в CI.',
    },
  ] satisfies TrustPillarItem[],
  standards: [
    {
      id: 'tokens',
      title: 'tokens.css',
      description: 'Единый token surface для CSS variables и Tailwind preset.',
      href: '#tokens',
    },
    {
      id: 'contracts',
      title: 'Component contracts',
      description: 'JSON schema и variant rules на каждый UI-primitive.',
      href: '#contracts',
    },
    {
      id: 'eslint',
      title: 'ESLint config',
      description: 'Isolation boundary проверяется в CI consumer-проектов.',
      href: '#eslint',
    },
    {
      id: 'api-extractor',
      title: 'API Extractor',
      description: 'Frozen public surface report в etc/ai-ds-core.api.md.',
      href: '#api',
    },
    {
      id: 'chromatic',
      title: 'Chromatic VRT',
      description: 'Visual regression на contract variants и marketing blocks.',
      href: '#vrt',
    },
  ] satisfies TrustStandardItem[],
};

export const aicadsSupportDemoContent: Pick<
  SupportBlockProps,
  'titleLine1' | 'titleLine2' | 'titleAccent' | 'description' | 'stats' | 'contacts'
> = {
  titleLine1: 'В каждой интеграции,',
  titleLine2: 'поддержка',
  titleAccent: 'всегда на связи',
  description:
    'Maintainers @ai-ds/core работают вместе с вашими командами — от tokens.css и ESLint isolation до pattern blocks и Storybook parity. Документировано. Предсказуемо. С migration guides в каждом релизе.',
  stats: [
    {
      id: 'response-time',
      value: '<24 часа',
      label: 'Столько времени нужно, чтобы взять запрос по интеграции в работу',
    },
    {
      id: 'patterns',
      value: '57+',
      label: 'UI-примитивов с JSON-contracts и Storybook stories',
    },
    {
      id: 'migrations',
      value: '<2%',
      label: 'Breaking changes без migration guide в CHANGELOG',
    },
  ] satisfies SupportStatItem[],
  contacts: [
    {
      id: 'github',
      label: 'GitHub',
      value: 'Issues & Discussions',
      href: 'https://github.com/SCRUMUX/AICADS-PRO',
    },
    {
      id: 'docs',
      label: 'Документация',
      value: 'ARCHITECTURE.md',
      href: '#architecture',
    },
    {
      id: 'storybook',
      label: 'Storybook',
      value: 'Live preview',
      href: 'https://scrumux.github.io/AICADS-PRO/',
    },
  ] satisfies SupportContactItem[],
};

export const aicadsShowcasePanelDemoContent: Pick<
  ShowcasePanelBlockProps,
  'title' | 'titleBreakBefore' | 'panels'
> = {
  title: 'Удобно управлять всеми primitives и blocks в одном Storybook',
  titleBreakBefore: ' в одном Storybook',
  panels: [
    {
      id: 'contracts',
      title: 'Contract-driven preview без layout drift',
      bullets: [
        'tokens.css → Tailwind preset → findClasses — единая цепочка без magic numbers',
        'JSON contract на каждый primitive: variants, states, spacing rules',
        'Storybook stories как source of truth для desktop / tablet / mobile',
        'Chromatic VRT ловит visual drift до merge в consumer-проект',
        'ESLint config блокирует прямые импорты engines в app-коде',
      ],
      action: { label: 'В Storybook', href: 'https://scrumux.github.io/AICADS-PRO/' },
    },
    {
      id: 'patterns',
      title: 'Сборка landing из ai-patterns.json',
      bullets: [
        'pageTemplates задают section order — navbar → hero → blocks → footer',
        '22 pattern blocks с recipes, primitives и storyReference',
        'Spacing recipes resolve в SectionShell — один rhythm на всех breakpoints',
        'Fixture references для enterprise navbar и demo content',
        'AI-assembler выбирает blocks из manifest вместо импровизации layout',
      ],
      action: { label: 'Открыть manifest', href: '#patterns' },
    },
  ] satisfies ShowcasePanelItem[],
};

export const aicadsBlogDemoContent: Pick<BlogBlockProps, 'title' | 'subtitle' | 'posts' | 'viewAll'> = {
  title: 'Блог',
  subtitle:
    'Гайды по интеграции @ai-ds/core: isolation contract, Storybook parity, Chromatic VRT и сборка landing из ai-patterns.json.',
  viewAll: { label: 'Смотреть все статьи', href: '#blog' },
  posts: [
    {
      id: 'isolation',
      title: 'Isolation contract: почему consumer не импортирует Radix напрямую',
      excerpt:
        '_internal/ adapters — единственная точка касания engines. ESLint config блокирует @radix-ui, cmdk, sonner и cva в app-коде. Замена движка — без churn в продуктах.',
      date: '12 мая 2026',
      href: '#isolation',
    },
    {
      id: 'storybook',
      title: 'Storybook как source of truth для primitives и blocks',
      excerpt:
        'Каждый component и pattern block имеет storyReference в ai-patterns.json. Viewports desktop / tablet / mobile, engine-styles и marketing recipes — один preview для design и dev.',
      date: '8 мая 2026',
      href: '#storybook',
    },
    {
      id: 'chromatic',
      title: 'Chromatic VRT: ловим visual drift до merge',
      excerpt:
        'Contract variants и marketing blocks снимаются в CI. Diff по pixels до попадания в consumer — tokens.css, spacing recipes и hover states остаются предсказуемыми.',
      date: '2 мая 2026',
      href: '#chromatic',
    },
    {
      id: 'patterns',
      title: 'Сборка enterprise landing из ai-patterns.json',
      excerpt:
        'pageTemplates задают порядок секций: navbar → hero → events → solutions → support → trust → showcase → blog → features → CTA. Fixture content для Storybook и AI-assembler.',
      date: '28 апр. 2026',
      href: '#patterns',
    },
    {
      id: 'contracts',
      title: 'JSON contracts: variants, states и spacing rules',
      excerpt:
        'contracts/components/*.contract.json описывают публичный API каждого primitive. Tailwind preset и findClasses читают tokens.css — без magic numbers в consumer layout.',
      date: '22 апр. 2026',
      href: '#contracts',
    },
    {
      id: 'distribution',
      title: 'Git-distribution: npm package и GitHub Pages Storybook',
      excerpt:
        '@ai-ds/core публикуется с granular exports — components, blocks, hooks, eslint-config. Storybook deploy на push в main; migration guides в CHANGELOG на каждый breaking change.',
      date: '15 апр. 2026',
      href: '#distribution',
    },
  ] satisfies BlogPostItem[],
};

export const aicadsPartnersDemoContent: Pick<PartnersBlockProps, 'title' | 'partners'> = {
  title: 'Стратегические партнеры',
  partners: [
    { id: 'radix', name: 'Radix UI', href: 'https://www.radix-ui.com/' },
    { id: 'storybook', name: 'Storybook', href: 'https://storybook.js.org/' },
    { id: 'chromatic', name: 'Chromatic', href: 'https://www.chromatic.com/' },
    { id: 'github', name: 'GitHub', href: 'https://github.com/SCRUMUX/AICADS-PRO' },
    { id: 'figma', name: 'Figma', href: '#figma' },
    { id: 'eslint', name: 'ESLint', href: '#eslint' },
    { id: 'tailwind', name: 'Tailwind CSS', href: '#tailwind' },
    { id: 'typescript', name: 'TypeScript', href: 'https://www.typescriptlang.org/' },
    { id: 'vite', name: 'Vite', href: 'https://vitejs.dev/' },
    { id: 'api-extractor', name: 'API Extractor', href: '#api' },
    { id: 'tokens', name: 'Design Tokens', href: '#tokens' },
  ] satisfies PartnerItem[],
};

export const aicadsContactHeroDemoContent: Pick<
  ContactHeroBlockProps,
  'title' | 'description' | 'submitLabel'
> = {
  title: 'Поможем с дизайн-системой уже сегодня',
  description:
    'Оставьте контакты — расскажем, как AICADS ускорит разработку интерфейсов, снизит расходы на UI и обеспечит единый стандарт для продуктовых команд.',
  submitLabel: 'Обсудить интеграцию',
};

export const aicadsWhyUsDemoContent: Pick<
  WhyUsBlockProps,
  'title' | 'titleBreakBefore' | 'primaryCards' | 'secondaryCards' | 'featured'
> = {
  title: 'Почему с AICADS работают продуктовые команды',
  titleBreakBefore: ' продуктовые команды',
  primaryCards: [
    {
      id: 'primitives',
      title: '57 primitives',
      description:
        'Полный semantic surface с contract-driven appearance, Storybook coverage и API Extractor для стабильных интеграций.',
    },
    {
      id: 'flexibility',
      title: 'Удобство и гибкость',
      description:
        'Granular imports — blocks, components, hooks, tokens — без монолита и без прямой зависимости consumer-кода от Radix, cmdk или sonner.',
    },
  ],
  secondaryCards: [
    {
      id: 'rhythm',
      title: 'Production rhythm',
      description:
        'Named spacing recipes (`section.*`) вместо хардкода отступов — AI-assemblers и команды получают одинаковый vertical rhythm на landing.',
    },
    {
      id: 'isolation',
      title: 'Engine isolation',
      description:
        'Все behavior-движки живут в `_internal/` adapters — design system может менять engine layer без churn в продуктах.',
    },
    {
      id: 'manifest',
      title: 'AI-native manifest',
      description:
        '`ai-patterns.json` и ESLint config — assembler выбирает blocks из каталога, а не «придумывает» layout и spacing.',
    },
  ],
  featured: {
    title: '12 pattern blocks',
    titleBreakBefore: ' pattern blocks',
    description:
      'Готовые marketing-секции с фиксированной структурой — от enterprise hero до contact form — для Storybook, Chromatic и consumer apps.',
  },
};

export const aicadsChooseUsDemoContent: Pick<
  ChooseUsBlockProps,
  'title' | 'titleAccent' | 'cards' | 'featured'
> = {
  title: 'Почему нас выбирают',
  titleAccent: 'нас выбирают',
  cards: [
    {
      id: 'responsive',
      size: 'wide',
      title: 'Отзывчивость',
      description:
        'Вопросы по API, tokens и интеграции — наш приоритет. Быстро реагируем и находим рабочие решения для продуктовых команд.',
    },
    {
      id: 'reliability',
      size: 'wide',
      title: 'Надёжность',
      description:
        'Semantic contracts, API Extractor и VRT — стабильный API surface, чтобы интерфейсы оставались предсказуемыми в production.',
    },
    {
      id: 'expertise',
      size: 'narrow',
      title: 'Экспертиза',
      description:
        'Не просто библиотека компонентов — партнёры команд, помогающие достигать целей UI-стандартизации и design system maturity.',
    },
    {
      id: 'flexibility',
      size: 'narrow',
      title: 'Гибкость и удобство',
      description:
        'Granular imports и ai-patterns — подключайте только нужные blocks и recipes без монолита и лишних зависимостей.',
    },
    {
      id: 'speed',
      size: 'narrow',
      title: 'Скорость',
      description:
        'Готовые marketing blocks и Storybook fixtures ускоряют запуск landing и внутренних продуктов в кратчайшие сроки.',
    },
  ],
  featured: {
    title: 'Заботливая поддержка',
    description:
      'ESLint config, isolation contract и актуальная документация — дизайн-система всегда рядом, чтобы ваш продукт работал без сбоев.',
  },
};

export const aicadsProcessDemoContent: Pick<ProcessBlockProps, 'title' | 'steps'> = {
  title: 'Как выглядит процесс',
  steps: [
    {
      id: 'audit',
      title: 'Анализ UI-стека',
      titleBreakBefore: ' UI-стека',
      description: 'Оцениваем текущие primitives, tokens, Storybook coverage и точки расхождения с целевым design system.',
    },
    {
      id: 'patterns',
      title: 'Подбор паттернов',
      description:
        'Собираем landing из ai-patterns.json — выбираем blocks и section recipes под задачу продукта, без импровизации layout.',
    },
    {
      id: 'integrate',
      title: 'Интеграция @ai-ds/core',
      description:
        'Подключаем tokens, Tailwind preset, eslint-config и granular imports blocks/components — consumer-код остаётся изолирован от engines.',
    },
    {
      id: 'support',
      title: 'Сопровождение и VRT',
      description:
        'Storybook, Chromatic и API Extractor фиксируют visual/API surface — команда получает предсказуемый релизный цикл.',
    },
  ],
};

export const aicadsEnterpriseFaqDemo: Pick<FAQBlockProps, 'variant' | 'title' | 'items'> = {
  variant: 'enterprise',
  title: 'Частые вопросы',
  items: [
    {
      id: 'consumer-radix',
      question: 'Можно ли импортировать Radix или cmdk напрямую в продуктовый код?',
      answer:
        'Нет — consumer-проекты работают только через semantic surface AICADS (`Modal`, `CommandPalette`, `Checkbox` и т.д.). Behavior-движки изолированы в `_internal/` adapters и контролируются ESLint config из `@ai-ds/core`.',
    },
    {
      id: 'ai-patterns',
      question: 'Как AI-assembler выбирает blocks для landing?',
      answer: (
        <>
          Через `ai-patterns.json` и page templates — assembler подставляет готовые секции (`marketing.hero.enterprise`,
          `marketing.process.timeline` и др.) с фиксированными spacing recipes, вместо генерации layout с нуля.
        </>
      ),
    },
    {
      id: 'tokens',
      question: 'Можно ли переопределить design tokens под бренд продукта?',
      answer:
        'Да. CSS variables из `tokens.css` и Tailwind preset можно переопределить в consumer-теме — primitives и blocks сохранят contract-driven appearance при корректной подмене semantic tokens.',
    },
    {
      id: 'storybook',
      question: 'Нужен ли Storybook для интеграции AICADS?',
      answer:
        'Для runtime в production — нет. Storybook нужен для визуальной регрессии (Chromatic), документации blocks и проверки spacing recipes до релиза design system.',
    },
    {
      id: 'granular-imports',
      question: 'Можно ли подключать только часть пакета — например, один block?',
      answer:
        'Да. Granular exports `@ai-ds/core/blocks/HeroBlock`, `@ai-ds/core/components/Button` и `@ai-ds/core/hooks` позволяют импортировать только нужные секции без монолита.',
    },
    {
      id: 'support',
      question: 'Что происходит после первичной интеграции?',
      answer:
        'Команда получает API Extractor report, ESLint isolation rules и VRT baseline — обновления `@ai-ds/core` проходят через semver и contract checks, без скрытых breaking changes в consumer-коде.',
    },
  ],
};

export const aicadsEnterpriseFooterDemo: FooterBlockProps = {
  variant: 'enterprise',
  logo: 'AICADS PRO',
  logoHref: '#',
  copyright: '© AICADS, 2026. Все права защищены',
  navLinks: [
    { label: 'О системе', href: '#about' },
    { label: 'Блоки', href: '#blocks' },
    { label: 'Примитивы', href: '#primitives' },
    { label: 'Storybook', href: '#storybook' },
    { label: 'Паттерны', href: '#patterns' },
    { label: 'Блог', href: '#blog' },
  ],
  contacts: [
    { label: 'Единый контакт', value: 'hello@aicads.dev', href: 'mailto:hello@aicads.dev' },
    { label: 'Техническая поддержка', value: 'support@aicads.dev', href: 'mailto:support@aicads.dev' },
    { label: 'Интеграция и внедрение', value: 'sales@aicads.dev', href: 'mailto:sales@aicads.dev' },
    { label: 'Telegram сообщества', value: '@aicads', href: 'https://t.me/aicads' },
  ],
  legalLinks: [
    { label: 'Политика обработки ПДн', href: '#privacy' },
    { label: 'Согласие на обработку ПДН', href: '#consent' },
    { label: 'Документация API', href: '#api-docs' },
    { label: 'Лицензия MIT', href: '#license' },
    { label: 'Changelog', href: '#changelog' },
    {
      label: 'AICADS — открытая дизайн-система для продуктовых команд и AI-assemblers',
      href: '#about-license',
      multiline: true,
    },
  ],
  showBackToTop: true,
};

/** Neutral partner names for logo cloud placeholders. */
export const aicadsPartnerLogos = [
  'Pattern Labs',
  'Token Studio',
  'UI Platform',
  'Design Ops',
  'Product DS',
  'Flow Team',
] as const;

/** CSF-safe copy for Storybook args (no spread operator). */
export const aicadsPartnerLogosList: string[] = [
  'Pattern Labs',
  'Token Studio',
  'UI Platform',
  'Design Ops',
  'Product DS',
  'Flow Team',
];
