import type { Meta, StoryObj } from '@storybook/react';
import { StatsBlock } from './StatsBlock';

const meta: Meta<typeof StatsBlock> = {
  title: 'Blocks/Marketing/StatsBlock',
  component: StatsBlock,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Built for scale',
    subtitle: 'Teams ship faster with AICADS pattern blocks.',
    stats: [
      { value: '10k+', label: 'Developers' },
      { value: '99.9%', label: 'Uptime SLA' },
      { value: '57', label: 'Primitives' },
      { value: '12', label: 'Marketing blocks' },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof StatsBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
