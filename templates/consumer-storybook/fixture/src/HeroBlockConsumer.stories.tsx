import type { Meta, StoryObj } from '@storybook/react';
import { HeroBlock } from '@ai-ds/core/blocks/HeroBlock';

/**
 * Consumer-path proof: block imported from installed @ai-ds/core package.
 */
const meta: Meta<typeof HeroBlock> = {
  title: 'Consumer/Blocks/HeroBlock',
  component: HeroBlock,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof HeroBlock>;

export const FromPackage: Story = {
  args: {
    title: 'Consumer fixture — HeroBlock from @ai-ds/core',
    subtitle: 'This story imports the block via package export, not monorepo path.',
    align: 'center',
    primaryAction: { label: 'OK', onClick: () => {} },
  },
};
