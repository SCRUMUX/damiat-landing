import type { NavbarBlockProps } from './NavbarBlock.types';

/** AICADS PRO enterprise navbar — sample data for Storybook and pattern manifests.
 *
 * Requires `hero.appearance="brand"` and `LandingPageTemplate` above-fold shell when `overlay=true`.
 */
export const aicadsProNavbarFixture: NavbarBlockProps = {
  variant: 'enterprise',
  logo: 'AICADS PRO',
  sticky: true,
  overlay: true,
  links: [
    { label: 'Компоненты', megaMenu: true },
    { label: 'Документация', href: '/docs' },
    { label: 'Паттерны', href: '/patterns' },
    { label: 'Storybook', href: '/storybook' },
  ],
  phone: {
    number: 'v0.7.2 stable',
    href: '#changelog',
    status: { label: 'Migration guides', href: '#migrations' },
  },
  accountCta: { label: 'GitHub', href: 'https://github.com/SCRUMUX/AICADS-PRO', icon: 'user' },
  cta: { label: 'Начать интеграцию', href: '#start', icon: 'send' },
  socialLinks: [
    { label: 'Telegram', href: 'https://t.me/', icon: 'telegram' },
    { label: 'Support', href: '#support', icon: 'phone' },
    { label: 'VK', href: 'https://vk.com/', icon: 'vk' },
    { label: 'YouTube', href: 'https://youtube.com/', icon: 'youtube' },
  ],
  servicesMenu: [
    {
      id: 'primitives',
      label: 'Примитивы',
      items: [
        { label: 'Button', href: '/components/button', description: 'CTA и actions по contract.json' },
        { label: 'Modal', href: '/components/modal', description: 'Диалоги через Radix adapter' },
        { label: 'Table', href: '/components/table', description: 'Data grid с token-driven ячейками' },
        { label: 'Form controls', href: '/components/forms', description: 'Input, Select, Checkbox, Switch' },
        { label: 'Navigation', href: '/components/navigation', description: 'Tabs, Dropdown, Breadcrumb' },
        { label: 'Feedback', href: '/components/feedback', description: 'Alert, Toast, Spinner, Progress' },
      ],
    },
    {
      id: 'blocks',
      label: 'Блоки',
      items: [
        { label: 'HeroBlock', href: '/blocks/hero', description: 'Enterprise / page hero + metrics band' },
        { label: 'EventsBlock', href: '/blocks/events', description: 'Brand band с carousel навигацией' },
        { label: 'SolutionsBlock', href: '/blocks/solutions', description: 'Кейсы внедрения — mosaic grid + hover' },
        { label: 'TrustBlock', href: '/blocks/trust', description: 'Pillars + standards grid (reliability band)' },
        { label: 'SupportBlock', href: '/blocks/support', description: 'Image stat cards + contact channels' },
        { label: 'ShowcasePanelBlock', href: '/blocks/showcase-panel', description: 'Flex accordion + crossfade UI preview' },
        { label: 'BlogBlock', href: '/blocks/blog', description: 'Horizontal article slider с prev/next' },
        { label: 'PartnersBlock', href: '/blocks/partners', description: 'Dual marquee — grayscale logos, color on hover' },
        { label: 'ServicesBlock', href: '/blocks/services', description: 'Catalog с tabs и show-more pagination' },
        { label: 'NavbarBlock', href: '/blocks/navbar', description: 'Overlay navbar + services mega menu' },
        { label: 'LandingPageTemplate', href: '/blocks/landing', description: 'Полная enterprise landing-страница' },
      ],
    },
    {
      id: 'tooling',
      label: 'Инструменты',
      items: [
        { label: 'Storybook Kit', href: '/storybook', description: 'Preview, viewports, engine-styles' },
        { label: 'Figma Plugin', href: '/figma', description: 'Sync с manifests и contracts' },
        { label: 'ESLint Config', href: '/eslint', description: 'Isolation contract для consumer' },
        { label: 'Tailwind Preset', href: '/tailwind', description: 'Token mapping из tokens.css' },
      ],
    },
    {
      id: 'resources',
      label: 'Ресурсы',
      items: [
        { label: 'Design Tokens', href: '/tokens', description: 'CSS variables и ai-ds-spec.json' },
        { label: 'Contracts', href: '/contracts', description: 'JSON schemas компонентов' },
        { label: 'ai-patterns.json', href: '/patterns', description: 'Каталог pattern blocks' },
        { label: 'ARCHITECTURE.md', href: '/architecture', description: 'Слои движка и consumer workflow' },
      ],
    },
  ],
};
