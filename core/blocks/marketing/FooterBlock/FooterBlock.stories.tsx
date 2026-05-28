import type { Meta, StoryObj } from '@storybook/react';
import { FooterBlock } from './FooterBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsEnterpriseFooterDemo } from '../marketingDemoContent';

const meta: Meta<typeof FooterBlock> = {
  title: 'Blocks/Marketing/FooterBlock',
  component: FooterBlock,
  parameters: marketingBlockParameters,
  args: {
    columns: [
      { title: 'Product', links: [{ label: 'Blocks', href: '#' }, { label: 'Docs', href: '#' }] },
      { title: 'Resources', links: [{ label: 'Storybook', href: '#' }, { label: 'GitHub', href: '#' }] },
      { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Contact', href: '#' }] },
    ],
    socialLinks: [
      { label: 'Twitter', href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'Discord', href: '#' },
    ],
    copyright: '© 2026 AICADS',
  },
};
export default meta;

type Story = StoryObj<typeof FooterBlock>;

export const Minimal: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const MinimalMobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

/** Cortel-style brand footer — nav, contacts, legal, back-to-top. */
export const Enterprise: Story = {
  args: aicadsEnterpriseFooterDemo,
  parameters: { viewport: { defaultViewport: 'desktop' }, controls: { disable: true } },
};

export const EnterpriseMobile: Story = {
  args: aicadsEnterpriseFooterDemo,
  parameters: { viewport: { defaultViewport: 'mobile' }, controls: { disable: true } },
};

export const EnterpriseTablet: Story = {
  args: aicadsEnterpriseFooterDemo,
  parameters: { viewport: { defaultViewport: 'tablet' }, controls: { disable: true } },
};

export const Desktop: Story = {
  render: () => <FooterBlock {...aicadsEnterpriseFooterDemo} />,
  parameters: { viewport: { defaultViewport: 'desktop' }, controls: { disable: true } },
};

export const Mobile: Story = {
  render: () => <FooterBlock {...aicadsEnterpriseFooterDemo} />,
  parameters: { viewport: { defaultViewport: 'mobile' }, controls: { disable: true } },
};

export const Tablet: Story = {
  render: () => <FooterBlock {...aicadsEnterpriseFooterDemo} />,
  parameters: { viewport: { defaultViewport: 'tablet' }, controls: { disable: true } },
};
