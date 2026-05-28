import type { Meta, StoryObj } from '@storybook/react';
import { PricingBlock } from './PricingBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const meta: Meta<typeof PricingBlock> = {
  title: 'Blocks/Marketing/PricingBlock',
  component: PricingBlock,
  parameters: marketingBlockParameters,
  args: {
    title: 'Pricing',
    subtitle: 'Start free, scale when you need more.',
    highlightedIndex: 1,
    tiers: [
      { name: 'Free', price: '$0', period: 'mo', features: ['Core primitives', '5 blocks', 'Community support'], actionLabel: 'Start' },
      { name: 'Pro', price: '$29', period: 'mo', features: ['All blocks', 'Pattern manifest', 'Storybook kit'], actionLabel: 'Upgrade' },
      { name: 'Team', price: '$99', period: 'mo', features: ['SSO', 'Custom patterns', 'Priority support'], actionLabel: 'Contact' },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof PricingBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
