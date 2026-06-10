import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesBlock } from './FeaturesBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';

const meta: Meta<typeof FeaturesBlock> = {
  title: 'Blocks/Marketing/FeaturesBlock',
  component: FeaturesBlock,
  parameters: marketingBlockParameters,
  args: {
    eyebrow: 'Why patterns',
    title: 'Why AICADS patterns',
    subtitle: 'Consistent rhythm across every generated landing page.',
    features: [
      {
        title: 'Pattern manifest',
        description: 'Replit picks blocks from ai-patterns.json — no improvised layout.',
        icon: '📋',
      },
      {
        title: 'Token recipes',
        description: 'Section spacing is fixed by named recipes, not magic numbers.',
        icon: '📐',
      },
      {
        title: 'Distributable',
        description: 'Import blocks in any consumer via @ai-ds/core/blocks/*.',
        icon: '📦',
      },
    ],
    columns: 3,
  },
};
export default meta;

type Story = StoryObj<typeof FeaturesBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
