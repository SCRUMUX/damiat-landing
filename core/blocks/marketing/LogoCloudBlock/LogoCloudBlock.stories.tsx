import type { Meta, StoryObj } from '@storybook/react';
import { LogoCloudBlock } from './LogoCloudBlock';

const meta: Meta<typeof LogoCloudBlock> = {
  title: 'Blocks/Marketing/LogoCloudBlock',
  component: LogoCloudBlock,
  parameters: { layout: 'fullscreen' },
  args: {
    logos: ['Pattern Labs', 'Token Studio', 'UI Platform', 'Design Ops', 'Product DS', 'Flow Team'],
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloudBlock>;

export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: 'tablet' } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
