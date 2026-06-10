import type { Meta, StoryObj } from '@storybook/react';
import { DamiatCalculatorBlock } from './DamiatCalculatorBlock';
import { marketingBlockParameters } from '@ai-ds/core/blocks/_shared/blockStoryViewports';
import { damiatCalculatorContent } from '../damiatLandingFixtures';

const meta: Meta<typeof DamiatCalculatorBlock> = {
  title: 'Blocks/Marketing/DamiatCalculatorBlock',
  component: DamiatCalculatorBlock,
  parameters: marketingBlockParameters,
  args: damiatCalculatorContent,
};
export default meta;

type Story = StoryObj<typeof DamiatCalculatorBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };

export const Dark: Story = {
  parameters: { viewport: { defaultViewport: 'desktop' } },
  decorators: [
    (Story) => (
      <div data-theme="dark" className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        <Story />
      </div>
    ),
  ],
};
