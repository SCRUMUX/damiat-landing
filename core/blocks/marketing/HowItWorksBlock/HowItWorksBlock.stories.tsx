import type { Meta, StoryObj } from '@storybook/react';
import { HowItWorksBlock } from './HowItWorksBlock';

const meta: Meta<typeof HowItWorksBlock> = {
  title: 'Blocks/Marketing/HowItWorksBlock',
  component: HowItWorksBlock,
  parameters: { layout: 'fullscreen' },
  args: {
    subtitle: 'From tokens to production landing pages in three steps.',
    steps: [
      {
        title: 'Install @ai-ds/core',
        description: 'Add the package and import CSS tokens into your app shell.',
      },
      {
        title: 'Pick patterns',
        description: 'Use ai-patterns.json or Storybook to choose marketing blocks.',
      },
      {
        title: 'Ship',
        description: 'Compose sections with LandingPageTemplate or individual blocks.',
      },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof HowItWorksBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
