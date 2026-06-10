import type { Meta, StoryObj } from '@storybook/react';
import { LandingPageTemplate } from './LandingPageTemplate';
import type { LandingPageTemplateProps } from './LandingPageTemplate';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsProNavbarFixture } from '../NavbarBlock/navbarBlock.fixtures';
import { aicadsProEnterpriseLandingArgs } from '../enterpriseLandingFixtures';
import {
  aicadsEnterpriseHeroDemoContent,
  aicadsPartnerLogosList,
  aicadsServicesDemoContent,
  aicadsSolutionsDemoContent,
  aicadsSolutionsCatalogDemoContent,
  aicadsSolutionsPageHeroDemoContent,
  aicadsSupportDemoContent,
  aicadsShowcasePanelDemoContent,
  aicadsBlogDemoContent,
  aicadsPartnersDemoContent,
  aicadsContactHeroDemoContent,
  aicadsWhyUsDemoContent,
  aicadsChooseUsDemoContent,
  aicadsProcessDemoContent,
  aicadsEnterpriseFaqDemo,
  aicadsTrustDemoContent,
  withEnterpriseHeroMedia,
} from '../marketingDemoContent';
import { withServiceCardMedia } from '../servicesDemoMedia';
import { withSolutionCardCovers } from '../solutionsDemoMedia';
import { withSolutionCatalogIcons } from '../SolutionsBlock/solutionsCatalogDemoMedia';
import { withTrustFeaturedCover } from '../trustDemoMedia';
import { withSupportDemoMedia } from '../supportDemoMedia';
import { withShowcasePanelDemoMedia } from '../showcasePanelDemoMedia';
import { withBlogDemoMedia } from '../blogDemoMedia';
import { withPartnersDemoMedia } from '../partnersDemoMedia';
import { withWhyUsDemoIcons } from '../whyUsDemoMedia';
import { chooseUsFeaturedDemoMedia, withChooseUsDemoIcons } from '../chooseUsDemoMedia';

const heroMedia = (
  <div
    className="flex aspect-[4/3] w-full items-center justify-center bg-[var(--color-surface-3)] text-style-body-sm text-[var(--color-text-muted)]"
    aria-hidden="true"
  >
    Dashboard preview
  </div>
);

const defaultPricing: LandingPageTemplateProps['pricing'] = {
  title: 'Pricing',
  subtitle: 'Start free, scale when you need more.',
  highlightedIndex: 1,
  tiers: [
    { name: 'Free', price: '$0', period: 'mo', features: ['Core primitives', '5 blocks'], actionLabel: 'Start' },
    { name: 'Pro', price: '$29', period: 'mo', features: ['All blocks', 'Pattern manifest', 'Storybook kit'], actionLabel: 'Upgrade' },
    { name: 'Team', price: '$99', period: 'mo', features: ['SSO', 'Custom patterns'], actionLabel: 'Contact' },
  ],
};

const meta: Meta<typeof LandingPageTemplate> = {
  title: 'Screens/Marketing Landing',
  component: LandingPageTemplate,
  parameters: marketingBlockParameters,
  args: {
    hero: {
      variant: 'split',
      align: 'left',
      badge: 'Pattern Layer',
      title: 'Build consistent interfaces with AICADS',
      subtitle: 'Distributable marketing blocks with token-driven spacing recipes.',
      primaryAction: { label: 'Get started', href: '#' },
      secondaryAction: { label: 'View patterns', href: '#' },
    },
    features: {
      title: 'Why patterns',
      subtitle: 'Replit selects blocks from ai-patterns.json — never improvises layout.',
      columns: 3,
      features: [
        { title: 'Pattern manifest', description: 'Machine-readable catalog for AI assemblers.', icon: '📋' },
        { title: 'Layout recipes', description: 'Named spacing for hero, pricing, footer sections.', icon: '📐' },
        { title: 'Consumer-ready', description: 'Import @ai-ds/core/blocks/* in any project.', icon: '📦' },
      ],
    },
    pricing: defaultPricing,
    cta: {
      title: 'Ship your next landing in minutes',
      description: 'One import. Five sections. Consistent rhythm.',
      action: { label: 'Create project', href: '#' },
    },
    footer: {
      columns: [
        { title: 'Product', links: [{ label: 'Blocks', href: '#' }, { label: 'Docs', href: '#' }] },
        { title: 'Resources', links: [{ label: 'Storybook', href: '#' }, { label: 'GitHub', href: '#' }] },
      ],
      socialLinks: [{ label: 'GitHub', href: '#' }, { label: 'Twitter', href: '#' }],
      copyright: '© 2026 AICADS',
    },
  },
};
export default meta;

type Story = StoryObj<typeof LandingPageTemplate>;

export const Default: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

/** Standalone pattern — centered hero only; body sections remain start-aligned. */
export const CenteredHero: Story = {
  args: {
    hero: {
      variant: 'centered',
      align: 'center',
      badge: 'Pattern Layer',
      title: 'Build consistent interfaces with AICADS',
      subtitle: 'Distributable marketing blocks with token-driven spacing recipes.',
      primaryAction: { label: 'Get started', href: '#' },
      secondaryAction: { label: 'View patterns', href: '#' },
    },
  },
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };

export const SaaSFull: Story = {
  args: {
    navbar: {
      variant: 'default',
      logo: 'AICADS',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
      ],
      cta: { label: 'Get started', href: '#' },
      sticky: true,
    },
    hero: {
      variant: 'split',
      align: 'left',
      badge: 'v0.7',
      title: 'Ship SaaS landings without layout drift',
      subtitle: 'Pattern blocks + section tokens keep AI-generated pages on rhythm.',
      stats: [
        { value: '12', label: 'Blocks' },
        { value: '14', label: 'Patterns' },
      ],
      primaryAction: { label: 'Start free', href: '#' },
      secondaryAction: { label: 'Browse Storybook', href: '#' },
    },
    logoCloud: {
      logos: aicadsPartnerLogosList,
    },
    stats: {
      stats: [
        { value: '10k+', label: 'Developers' },
        { value: '99.9%', label: 'Uptime' },
        { value: '57', label: 'Primitives' },
      ],
    },
    howItWorks: {
      steps: [
        { title: 'Install', description: 'Add @ai-ds/core and import tokens.' },
        { title: 'Compose', description: 'Pick patterns from the manifest.' },
        { title: 'Ship', description: 'Deploy with consistent section rhythm.' },
      ],
    },
    testimonials: {
      testimonials: [
        { quote: 'Our AI assembler finally stops inventing hero spacing.', author: 'Alex K.', role: 'Design Lead' },
        { quote: 'SaaS template covers 90% of our landing needs.', author: 'Jordan L.', role: 'Founder' },
        { quote: 'Storybook blocks are the source of truth.', author: 'Sam R.', role: 'Staff Eng' },
      ],
    },
    faq: {
      items: [
        { question: 'What is a pattern block?', answer: 'A pre-composed marketing section with fixed spacing recipes.' },
        { question: 'Can I customize tokens?', answer: 'Yes — override CSS variables in your theme.' },
      ],
    },
    cta: {
      variant: 'band',
      title: 'Build your next landing today',
      description: 'Full SaaS template with navbar, FAQ, and newsletter.',
      action: { label: 'Get started', href: '#' },
    },
    newsletter: {
      subtitle: 'Monthly pattern releases and migration guides.',
    },
  },
  render: (args) => (
    <LandingPageTemplate {...args} hero={{ ...args.hero, media: heroMedia }} />
  ),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

const aicadsProEnterpriseArgs: LandingPageTemplateProps = aicadsProEnterpriseLandingArgs;

function renderEnterpriseLanding(args: LandingPageTemplateProps) {
  return (
    <LandingPageTemplate
      {...args}
      hero={withEnterpriseHeroMedia(args.hero)}
      solutions={withSolutionCardCovers(aicadsSolutionsDemoContent)}
      solutionsPageHero={aicadsSolutionsPageHeroDemoContent}
      solutionsCatalog={withSolutionCatalogIcons({ ...aicadsSolutionsCatalogDemoContent })}
      services={withServiceCardMedia(aicadsServicesDemoContent)}
      support={withSupportDemoMedia(aicadsSupportDemoContent)}
      chooseUs={withChooseUsDemoIcons({
        ...aicadsChooseUsDemoContent,
        featured: {
          ...aicadsChooseUsDemoContent.featured,
          media: chooseUsFeaturedDemoMedia,
        },
      })}
      trust={withTrustFeaturedCover(aicadsTrustDemoContent)}
      showcasePanel={withShowcasePanelDemoMedia(aicadsShowcasePanelDemoContent)}
      contactHero={aicadsContactHeroDemoContent}
      whyUs={withWhyUsDemoIcons(aicadsWhyUsDemoContent)}
      process={aicadsProcessDemoContent}
      faq={aicadsEnterpriseFaqDemo}
      partners={withPartnersDemoMedia(aicadsPartnersDemoContent)}
      blog={withBlogDemoMedia(aicadsBlogDemoContent)}
    />
  );
}

export const AicadsProEnterprise: Story = {
  render: () =>
    renderEnterpriseLanding({
      ...aicadsProEnterpriseArgs,
      hero: aicadsEnterpriseHeroDemoContent,
    }),
  parameters: {
    ...marketingBlockParameters,
    viewport: { defaultViewport: 'desktop' },
    controls: { disable: true },
  },
};

export const AicadsProEnterpriseMobile: Story = {
  render: () =>
    renderEnterpriseLanding({
      ...aicadsProEnterpriseArgs,
      hero: aicadsEnterpriseHeroDemoContent,
    }),
  parameters: {
    ...marketingBlockParameters,
    viewport: { defaultViewport: 'mobile' },
    controls: { disable: true },
  },
};

export const AicadsProEnterpriseTablet: Story = {
  render: () =>
    renderEnterpriseLanding({
      ...aicadsProEnterpriseArgs,
      hero: aicadsEnterpriseHeroDemoContent,
    }),
  parameters: {
    ...marketingBlockParameters,
    viewport: { defaultViewport: 'tablet' },
    controls: { disable: true },
  },
};
