import type { Meta, StoryObj } from '@storybook/react';
import { TrustBlock } from './TrustBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsTrustDemoContent } from '../marketingDemoContent';
import { withTrustFeaturedCover } from '../trustDemoMedia';

const meta: Meta<typeof TrustBlock> = {
  title: 'Blocks/Marketing/TrustBlock',
  component: TrustBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof TrustBlock>;

const renderTrustDemo = () => (
  <TrustBlock {...withTrustFeaturedCover({ ...aicadsTrustDemoContent })} />
);

/** Cortel-style trust band — featured pillar + 3 cards, divider, standards grid. */
export const Default: Story = {
  render: () => renderTrustDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => renderTrustDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => renderTrustDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => renderTrustDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
