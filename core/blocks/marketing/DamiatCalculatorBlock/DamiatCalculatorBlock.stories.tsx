import type { Meta, StoryObj } from '@storybook/react';
import { DamiatCalculatorBlock } from './DamiatCalculatorBlock';
import { marketingBlockParameters } from '../../_shared/blockStoryViewports';
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
