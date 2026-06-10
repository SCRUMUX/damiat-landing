import type { Meta, StoryObj } from '@storybook/react';
import { NavbarBlock, aicadsProNavbarFixture } from '@ai-ds/core/blocks';
import { marketingBlockParameters } from '@ai-ds/core/storybook/marketingViewports';

/**
 * Consumer-path proof: enterprise navbar from installed @ai-ds/core package.
 */
const meta: Meta<typeof NavbarBlock> = {
  title: 'Consumer/Blocks/NavbarBlock',
  component: NavbarBlock,
  parameters: marketingBlockParameters,
};
export default meta;

type Story = StoryObj<typeof NavbarBlock>;

export const EnterpriseDesktop: Story = {
  args: aicadsProNavbarFixture,
  parameters: {
    ...marketingBlockParameters,
    viewport: { defaultViewport: 'desktop' },
  },
};
