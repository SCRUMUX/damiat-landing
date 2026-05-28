import type { Meta, StoryObj } from '@storybook/react';
import { MarketingAboveFold } from '../../_shared/MarketingAboveFold';
import { NavbarBlock } from '../NavbarBlock/NavbarBlock';
import { aicadsProNavbarFixture } from '../NavbarBlock/navbarBlock.fixtures';
import {
  aicadsEnterpriseHeroDemoContent,
  aicadsPageHeroDemoContent,
  aicadsSolutionsPageHeroDemoContent,
  withEnterpriseHeroMedia,
} from '../marketingDemoContent';
import { solutionsPageHeroMedia } from '../solutionsPageHeroMedia';
import { HeroBlock } from './HeroBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const mediaPlaceholder = (
  <div
    className="flex aspect-[4/3] w-full items-center justify-center bg-[var(--color-surface-3)] text-style-body-sm text-[var(--color-text-muted)]"
    aria-hidden="true"
  >
    Product screenshot
  </div>
);

const meta: Meta<typeof HeroBlock> = {
  title: 'Blocks/Marketing/HeroBlock',
  component: HeroBlock,
  parameters: marketingBlockParameters,
  args: {
    badge: 'New',
    title: 'Build consistent interfaces with AICADS',
    subtitle: 'Token-driven pattern blocks so Replit and AI never improvise layout or spacing.',
    align: 'center',
    variant: 'centered',
    primaryAction: { label: 'Get started', href: '#' },
    secondaryAction: { label: 'View docs', href: '#' },
  },
};
export default meta;

type Story = StoryObj<typeof HeroBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };

/** Cortel-style enterprise hero — split stage + bottom metrics band. */
export const Enterprise: Story = {
  args: aicadsEnterpriseHeroDemoContent,
  render: (args) => <HeroBlock {...withEnterpriseHeroMedia(args)} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const EnterpriseMobile: Story = {
  args: aicadsEnterpriseHeroDemoContent,
  render: (args) => <HeroBlock {...withEnterpriseHeroMedia(args)} />,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

/** With overlay enterprise navbar — matches AicadsProEnterprise landing above-fold. */
export const EnterpriseWithNavbar: Story = {
  args: aicadsEnterpriseHeroDemoContent,
  render: (args) => (
    <div className="min-h-[120vh]">
      <NavbarBlock {...aicadsProNavbarFixture} />
      <MarketingAboveFold underFixedNavbar>
        <HeroBlock {...withEnterpriseHeroMedia(args)} className="!bg-transparent" />
      </MarketingAboveFold>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const EnterpriseWithNavbarMobile: Story = {
  args: aicadsEnterpriseHeroDemoContent,
  render: (args) => (
    <div className="min-h-[120vh]">
      <NavbarBlock {...aicadsProNavbarFixture} />
      <MarketingAboveFold underFixedNavbar>
        <HeroBlock {...withEnterpriseHeroMedia(args)} className="!bg-transparent" />
      </MarketingAboveFold>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

/** Inner-page hero — breadcrumbs → badge → title (Cortel case study). */
export const Page: Story = {
  args: aicadsPageHeroDemoContent,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

/** Cortel /solutions page hero — muted panel, breadcrumb, title + description, decorative media. */
export const SolutionsPage: Story = {
  args: aicadsSolutionsPageHeroDemoContent,
  render: (args) => <HeroBlock {...args} media={solutionsPageHeroMedia} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const SolutionsPageMobile: Story = {
  args: aicadsSolutionsPageHeroDemoContent,
  render: (args) => <HeroBlock {...args} media={solutionsPageHeroMedia} />,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const PageMobile: Story = {
  args: aicadsPageHeroDemoContent,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

/** Page hero with overlay enterprise navbar. */
export const PageWithNavbar: Story = {
  args: aicadsPageHeroDemoContent,
  render: (args) => (
    <div className="min-h-[120vh]">
      <NavbarBlock {...aicadsProNavbarFixture} />
      <MarketingAboveFold underFixedNavbar>
        <HeroBlock {...args} className="!bg-transparent" />
      </MarketingAboveFold>
    </div>
  ),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const SplitWithMedia: Story = {
  args: {
    variant: 'split',
    align: 'left',
    badge: 'Pattern Layer v0.7',
    stats: [
      { value: '12', label: 'Marketing blocks' },
      { value: '57', label: 'Primitives' },
      { value: '14', label: 'Patterns' },
    ],
  },
  render: (args) => <HeroBlock {...args} media={mediaPlaceholder} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
