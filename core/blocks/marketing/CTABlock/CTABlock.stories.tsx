import type { Meta, StoryObj } from '@storybook/react';
import { CTABlock } from './CTABlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const meta: Meta<typeof CTABlock> = {
  title: 'Blocks/Marketing/CTABlock',
  component: CTABlock,
  parameters: marketingBlockParameters,
  args: {
    title: 'Ship your next landing in minutes',
    description: 'One import. Five sections. Consistent rhythm.',
    variant: 'card',
    action: { label: 'Create project', href: '#' },
  },
};
export default meta;

type Story = StoryObj<typeof CTABlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };

export const Band: Story = {
  args: {
    variant: 'band',
    title: 'Ready to ship your SaaS landing?',
    description: 'Compose from ai-patterns.json — navbar to footer in one template.',
    action: { label: 'Start free', href: '#' },
    secondaryAction: { label: 'View Storybook', href: '#' },
  },
};
