import type { Meta, StoryObj } from '@storybook/react';
import { MarketingAboveFold } from '../../_shared/MarketingAboveFold';
import { BLOCK_HORIZONTAL_INSET_CLASS } from '../../_shared/blockLayout';
import { cn } from '../../../components/primitives/_shared';
import { HeroBlock } from '../HeroBlock/HeroBlock';
import { NavbarBlock } from './NavbarBlock';
import type { NavbarBlockProps } from './NavbarBlock.types';
import { aicadsProNavbarFixture } from './navbarBlock.fixtures';
import { aicadsEnterpriseHeroDemo } from '../marketingDemoContent';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const demoHero = aicadsEnterpriseHeroDemo;

function NavbarScrollFrame(props: NavbarBlockProps) {
  return (
    <div className="min-h-[200vh] bg-[var(--color-brand-primary)]">
      <NavbarBlock {...props} />
      <MarketingAboveFold underFixedNavbar>
        <HeroBlock {...demoHero} className="!bg-transparent" />
      </MarketingAboveFold>
      <div
        className={cn(
          'bg-[var(--color-surface-1)] text-[var(--color-text-primary)]',
          'py-[var(--space-section-y-xl)]',
          BLOCK_HORIZONTAL_INSET_CLASS,
        )}
      >
        <p className="text-style-body max-w-[var(--space-paragraph-max-tablet)]">
          Прокрутите страницу: navbar остаётся закреплённым; иконки соцсетей видны только до скролла под bar.
          Нажмите «Компоненты», чтобы открыть in-tree mega menu.
        </p>
        <div className="mt-[var(--space-section-content-xl)] flex flex-col gap-[var(--space-section-content-m)]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[var(--space-200)] rounded-[var(--radius-medium)] bg-[var(--color-surface-2)]"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const saasNavbarArgs: NavbarBlockProps = {
  variant: 'default',
  logo: 'AICADS',
  links: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '#' },
  ],
  cta: { label: 'Get started', href: '#' },
  sticky: true,
};

const meta: Meta<typeof NavbarBlock> = {
  title: 'Blocks/Marketing/NavbarBlock',
  component: NavbarBlock,
  parameters: marketingBlockParameters,
  args: aicadsProNavbarFixture,
  render: (args) => <NavbarScrollFrame {...args} />,
};
export default meta;

type Story = StoryObj<typeof NavbarBlock>;

/** AICADS PRO enterprise navbar — default entry point. */
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };

/** Mobile drawer open on load — verify insets, services panel, and CTA stack. */
export const MobileMenuOpen: Story = {
  args: aicadsProNavbarFixture,
  render: (args) => <NavbarScrollFrame {...args} defaultMobileOpen />,
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

/** Services mega menu open on load — verify tabbed panel without clicking. */
export const ServicesMenuOpen: Story = {
  args: aicadsProNavbarFixture,
  render: (args) => <NavbarScrollFrame {...args} defaultServicesOpen />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

/** Legacy compact SaaS navbar (backward compatible). */
export const SaaSDefault: Story = {
  args: saasNavbarArgs,
  render: (args) => <NavbarBlock {...args} />,
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
