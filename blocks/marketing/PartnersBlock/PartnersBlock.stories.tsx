import type { Meta, StoryObj } from '@storybook/react';
import { PartnersBlock } from './PartnersBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsPartnersDemoContent } from '../marketingDemoContent';
import { withPartnersDemoMedia } from '../partnersDemoMedia';

const meta: Meta<typeof PartnersBlock> = {
  title: 'Blocks/Marketing/PartnersBlock',
  component: PartnersBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof PartnersBlock>;

const renderPartnersDemo = () => (
  <PartnersBlock {...withPartnersDemoMedia({ ...aicadsPartnersDemoContent })} />
);

/** Cortel-style partners band — dual marquee rows, grayscale logos, color on hover. */
export const Default: Story = {
  render: () => renderPartnersDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => renderPartnersDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => renderPartnersDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => renderPartnersDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
