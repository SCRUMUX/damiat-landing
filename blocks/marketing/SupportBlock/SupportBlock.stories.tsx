import type { Meta, StoryObj } from '@storybook/react';
import { SupportBlock } from './SupportBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
import { aicadsSupportDemoContent } from '../marketingDemoContent';
import { withSupportDemoMedia } from '../supportDemoMedia';

const meta: Meta<typeof SupportBlock> = {
  title: 'Blocks/Marketing/SupportBlock',
  component: SupportBlock,
  parameters: {
    ...marketingBlockParameters,
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof SupportBlock>;

const renderSupportDemo = () => (
  <SupportBlock {...withSupportDemoMedia({ ...aicadsSupportDemoContent })} />
);

/** Cortel-style support band — split header, image stat cards, contact rows. */
export const Default: Story = {
  render: () => renderSupportDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};

export const Mobile: Story = {
  render: () => renderSupportDemo(),
  parameters: { viewport: { defaultViewport: 'mobile' } },
};

export const Tablet: Story = {
  render: () => renderSupportDemo(),
  parameters: { viewport: { defaultViewport: 'tablet' } },
};

export const Desktop: Story = {
  render: () => renderSupportDemo(),
  parameters: { viewport: { defaultViewport: 'desktop' } },
};
